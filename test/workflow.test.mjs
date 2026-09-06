import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  applyPlan,
  buildBundle,
  check,
  digest,
  ejectPlan,
  inspect,
  makePlan,
  rootPath,
  validateBundle,
  writeNewJson,
} from '../lib/workflow.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = buildBundle(source);
const legacyArtifact = fs.readFileSync(
  path.join(source, 'test/fixtures/workflow-1.0.0.json'),
  'utf8',
);
const legacyBundle = JSON.parse(legacyArtifact);
const write = (root, file, content) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
};
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-test-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function install(root, release = bundle) {
  return applyPlan(root, release, makePlan(root, release));
}
function changedRelease(mutator) {
  const copy = structuredClone(bundle);
  delete copy.sourceDigest;
  copy.version = '1.1.1';
  mutator(copy);
  return { ...copy, sourceDigest: digest(copy) };
}

test('bundle is deterministic, bounded and excludes historical policies', () => {
  assert.deepEqual(bundle, buildBundle(source));
  assert(bundle.files.every((file) => !/^(skills|commands|agents)\//.test(file.path)));
  assert(!bundle.files.some((file) => file.path.endsWith('settings.json')));
  assert(
    bundle.files
      .filter((file) => file.path.startsWith('.ai/core/'))
      .every((file) => !/Recto|Aufnehmen|MongoDB|Next\.js|pnpm/.test(file.content)),
  );
});

test('new bundles use the Auterix identity and a distinct compatible release version', () => {
  assert.equal(bundle.source, 'SapanMozammel/auterix');
  assert.equal(bundle.version, '1.1.0');
  assert.notEqual(bundle.sourceDigest, legacyBundle.sourceDigest);
});

test('new bundles carry the root license notice as managed consumer content', () => {
  const notice = bundle.files.find((file) => file.path === '.ai/core/LICENSE.md');
  assert(notice, 'consumer bundles must retain the distribution license');
  assert.equal(notice.ownership, 'managed');
  assert.equal(notice.content, read(source, 'LICENSE'));
  assert(notice.content.startsWith('MIT License\n'));
});

test('the immutable historical bundle retains its original provenance and digest', () => {
  assert.equal(
    digest(legacyArtifact),
    'ebf2487e1ddfb29dec6efaa8909e389599caedc6d6f3f95f90567eb9ed0b2ac2',
  );
  assert.equal(legacyBundle.source, 'SapanMozammel/claude-workflow');
  assert.equal(legacyBundle.version, '1.0.0');
  assert.equal(
    legacyBundle.sourceDigest,
    'a073d5251e29ecffa545afa11ee1bf05cb21b198f5de86bfb2c5de56c9425d43',
  );
  assert.equal(validateBundle(legacyBundle), legacyBundle);
});

test('legacy consumers migrate through a reviewed update and retain their project state', (t) => {
  const root = fixture(t);
  install(root, legacyBundle);
  const checker = path.join(root, '.ai/tools/check.mjs');
  const runChecker = () => spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
  const originalCheck = runChecker();
  assert.equal(originalCheck.status, 0, originalCheck.stderr);
  assert.equal(JSON.parse(originalCheck.stdout).version, '1.0.0');

  write(root, 'AGENTS.md', `${read(root, 'AGENTS.md')}\nPreserve the project review policy.\n`);
  const profile = JSON.parse(read(root, '.ai/project.json'));
  profile.name = 'Existing project';
  write(root, '.ai/project.json', JSON.stringify(profile));
  write(root, '.ai/tasks/history.md', '# Preserved project history\n');
  const manifest = JSON.parse(read(root, '.ai/manifest.json'));
  manifest.readOnStart.push('.ai/tasks/history.md');
  write(root, '.ai/manifest.json', JSON.stringify(manifest));
  write(root, '.ai/tasks/current.md', `${read(root, '.ai/tasks/current.md')}\nExisting handoff.\n`);
  const preserved = new Map(
    [
      'AGENTS.md',
      '.ai/project.json',
      '.ai/manifest.json',
      '.ai/tasks/current.md',
      '.ai/tasks/history.md',
    ].map((file) => [file, read(root, file)]),
  );

  const previousLock = read(root, '.ai/workflow.lock.json');
  const plan = makePlan(root, bundle, 'update');
  assert.equal(read(root, '.ai/workflow.lock.json'), previousLock, 'preview is read-only');
  assert(
    plan.actions
      .filter((action) => action.ownership === 'project')
      .every((action) => action.action === 'preserve'),
  );
  assert.equal(
    plan.actions.find((action) => action.path === '.ai/tools/workflow.mjs').action,
    'update',
  );
  assert.equal(
    plan.actions.find((action) => action.path === '.ai/core/LICENSE.md').action,
    'create',
  );
  const applied = applyPlan(root, bundle, plan);
  assert.equal(applied.version, '1.1.0');
  assert.equal(applied.sourceDigest, bundle.sourceDigest);
  const lock = JSON.parse(read(root, '.ai/workflow.lock.json'));
  assert.equal(lock.source, 'SapanMozammel/auterix');
  assert.equal(lock.version, '1.1.0');
  assert.equal(lock.sourceDigest, bundle.sourceDigest);
  assert.equal(read(root, '.ai/core/LICENSE.md'), read(source, 'LICENSE'));
  assert.equal(lock.files['.ai/core/LICENSE.md'], digest(read(source, 'LICENSE')));
  for (const [file, content] of preserved) assert.equal(read(root, file), content);
  assert(check(root).ok);
  const upgradedCheck = runChecker();
  assert.equal(upgradedCheck.status, 0, upgradedCheck.stderr);
  assert.equal(JSON.parse(upgradedCheck.stdout).version, '1.1.0');
  assert.equal(JSON.parse(upgradedCheck.stdout).commandsExecuted, 0);
  assert.equal(applyPlan(root, bundle, makePlan(root, bundle, 'update')).applied, 0);
});

test('only the exact canonical and legacy source identities are accepted', (t) => {
  const root = fixture(t);
  for (const identity of [
    'unknown/source',
    'SapanMozammel/auterix-untrusted',
    'sapanmozammel/auterix',
    'https://github.com/SapanMozammel/auterix',
  ]) {
    const { sourceDigest, ...payload } = structuredClone(bundle);
    payload.source = identity;
    const rejected = { ...payload, sourceDigest: digest(payload) };
    assert.throws(() => makePlan(root, rejected), /Invalid bundle metadata/);
    assert.deepEqual(fs.readdirSync(root), []);
  }
  install(root, legacyBundle);
  const original = JSON.parse(read(root, '.ai/workflow.lock.json'));
  for (const identity of ['unknown/source', 'SapanMozammel/auterix-untrusted']) {
    const tampered = JSON.stringify({ ...original, source: identity });
    write(root, '.ai/workflow.lock.json', tampered);
    assert.throws(() => makePlan(root, bundle, 'update'), /Invalid workflow lock/);
    assert.equal(read(root, '.ai/workflow.lock.json'), tampered);
    assert(!fs.existsSync(path.join(root, '.ai/workflow.writer.json')));
  }
});

test('renaming the source does not bypass legacy managed drift or reviewed-plan binding', (t) => {
  const root = fixture(t);
  install(root, legacyBundle);
  const lockBefore = read(root, '.ai/workflow.lock.json');
  const reviewedPlan = makePlan(root, bundle, 'update');
  assert.throws(() => applyPlan(root, legacyBundle, reviewedPlan), /Plan changed/);
  assert.equal(read(root, '.ai/workflow.lock.json'), lockBefore);

  const managed = '.ai/core/start.md';
  write(root, managed, `${read(root, managed)}\nLocal project fork; do not overwrite.\n`);
  const localBefore = read(root, managed);
  const conflictingPlan = makePlan(root, bundle, 'update');
  assert.equal(
    conflictingPlan.actions.find((action) => action.path === managed).action,
    'conflict',
  );
  assert.throws(() => applyPlan(root, bundle, conflictingPlan), /conflicts/);
  assert.equal(read(root, managed), localBefore);
  assert.equal(read(root, '.ai/workflow.lock.json'), lockBefore);
  assert(!fs.existsSync(path.join(root, '.ai/workflow.writer.json')));
});

for (const [kind, marker, content] of [
  ['documentation', 'README.md', '# Project handbook\n'],
  ['Python', 'pyproject.toml', '[project]\nname = "synthetic"\nversion = "0.0.0"\n'],
  [
    'TypeScript',
    'package.json',
    JSON.stringify({
      name: 'synthetic',
      scripts: { postinstall: 'node -e "throw new Error(\'must never execute\')"' },
    }),
  ],
]) {
  test(`${kind} consumer adopts, checks standalone, updates and preserves project context`, (t) => {
    const root = fixture(t);
    write(root, marker, content);
    const before = fs.readdirSync(root);
    assert(inspect(root).markers.includes(marker));
    const plan = makePlan(root, bundle);
    assert.deepEqual(fs.readdirSync(root), before, 'preview must be read-only');
    assert(plan.actions.every((action) => action.action === 'create'));
    install(root);
    assert(check(root).ok);
    const checked = spawnSync(
      process.execPath,
      [path.join(root, '.ai/tools/check.mjs'), '--root', root],
      { cwd: root, encoding: 'utf8' },
    );
    assert.equal(checked.status, 0, checked.stderr);
    assert.equal(JSON.parse(checked.stdout).commandsExecuted, 0);
    assert.equal(read(root, marker), content);
    const profile = JSON.parse(read(root, '.ai/project.json'));
    profile.name = `${kind} consumer`;
    profile.commands = [
      {
        id: 'test',
        command: 'a project-owned command',
        mode: 'local-write',
        status: 'deferred',
        owner: 'Project maintainer',
        trigger: 'After selecting a project test runner',
        fallback: 'Inspect changes manually and run the workflow validator',
      },
    ];
    write(root, '.ai/project.json', JSON.stringify(profile));
    write(root, '.ai/tasks/preserved.md', 'Project history\n');
    const release = changedRelease((copy) => {
      copy.files.find((file) => file.path === '.ai/core/start.md').content +=
        '\nA compatible upstream correction.\n';
    });
    const update = makePlan(root, release, 'update');
    assert.equal(
      update.actions.find((action) => action.path === '.ai/project.json').action,
      'preserve',
    );
    assert.equal(applyPlan(root, release, update).applied, 1);
    assert.equal(JSON.parse(read(root, '.ai/project.json')).name, `${kind} consumer`);
    assert.equal(read(root, '.ai/tasks/preserved.md'), 'Project history\n');
    assert(check(root).ok);
    assert.equal(ejectPlan(root).previewOnly, true);
    assert.equal(read(root, '.ai/tasks/preserved.md'), 'Project history\n');
  });
}

test('unknown instructions cause a conflict and no partial installation', (t) => {
  const root = fixture(t);
  write(root, 'AGENTS.md', '# Existing private project rules\n');
  const plan = makePlan(root, bundle);
  assert.equal(plan.actions.find((item) => item.path === 'AGENTS.md').action, 'conflict');
  assert.throws(() => applyPlan(root, bundle, plan), /conflicts/);
  assert.deepEqual(fs.readdirSync(root), ['AGENTS.md']);
});

test('a plan cannot change targets, bytes, root or permissions', (t) => {
  const root = fixture(t);
  const plan = makePlan(root, bundle);
  const tampered = structuredClone(plan);
  tampered.actions[0].path = '.git/config';
  const { planDigest, ...payload } = tampered;
  tampered.planDigest = digest(payload);
  assert.throws(() => applyPlan(root, bundle, tampered), /Plan changed/);
  assert.throws(() => applyPlan(fixture(t), bundle, plan), /root or mode/);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('post-preview target drift blocks every write', (t) => {
  const root = fixture(t);
  const plan = makePlan(root, bundle);
  write(root, 'CLAUDE.md', '# Newly added local rule\n');
  assert.throws(() => applyPlan(root, bundle, plan), /project drifted/);
  assert.deepEqual(fs.readdirSync(root), ['CLAUDE.md']);
});

test('managed local edits and missing managed files block updates', (t) => {
  const root = fixture(t);
  install(root);
  write(root, '.ai/core/start.md', 'Local fork of core\n');
  assert.throws(() => check(root), /Managed file drift/);
  const update = makePlan(root, bundle, 'update');
  assert.equal(update.actions.find((item) => item.path === '.ai/core/start.md').action, 'conflict');
  assert.throws(() => applyPlan(root, bundle, update), /conflicts/);
  assert.equal(
    ejectPlan(root).files.find((file) => file.path === '.ai/core/start.md').recommendation,
    'preserve-local-edit',
  );
  fs.unlinkSync(path.join(root, '.ai/core/start.md'));
  assert.equal(
    makePlan(root, bundle, 'update').actions.find((item) => item.path === '.ai/core/start.md')
      .action,
    'conflict',
  );
});

test('upstream retirement requires manual review and preserves the file', (t) => {
  const root = fixture(t);
  const previous = changedRelease((copy) => {
    copy.files.push({
      path: '.ai/core/optional.md',
      ownership: 'managed',
      content: 'Optional guidance\n',
    });
  });
  install(root, previous);
  const release = changedRelease((copy) => {
    copy.version = '1.1.2';
  });
  const update = makePlan(root, release, 'update');
  assert(update.actions.some((action) => action.reason?.includes('retired')));
  assert.throws(() => applyPlan(root, release, update), /conflicts/);
  assert(fs.existsSync(path.join(root, '.ai/core/optional.md')));
});

for (const target of ['.ai', 'CLAUDE.md']) {
  test(`symlink at ${target} cannot redirect adoption outside root`, (t) => {
    const root = fixture(t);
    const outside = fixture(t);
    write(outside, 'untouched', 'Original');
    fs.symlinkSync(
      target === '.ai' ? outside : path.join(outside, 'untouched'),
      path.join(root, target),
    );
    assert.throws(() => makePlan(root, bundle), /Symlink boundary/);
    assert.equal(read(outside, 'untouched'), 'Original');
    assert.deepEqual(fs.readdirSync(outside), ['untouched']);
  });
}

test('hard-linked instruction files cannot be adopted', (t) => {
  const root = fixture(t);
  const outside = fixture(t);
  write(outside, 'rules', 'Original');
  fs.linkSync(path.join(outside, 'rules'), path.join(root, 'AGENTS.md'));
  assert.throws(() => makePlan(root, bundle), /Hard-linked/);
  assert.equal(read(outside, 'rules'), 'Original');
});

test('bundle tampering, escaping and case-insensitive duplicates are rejected', () => {
  const bad = structuredClone(bundle);
  bad.files[0].content += 'tampered';
  assert.throws(() => validateBundle(bad), /digest/);
  for (const target of [
    '../escape.md',
    '/tmp/escape.md',
    '.git/config',
    '.ai/core/../../escape.md',
  ]) {
    assert.throws(
      () =>
        validateBundle(
          changedRelease((copy) => {
            copy.files[0].path = target;
          }),
        ),
      /Unsafe|disallowed/,
    );
  }
  assert.throws(
    () =>
      validateBundle(
        changedRelease((copy) => {
          copy.files.push(copy.files[0]);
        }),
      ),
    /duplicate/,
  );
});

test('root cannot be implicit, filesystem-wide or home-wide', () => {
  assert.throws(() => rootPath('.'), /absolute/);
  assert.throws(() => rootPath('/'), /project directory/);
  assert.throws(() => rootPath(os.homedir()), /project directory/);
});

test('project profile, task structure, manifest paths and capability statuses are validated', (t) => {
  const root = fixture(t);
  install(root);
  const original = read(root, '.ai/project.json');
  const profile = JSON.parse(original);
  profile.commands = [{ id: 'test', command: 'test', mode: 'silent', status: 'available' }];
  write(root, '.ai/project.json', JSON.stringify(profile));
  assert.throws(() => check(root), /Invalid or duplicate project command/);
  write(root, '.ai/project.json', original);
  write(root, '.ai/tasks/current.md', '# no ownership or acceptance\n');
  assert.throws(() => check(root), /Current task missing/);
  const manifest = JSON.parse(read(root, '.ai/manifest.json'));
  manifest.currentTask = '../outside.md';
  write(root, '.ai/manifest.json', JSON.stringify(manifest));
  assert.throws(() => check(root), /Unsafe relative path/);
});

test('all six vendor adapters point at canonical context and disclaim runtime proof', () => {
  const registry = JSON.parse(
    bundle.files.find((file) => file.path === '.ai/adapters.json').content,
  );
  assert.deepEqual(
    registry.tools.map((tool) => tool.id),
    ['codex', 'claude', 'cursor', 'augment', 'copilot', 'antigravity', 'generic'],
  );
  for (const tool of registry.tools) {
    assert.equal(tool.runtimeStatus, 'not_verified');
    assert(
      bundle.files.find((file) => file.path === tool.entry).content.includes('.ai/manifest.json'),
    );
  }
});

test('new output cannot overwrite existing files or symlinks', (t) => {
  const root = fixture(t);
  const output = path.join(root, 'output.json');
  writeNewJson(output, { preview: true });
  assert.throws(() => writeNewJson(output, { preview: false }), /EEXIST/);
  fs.symlinkSync(output, path.join(root, 'link.json'));
  assert.throws(() => writeNewJson(path.join(root, 'link.json'), {}), /EEXIST/);
  assert.deepEqual(JSON.parse(read(root, 'output.json')), { preview: true });
});

test('an interrupted writer blocks a second adoption and validation', (t) => {
  const root = fixture(t);
  install(root);
  write(root, '.ai/workflow.writer.json', '{"state":"writing"}\n');
  assert.throws(() => makePlan(root, bundle, 'update'), /recovery journal/);
  assert.throws(() => check(root), /Unfinished adoption/);
});

test(
  'a mid-write permission failure retains a useful recovery journal',
  { skip: process.getuid?.() === 0 },
  (t) => {
    const root = fixture(t);
    const blockedDirectory = path.join(root, '.cursor');
    fs.mkdirSync(blockedDirectory);
    const plan = makePlan(root, bundle);
    fs.chmodSync(blockedDirectory, 0o500);
    try {
      assert.throws(() => applyPlan(root, bundle, plan), /Recovery journal retained/);
      const journal = JSON.parse(read(root, '.ai/workflow.writer.json'));
      assert.equal(journal.planDigest, plan.planDigest);
      assert.equal(journal.previous['.ai/core/start.md'], null);
      assert.equal(journal.previous['.ai/workflow.lock.json'], null);
      assert.throws(() => makePlan(root, bundle), /recovery journal/);
    } finally {
      fs.chmodSync(blockedDirectory, 0o700);
    }
  },
);

test('a lock cannot hide required managed files or address unrelated paths', (t) => {
  const root = fixture(t);
  install(root);
  const lock = JSON.parse(read(root, '.ai/workflow.lock.json'));
  const original = structuredClone(lock);
  delete lock.files['.ai/core/start.md'];
  write(root, '.ai/workflow.lock.json', JSON.stringify(lock));
  assert.throws(() => check(root), /missing required managed entries/);
  original.files['.git/config'] = digest('unrelated');
  write(root, '.ai/workflow.lock.json', JSON.stringify(original));
  assert.throws(() => check(root), /Invalid managed entry/);
});

test('inventory reports legacy guidance without reading or executing it', (t) => {
  const root = fixture(t);
  write(root, '.claude/settings.json', 'not even valid JSON; hooks must not run');
  write(root, '.env', 'synthetic marker');
  const result = inspect(root);
  assert.deepEqual(result.legacyGuidance, ['.claude/settings.json']);
  assert(!JSON.stringify(result).includes('synthetic marker'));
  assert(!JSON.stringify(result).includes('hooks must not run'));
});

test('source identity and lock metadata are validated before trusting managed hashes', (t) => {
  const root = fixture(t);
  install(root);
  const original = JSON.parse(read(root, '.ai/workflow.lock.json'));
  for (const mutation of [
    { source: 'unknown/source' },
    { version: 'latest' },
    { unexpected: true },
  ]) {
    write(root, '.ai/workflow.lock.json', JSON.stringify({ ...original, ...mutation }));
    assert.throws(() => check(root), /Invalid workflow lock/);
  }
});

test('releases require every canonical workflow and template', () => {
  for (const missing of ['.ai/core/workflows/design.md', '.ai/templates/handoff.md']) {
    const release = changedRelease((copy) => {
      copy.files = copy.files.filter((file) => file.path !== missing);
    });
    assert.throws(() => validateBundle(release), /missing required files/);
  }
});

test('bundle file/ancestor collisions are rejected before planning or writing', (t) => {
  const root = fixture(t);
  for (const parent of ['start.md', 'START.md']) {
    const release = changedRelease((copy) => {
      copy.files.push({
        path: `.ai/core/${parent}/nested.md`,
        ownership: 'managed',
        content: 'Must never be installed\n',
      });
    });
    assert.throws(() => makePlan(root, release), /file\/ancestor collision/);
    assert.deepEqual(fs.readdirSync(root), []);
  }
});

test('bundle size limits count UTF-8 bytes before writing multibyte content', (t) => {
  const root = fixture(t);
  const release = changedRelease((copy) => {
    copy.files.find((file) => file.path === '.ai/core/start.md').content = '界'.repeat(800000);
  });
  assert.throws(() => makePlan(root, release), /Invalid, duplicate, or disallowed/);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('deferred commands require an accountable owner, trigger and fallback', (t) => {
  const root = fixture(t);
  install(root);
  const profile = JSON.parse(read(root, '.ai/project.json'));
  const command = {
    id: 'browser-check',
    command: 'run-browser-check',
    mode: 'local-write',
    status: 'deferred',
    owner: 'Maintainer',
    trigger: 'Browser client available',
    fallback: 'Run unit tests and record missing browser coverage',
  };
  for (const field of ['owner', 'trigger', 'fallback']) {
    const incomplete = { ...command };
    delete incomplete[field];
    profile.commands = [incomplete];
    write(root, '.ai/project.json', JSON.stringify(profile));
    assert.throws(() => check(root), new RegExp(`deferred command ${field}`));
  }
  profile.commands = [command];
  write(root, '.ai/project.json', JSON.stringify(profile));
  assert(check(root).ok);
});

test('standalone checker defaults to working project and rejects relative explicit roots', (t) => {
  const root = fixture(t);
  install(root);
  const cli = path.join(root, '.ai/tools/check.mjs');
  assert.equal(spawnSync(process.execPath, [cli], { cwd: root }).status, 0);
  assert.equal(spawnSync(process.execPath, [cli, '--root', '.'], { cwd: root }).status, 1);
});

test('manifest traversal and secret-file references are rejected before reading targets', (t) => {
  const root = fixture(t);
  install(root);
  const manifest = JSON.parse(read(root, '.ai/manifest.json'));
  for (const target of ['.env', '.env.private.json', '.git/config', 'node_modules/example.json']) {
    manifest.readOnStart = [target];
    write(root, '.ai/manifest.json', JSON.stringify(manifest));
    assert.throws(() => check(root), /project instruction artifact/);
  }
});

test('CLI consumes standalone bundle and reports invalid arguments without executing scripts', (t) => {
  const root = fixture(t);
  const artifacts = fixture(t);
  const artifact = path.join(artifacts, 'bundle.json');
  const plan = path.join(artifacts, 'plan.json');
  writeNewJson(artifact, bundle);
  const cli = path.join(source, 'bin/workflow.mjs');
  const run = (args) =>
    spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(run(['plan', '--root', root, '--bundle', artifact, '--out', plan]).status, 0);
  const result = run(['apply', '--root', root, '--bundle', artifact, '--plan', plan]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(run(['check', '--root', root]).status, 0);
  assert.equal(run(['check', '--root', root, '--force']).status, 1);
  assert.equal(run(['check', '--root', root, '--root', root]).status, 1);
});
