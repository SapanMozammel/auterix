import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  applyPlan,
  buildBundle,
  check,
  digest,
  ejectPlan,
  inspect,
  makePlan,
} from '../lib/workflow.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = buildBundle(source);
const scenarios = [
  {
    directory: 'typescript',
    name: 'Atlas search',
    stack: 'TypeScript pnpm monorepo with web and contract packages; existing Prettier policy.',
    command: 'pnpm check',
    task: 'docs/tasks/search.md',
    usage: 'Search queries need at least two characters after trimming.',
  },
  {
    directory: 'python',
    name: 'Beacon worker',
    stack: 'Python src-layout worker with pyproject.toml and Ruff; no JavaScript package manager.',
    command: 'python tools/check.py',
    task: 'docs/tasks/retries.md',
    usage: 'A batch stops after three total attempts, including the first.',
  },
  {
    directory: 'documentation',
    name: 'Compass handbook',
    stack: 'Markdown handbook with EditorConfig and Makefile checks; no application build.',
    command: 'make check',
    task: 'docs/tasks/links.md',
    usage: 'Link handbook chapters with relative Markdown paths.',
  },
];

const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
function write(root, file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}
function snapshot(root, prefix = '') {
  return Object.fromEntries(
    fs.readdirSync(path.join(root, prefix), { withFileTypes: true }).flatMap((entry) => {
      const file = path.posix.join(prefix, entry.name);
      return entry.isDirectory()
        ? Object.entries(snapshot(root, file))
        : [[file, read(root, file)]];
    }),
  );
}
function materialize(t, scenario) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'auterix-scenario-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [file, content] of Object.entries(
    snapshot(path.join(source, 'test/scenarios', scenario)),
  )) {
    write(root, file.replace(/\.fixture$/, ''), content);
  }
  return root;
}
function taskText(scenario) {
  return `# Document the accepted usage rule for ${scenario.name}

Task schema: 1
Status: ready
Owned files: docs/usage.md, .ai/tasks/usage.md
Risk: low
Workflow: .ai/core/workflows/implementation.md
Dependencies: none

## Objective

Finish the scoped documentation work described in ${scenario.task}. Readers need
the already accepted usage rule, without changing application behavior.

## Scope

Append the accepted sentence to docs/usage.md. Preserve application source,
formatter, package metadata, existing instructions and completed task history.
Only this documentation change and its evidence are authorized. No consumer
script, package installation, network call, publication or application rename.

## Acceptance

- [ ] Usage documentation contains the exact accepted sentence once.
- [ ] Original source, configuration, decisions and completed tasks remain byte-identical.

## Evidence

Inspected ${scenario.task}, docs/decisions/usage.md and project commands. The
installed checker passes with zero project commands executed. Existing policy is
preserved in docs/retained-agent-policy.md; docs/adoption-inventory.json records
hashes of the protected files. These are synthetic fixture observations.

## Handoff

Next action: Append the accepted usage text from docs/decisions/usage.md to docs/usage.md.
Use only repository state to recover that text and verify retained file hashes.
Then record the documentation review and next maintenance step. No native AI
client has been exercised and no consumer command has been executed.
`;
}

// This is a bounded test harness, not an agent or a discovered consumer script.
// Its sole argument is the installed repository; it imports no source-checkout code.
const continuation = String.raw`
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const root = process.argv[1];
const newline = String.fromCharCode(10);
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const hash = (text) => createHash('sha256').update(text).digest('hex');
const { check } = await import(pathToFileURL(path.join(root, '.ai/tools/workflow.mjs')));
assert.equal(check(root).commandsExecuted, 0);
const manifest = JSON.parse(read('.ai/manifest.json'));
const profile = JSON.parse(read(manifest.projectProfile));
assert.equal(manifest.currentTask, '.ai/tasks/usage.md');
assert(profile.architectureDocuments.includes('docs/decisions/usage.md'));
let task = read(manifest.currentTask);
assert.match(task, /^Status: in_progress$/m);
assert.equal(task.split(newline).find((line) => line.startsWith('Owned files:')), 'Owned files: docs/usage.md, .ai/tasks/usage.md');
assert(task.includes('Next action: Append the accepted usage text from docs/decisions/usage.md to docs/usage.md.'));
const policy = read('docs/retained-agent-policy.md');
assert(policy.trim().length > 0);
const protectedFiles = JSON.parse(read('docs/adoption-inventory.json'));
const verifyProtected = () => {
  for (const [file, expected] of Object.entries(protectedFiles)) {
    assert(!file.includes('..') && !path.isAbsolute(file));
    assert.equal(hash(read(file)), expected, file);
  }
};
verifyProtected();
const rule = read('docs/decisions/usage.md').match(/^Accepted usage text: (.+)$/m)?.[1];
assert(rule);
const before = read('docs/usage.md');
assert(!before.includes(rule));
fs.writeFileSync(path.join(root, 'docs/usage.md'), before + newline + rule + newline);
assert.equal(read('docs/usage.md').split(rule).length - 1, 1);
verifyProtected();
task = task.replace('Status: in_progress', 'Status: verification').replaceAll('- [ ]', '- [x]');
task = task.replace('## Evidence' + newline, '## Evidence' + newline + newline + 'Separate-process offline continuation appended the exact ADR sentence once and verified every protected file hash. Installed check: zero consumer commands executed.' + newline);
fs.writeFileSync(path.join(root, manifest.currentTask), task);
assert(check(root).ok);
task = task.replace('Status: verification', 'Status: review');
task += newline + '## Review' + newline + newline + 'Self-review by the deterministic fixture harness: usage text matches the accepted decision exactly; source, formatting, configuration and historical task hashes are unchanged. No findings within this documentation scope. Native AI-client execution and application checks were not performed.' + newline;
fs.writeFileSync(path.join(root, manifest.currentTask), task);
assert(check(root).ok);
task = task.replace('Status: review', 'Status: complete').replace(
  'Next action: Append the accepted usage text from docs/decisions/usage.md to docs/usage.md.',
  'Next action: Reopen a scoped documentation task if the accepted usage rule changes.'
);
fs.writeFileSync(path.join(root, manifest.currentTask), task);
const result = check(root);
console.log(JSON.stringify({ result, project: profile.name, currentTask: manifest.currentTask, rule, preserved: Object.keys(protectedFiles).length }));
`;

for (const scenario of scenarios) {
  test(`${scenario.name}: preserve existing conventions through adoption, update and repository-only continuation`, (t) => {
    const root = materialize(t, scenario.directory);
    const originals = snapshot(root);
    const inspected = inspect(root);
    assert(inspected.markers.includes('AGENTS.md'));
    assert.deepEqual(
      snapshot(root),
      originals,
      'inventory must not execute or alter consumer files',
    );

    const refused = makePlan(root, bundle, 'install', { adapters: [] });
    assert.equal(refused.actions.find((entry) => entry.path === 'AGENTS.md').action, 'conflict');
    assert.throws(() => applyPlan(root, bundle, refused), /conflict/i);
    assert.deepEqual(
      snapshot(root),
      originals,
      'conflicting adoption must preserve original instructions',
    );

    // Explicit owner reconciliation: retain the original policy before preparing
    // the exact starter. The installer itself never merges or discards that policy.
    write(root, 'docs/retained-agent-policy.md', originals['AGENTS.md']);
    write(root, 'AGENTS.md', bundle.files.find((entry) => entry.path === 'AGENTS.md').content);
    const accepted = makePlan(root, bundle, 'install', { adapters: [] });
    applyPlan(root, bundle, accepted);
    assert(check(root).ok);
    for (const bridge of [
      'CLAUDE.md',
      '.cursor/rules/workflow.mdc',
      '.augment/rules/workflow.md',
      '.github/copilot-instructions.md',
      '.agents/rules/workflow.md',
    ]) {
      assert(
        !fs.existsSync(path.join(root, bridge)),
        'unselected vendor bridges must not be installed',
      );
    }
    write(
      root,
      'AGENTS.md',
      `${read(root, 'AGENTS.md')}\nRead docs/retained-agent-policy.md; its existing project conventions remain authoritative.\n`,
    );
    const profile = JSON.parse(read(root, '.ai/project.json'));
    Object.assign(profile, {
      name: scenario.name,
      stack: scenario.stack,
      commands: [
        {
          id: 'project-check',
          command: scenario.command,
          mode: 'local-write',
          status: 'available',
        },
      ],
      protectedBoundaries: [
        'Preserve the existing application, formatter, configuration, accepted decisions and completed task history.',
      ],
      architectureDocuments: ['docs/architecture.md', 'docs/decisions/usage.md'],
      designDocuments: [],
      externalReferences: [],
      notes: 'Commands were inspected but are not authorized or executed by this adoption fixture.',
    });
    write(root, '.ai/project.json', JSON.stringify(profile, null, 2));
    const manifest = JSON.parse(read(root, '.ai/manifest.json'));
    manifest.currentTask = '.ai/tasks/usage.md';
    manifest.readOnStart.push('docs/retained-agent-policy.md', scenario.task);
    write(root, '.ai/manifest.json', JSON.stringify(manifest, null, 2));
    write(root, '.ai/tasks/usage.md', taskText(scenario));
    const protectedFiles = Object.fromEntries(
      Object.entries(originals)
        .filter(([file]) => !['AGENTS.md', 'docs/usage.md'].includes(file))
        .map(([file, content]) => [file, digest(content)]),
    );
    protectedFiles['docs/retained-agent-policy.md'] = digest(originals['AGENTS.md']);
    write(root, 'docs/adoption-inventory.json', JSON.stringify(protectedFiles, null, 2));
    assert(check(root).ok, 'a configured ready task must be valid before implementation');
    write(
      root,
      '.ai/tasks/usage.md',
      read(root, '.ai/tasks/usage.md').replace('Status: ready', 'Status: in_progress'),
    );
    assert(check(root).ok);

    const beforeUpdate = snapshot(root);
    const { sourceDigest: oldDigest, ...payload } = structuredClone(bundle);
    const [major, minor, patch] = payload.version.split('.').map(Number);
    payload.version = `${major}.${minor}.${patch + 1}`;
    payload.files.find((entry) => entry.path === '.ai/core/workflows/verification.md').content +=
      '\nRetain the accepted project decision when recording continuation evidence.\n';
    const nextBundle = { ...payload, sourceDigest: digest(payload) };
    assert.notEqual(nextBundle.sourceDigest, oldDigest);
    const update = makePlan(root, nextBundle, 'update');
    assert.deepEqual(snapshot(root), beforeUpdate, 'update preview must be read-only');
    applyPlan(root, nextBundle, update);
    for (const file of [
      'AGENTS.md',
      '.ai/manifest.json',
      '.ai/project.json',
      '.ai/tasks/usage.md',
      'docs/tasks/history.md',
      'docs/decisions/usage.md',
    ]) {
      assert.equal(read(root, file), beforeUpdate[file], `update preserved ${file}`);
    }
    assert.equal(applyPlan(root, nextBundle, makePlan(root, nextBundle, 'update')).applied, 0);

    const continued = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', continuation, root],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 15_000,
      },
    );
    assert.equal(continued.status, 0, continued.stderr);
    const report = JSON.parse(continued.stdout);
    assert.equal(report.project, scenario.name);
    assert.equal(report.rule, scenario.usage);
    assert.equal(report.currentTask, '.ai/tasks/usage.md');
    assert.equal(report.result.commandsExecuted, 0);
    assert(report.preserved >= 8);
    assert.match(read(root, '.ai/tasks/usage.md'), /^Status: complete$/m);
    assert.equal(read(root, 'docs/usage.md'), `${originals['docs/usage.md']}\n${scenario.usage}\n`);
    for (const [file, expected] of Object.entries(protectedFiles))
      assert.equal(digest(read(root, file)), expected, file);
    assert(!fs.existsSync(path.join(root, 'consumer-command-ran.txt')));
    for (const packageMarker of ['package.json', 'pyproject.toml', 'pnpm-workspace.yaml']) {
      assert.equal(
        fs.existsSync(path.join(root, packageMarker)),
        Object.hasOwn(originals, packageMarker),
      );
    }

    const beforeEject = snapshot(root);
    const ejection = ejectPlan(root);
    assert.equal(ejection.previewOnly, true);
    assert(
      !ejection.files.some(
        (entry) => Object.hasOwn(protectedFiles, entry.path) || entry.path === '.ai/tasks/usage.md',
      ),
    );
    assert.deepEqual(
      snapshot(root),
      beforeEject,
      'ejection preview must preserve the completed task and application',
    );
  });
}
