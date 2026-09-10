import assert from 'node:assert/strict';
import test from 'node:test';
import { validateContext } from '../lib/context.mjs';

const workflow = '.ai/core/workflows/implementation.md';
function task(overrides = {}) {
  const fields = {
    schema: '1',
    status: 'ready',
    owned: 'src/cart/, test/cart.test.mjs',
    risk: 'medium',
    workflow,
    dependencies: 'none',
    ...overrides,
  };
  return `# Preserve cart quantity\n\nTask schema: ${fields.schema}\nStatus: ${fields.status}\nOwned files: ${fields.owned}\nRisk: ${fields.risk}\nWorkflow: ${fields.workflow}\nDependencies: ${fields.dependencies}\n\n## Objective\n\nPreserve a selected quantity when the cart is reopened.\n\n## Scope\n\nUpdate cart persistence and its regression coverage.\n\n## Acceptance\n\n- [x] Reopening a cart restores the selected quantity.\n\n## Evidence\n\nThe synthetic cart regression passed with Node 22 on 2026-09-06.\n\n## Review\n\nThe cart diff was reviewed; no high or critical findings remain.\n\n## Handoff\n\nQuantity persistence is complete; the next task can address cart labels.\n`;
}
function fixture() {
  const manifest = {
    schemaVersion: 1,
    projectProfile: '.ai/project.json',
    currentTask: '.ai/tasks/current.md',
    readOnStart: ['AGENTS.md', '.ai/core/start.md'],
    workflows: [workflow],
  };
  const project = {
    schemaVersion: 1,
    name: 'Synthetic cart',
    stack: 'Node.js',
    commands: [],
    protectedBoundaries: ['Cart core stays independent of storage adapters.'],
    architectureDocuments: ['docs/architecture.md'],
    designDocuments: [],
    externalReferences: [],
  };
  const files = new Map([
    ['.ai/manifest.json', JSON.stringify(manifest)],
    ['.ai/project.json', JSON.stringify(project)],
    ['AGENTS.md', 'Read .ai/manifest.json.'],
    ['.ai/core/start.md', '# Start\nRead the current task.'],
    [workflow, '# Implementation\nImplement the scoped task.'],
    ['docs/architecture.md', '# Cart architecture\nUse a storage adapter.'],
    ['.ai/tasks/current.md', task()],
  ]);
  const reads = [];
  return {
    files,
    reads,
    manifest,
    project,
    check() {
      files.set('.ai/manifest.json', JSON.stringify(manifest));
      files.set('.ai/project.json', JSON.stringify(project));
      return validateContext({
        readFile: (file) => {
          reads.push(file);
          return files.get(file) ?? null;
        },
        today: '2026-09-06',
      });
    },
  };
}
const errors = (result) => result.errors.join('\n');

test('a scoped task and linked project documents validate without executing commands', () => {
  const f = fixture();
  f.project.commands = [
    { id: 'test', command: 'node --test', mode: 'local-write', status: 'available' },
  ];
  const result = f.check();
  assert.equal(result.ok, true, errors(result));
  assert.equal(result.context.task.status, 'ready');
  assert.equal(result.context.project.name, 'Synthetic cart');
});

test('empty completed tasks and blank or placeholder completion sections fail', () => {
  const f = fixture();
  f.files.set(
    '.ai/tasks/current.md',
    '# Empty\nStatus: complete\nOwned files:\n\n## Objective\n\n## Scope\n\n## Acceptance\n\n## Evidence\n\n## Handoff\n',
  );
  assert.equal(f.check().ok, false);
  for (const section of ['Objective', 'Scope', 'Acceptance', 'Evidence', 'Review', 'Handoff']) {
    for (const body of ['', '<!-- fill later -->', 'TBD', '- [ ]']) {
      f.files.set(
        '.ai/tasks/current.md',
        task({ status: 'complete' }).replace(
          new RegExp(`(## ${section}\\n)[\\s\\S]*?(?=\\n## |$)`),
          `$1\n${body}\n`,
        ),
      );
      const result = f.check();
      assert.equal(result.ok, false, `${section}: ${body}`);
      assert.match(errors(result), new RegExp(section));
    }
  }
});

test('a task hidden entirely in an HTML comment cannot supply completion metadata or sections', () => {
  const f = fixture();
  f.files.set('.ai/tasks/current.md', `<!--\n${task({ status: 'complete' })}\n-->`);
  assert.equal(f.check().ok, false);
});

test('ownership must name nonempty safe scoped targets', () => {
  for (const owned of [
    '',
    '*',
    '**/*',
    '.',
    '/',
    '../outside',
    'src/../../outside',
    '.git/config',
    '.env',
    'TODO',
    'list explicit paths or scoped globs',
  ]) {
    const f = fixture();
    f.files.set('.ai/tasks/current.md', task({ owned }));
    const result = f.check();
    assert.equal(result.ok, false, owned);
    assert.match(errors(result), /Owned files/);
  }
  for (const owned of ['src/', 'src/**/*.ts, test/*.mjs', '.ai/project.json, AGENTS.md']) {
    const f = fixture();
    f.files.set('.ai/tasks/current.md', task({ owned }));
    assert.equal(f.check().ok, true, owned);
  }
});

test('all documented lifecycle states validate with explicit risk and workflow metadata', () => {
  for (const status of [
    'draft',
    'discovery',
    'ready',
    'in_progress',
    'verification',
    'review',
    'complete',
    'blocked',
    'cancelled',
  ]) {
    const f = fixture();
    f.files.set('.ai/tasks/current.md', task({ status }));
    assert.equal(f.check().ok, true, status);
  }
  for (const overrides of [
    { status: 'done' },
    { risk: '' },
    { risk: 'unknown' },
    { workflow: '' },
    { workflow: '.ai/core/workflows/missing.md' },
  ]) {
    const f = fixture();
    f.files.set('.ai/tasks/current.md', task(overrides));
    assert.equal(f.check().ok, false, JSON.stringify(overrides));
  }
});

test('current legacy tasks require explicit migration while unrelated history is preserved', () => {
  const f = fixture();
  f.files.set('.ai/tasks/legacy.md', '# Historical task\nStatus: complete\n');
  assert.equal(f.check().ok, true);
  assert.equal(f.reads.includes('.ai/tasks/legacy.md'), false);
  f.files.set('.ai/tasks/current.md', task().replace('Task schema: 1\n', ''));
  assert.match(errors(f.check()), /migrat.*Task schema: 1/i);
});

test('missing manifest and project document references fail instead of reporting success', () => {
  for (const key of ['architectureDocuments', 'designDocuments']) {
    const f = fixture();
    f.project[key] = ['docs/missing.md'];
    assert.match(errors(f.check()), /Missing.*docs\/missing\.md/);
  }
  const f = fixture();
  f.manifest.readOnStart.push('docs/missing.md');
  assert.match(errors(f.check()), /Missing manifest target/);
  delete f.project.designDocuments;
  assert.match(errors(f.check()), /designDocuments.*array/);
});

test('unsafe references are rejected before the reader sees their targets', () => {
  for (const target of [
    '../outside.md',
    '/outside.md',
    'C:/outside.md',
    '.env.private.json',
    '.envrc.json',
    '.git/config.md',
    'node_modules/pkg/readme.md',
    'docs/%2e%2e/private.md',
    'docs/secret.pem',
    'https://example.com/instructions.md',
  ]) {
    const f = fixture();
    f.project.architectureDocuments = [target];
    assert.equal(f.check().ok, false, target);
    assert.equal(f.reads.includes(target), false, target);
  }
});

test('a registered task workflow must be a Markdown instruction document', () => {
  const f = fixture();
  f.manifest.workflows = ['.ai/project.json'];
  f.files.set('.ai/tasks/current.md', task({ workflow: '.ai/project.json' }));
  assert.match(errors(f.check()), /Workflow.*Markdown/);
});

test('linked Markdown task and project documents reject broken relative links and unsafe targets', () => {
  const f = fixture();
  f.files.set('docs/architecture.md', '# Architecture\nRead [storage](storage.md).');
  assert.match(errors(f.check()), /docs\/storage\.md/);
  f.files.set('docs/storage.md', '# Storage\nAn application-owned port.');
  assert.equal(f.check().ok, true);
  f.files.set('.ai/tasks/current.md', `${task()}\nSee [decision](../../docs/architecture.md).\n`);
  assert.equal(f.check().ok, true);
  f.files.set('docs/storage.md', '# Storage\nRead [private](../.env.private.json).');
  assert.equal(f.check().ok, false);
  assert.equal(f.reads.includes('.env.private.json'), false);
});

test('task dependencies reject cycles and incomplete prerequisites for active and complete tasks', () => {
  const f = fixture();
  f.files.set('.ai/tasks/current.md', task({ dependencies: '.ai/tasks/setup.md' }));
  assert.match(errors(f.check()), /Missing.*setup\.md/);
  f.files.set('.ai/tasks/setup.md', task({ status: 'in_progress' }));
  assert.match(errors(f.check()), /dependenc.*complete/i);
  f.files.set(
    '.ai/tasks/current.md',
    task({ status: 'draft', dependencies: '.ai/tasks/setup.md' }),
  );
  assert.equal(f.check().ok, true);
  f.files.set('.ai/tasks/setup.md', task({ status: 'complete' }));
  f.files.set(
    '.ai/tasks/current.md',
    task({ status: 'complete', dependencies: '.ai/tasks/setup.md' }),
  );
  assert.equal(f.check().ok, true);
  f.files.set(
    '.ai/tasks/setup.md',
    task({ status: 'complete', dependencies: '.ai/tasks/current.md' }),
  );
  assert.match(errors(f.check()), /cycle/i);
});

test('completed tasks reject unchecked acceptance and duplicate metadata', () => {
  const f = fixture();
  f.files.set('.ai/tasks/current.md', task({ status: 'complete' }).replace('- [x]', '- [ ]'));
  assert.match(errors(f.check()), /unchecked.*Acceptance/i);
  f.files.set(
    '.ai/tasks/current.md',
    task().replace('Status: ready', 'Status: ready\nStatus: complete'),
  );
  assert.match(errors(f.check()), /duplicate.*Status/i);
});

test('deferrals require accountable metadata and a real nonexpired ISO date', () => {
  const command = {
    id: 'browser',
    command: 'browser-test',
    mode: 'local-write',
    status: 'deferred',
    owner: 'Project maintainer',
    trigger: 'Browser becomes available',
    fallback: 'Review keyboard behavior locally',
    expires: '2026-10-01',
  };
  for (const field of ['owner', 'trigger', 'fallback', 'expires']) {
    const f = fixture();
    f.project.commands = [{ ...command }];
    delete f.project.commands[0][field];
    assert.match(errors(f.check()), new RegExp(`deferred command ${field}`));
  }
  for (const expires of ['2026-9-30', '2026-02-30', 'yesterday', '2026-09-05']) {
    const f = fixture();
    f.project.commands = [{ ...command, expires }];
    assert.equal(f.check().ok, false, expires);
  }
  const f = fixture();
  f.project.commands = [command];
  f.project.deferrals = [
    {
      id: 'native-client',
      reason: 'The client is unavailable',
      owner: 'Project maintainer',
      trigger: 'Client installed',
      fallback: 'Run standalone checker',
      expires: '2026-10-01',
    },
  ];
  assert.equal(f.check().ok, true);
});

test('external guidance links a local review artifact without fetching external sources', () => {
  const f = fixture();
  f.project.externalReferences = ['docs/reference-review.md'];
  assert.match(errors(f.check()), /Missing.*reference-review/);
  f.files.set(
    'docs/reference-review.md',
    '# Reference review\nThe maintainer reviewed version 1.2.3; project policy remains authoritative.',
  );
  assert.equal(f.check().ok, true);
  assert.equal(
    f.reads.some((file) => file.startsWith('https:')),
    false,
  );
  f.project.externalReferences = ['https://example.com/docs'];
  assert.equal(f.check().ok, false);
});

test('reader failures return actionable diagnostics rather than a false success', () => {
  const result = validateContext({
    readFile: () => {
      throw new Error('Symlink boundary');
    },
    today: '2026-09-06',
  });
  assert.equal(result.ok, false);
  assert.match(errors(result), /Symlink boundary/);
});
