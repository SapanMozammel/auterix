import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncBuiltinESMExports } from 'node:module';
import test from 'node:test';
import { applyPlan, buildBundle, check, digest, inspect, makePlan } from '../lib/workflow.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'auterix-safety-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
function release(mutator) {
  const { sourceDigest, ...bundle } = buildBundle(source);
  mutator(bundle);
  return { ...bundle, sourceDigest: digest(bundle) };
}

test('invalid staged project JSON is rejected without installing files', (t) => {
  const root = fixture(t);
  const bundle = release((value) => {
    value.files.find((file) => file.path === '.ai/project.json').content = '{invalid json}';
  });
  assert.throws(() => applyPlan(root, bundle, makePlan(root, bundle)), /Invalid JSON/);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('higher-precedence root override is detected and blocks discovery until reconciled', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'AGENTS.override.md'), 'Unrelated existing instructions.\n');
  const bundle = buildBundle(source);
  assert(inspect(root).markers.includes('AGENTS.override.md'));
  const plan = makePlan(root, bundle);
  assert.throws(() => applyPlan(root, bundle, plan), /AGENTS.override.md/);
  assert.deepEqual(fs.readdirSync(root), ['AGENTS.override.md']);
});

test('manual-only adoption preserves unrelated vendor instructions and locks its selection', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'Existing Claude project policy.\n');
  const bundle = buildBundle(source);
  const plan = makePlan(root, bundle, 'install', { adapters: [] });
  assert(!plan.actions.some((action) => action.path === 'CLAUDE.md'));
  applyPlan(root, bundle, plan);
  assert.equal(read(root, 'CLAUDE.md'), 'Existing Claude project policy.\n');
  assert(check(root).ok);
  assert.deepEqual(JSON.parse(read(root, '.ai/workflow.lock.json')).adapters, []);
  assert(!makePlan(root, bundle, 'update').actions.some((action) => action.path === 'CLAUDE.md'));
});

test('invalid adapter IDs and duplicate selection cannot silently widen an install', (t) => {
  const root = fixture(t);
  const bundle = buildBundle(source);
  for (const adapters of [['unknown'], ['cursor', 'cursor']]) {
    assert.throws(() => makePlan(root, bundle, 'install', { adapters }), /adapter/i);
  }
});

test('a failed update restores previous bytes and retains unrelated content', (t) => {
  const root = fixture(t);
  const bundle = buildBundle(source);
  applyPlan(root, bundle, makePlan(root, bundle));
  fs.writeFileSync(path.join(root, 'unrelated.txt'), 'Keep this user file.\n');
  const before = new Map(bundle.files.map((file) => [file.path, read(root, file.path)]));
  const lockBefore = read(root, '.ai/workflow.lock.json');
  const next = release((value) => {
    value.files.find((file) => file.path === '.ai/core/start.md').content +=
      '\nUpdated guidance.\n';
    value.files.find((file) => file.path === '.ai/core/roles.md').content += '\nUpdated roles.\n';
  });
  const plan = makePlan(root, next, 'update');
  const originalRename = fs.renameSync;
  let failed = false;
  fs.renameSync = (from, to) => {
    if (!failed && to === path.join(root, '.ai/core/start.md')) {
      failed = true;
      throw new Error('Injected write failure');
    }
    return originalRename(from, to);
  };
  syncBuiltinESMExports();
  try {
    assert.throws(() => applyPlan(root, next, plan), /rolled back/i);
  } finally {
    fs.renameSync = originalRename;
    syncBuiltinESMExports();
  }
  assert(failed, 'failure injection must exercise the write path');
  for (const [file, content] of before) assert.equal(read(root, file), content);
  assert.equal(read(root, '.ai/workflow.lock.json'), lockBefore);
  assert.equal(read(root, 'unrelated.txt'), 'Keep this user file.\n');
  assert(!fs.existsSync(path.join(root, '.ai/workflow.writer.json')));
  assert(check(root).ok);
});

test('rollback preserves a concurrent user edit and keeps recovery evidence', (t) => {
  const root = fixture(t);
  const bundle = buildBundle(source);
  applyPlan(root, bundle, makePlan(root, bundle));
  const next = release((value) => {
    for (const file of ['.ai/core/roles.md', '.ai/core/start.md'])
      value.files.find((entry) => entry.path === file).content += '\nNew release guidance.\n';
  });
  const plan = makePlan(root, next, 'update');
  const originalRename = fs.renameSync;
  let failed = false;
  fs.renameSync = (from, to) => {
    if (!failed && to === path.join(root, '.ai/core/start.md')) {
      failed = true;
      fs.writeFileSync(path.join(root, '.ai/core/roles.md'), 'Concurrent user edit; preserve.\n');
      throw new Error('Injected failure after concurrent edit');
    }
    return originalRename(from, to);
  };
  syncBuiltinESMExports();
  try {
    assert.throws(() => applyPlan(root, next, plan), /Recovery journal retained/);
  } finally {
    fs.renameSync = originalRename;
    syncBuiltinESMExports();
  }
  assert(failed);
  assert.equal(read(root, '.ai/core/roles.md'), 'Concurrent user edit; preserve.\n');
  assert.equal(
    read(root, '.ai/core/start.md'),
    bundle.files.find((file) => file.path === '.ai/core/start.md').content,
  );
  assert.throws(() => check(root), /Unfinished adoption/);
  const journal = JSON.parse(read(root, '.ai/workflow.writer.json'));
  assert.equal(
    journal.previous['.ai/core/roles.md'],
    bundle.files.find((file) => file.path === '.ai/core/roles.md').content,
  );
});

test('an override introduced after adoption blocks Codex discovery checks', (t) => {
  const root = fixture(t);
  const bundle = buildBundle(source);
  applyPlan(root, bundle, makePlan(root, bundle));
  fs.writeFileSync(path.join(root, 'AGENTS.override.md'), 'Unrelated instructions.\n');
  assert.throws(() => check(root), /AGENTS.override.md/);
  fs.writeFileSync(
    path.join(root, 'AGENTS.override.md'),
    'Keep project policy. Read .ai/manifest.json before work.\n',
  );
  assert(check(root).ok);
});

test('inspection inventories conventions without exposing or executing script bodies', (t) => {
  const root = fixture(t);
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({
      scripts: { test: 'DO_NOT_EXECUTE_OR_PRINT', format: 'also private script text' },
    }),
  );
  fs.mkdirSync(path.join(root, '.github/workflows'), { recursive: true });
  fs.writeFileSync(path.join(root, '.github/workflows/check.yml'), 'contents are not needed');
  fs.writeFileSync(path.join(root, 'ruff.toml'), 'line-length = 100\n');
  const result = inspect(root);
  assert.deepEqual(result.scriptNames, ['format', 'test']);
  assert.deepEqual(result.ciFiles, ['.github/workflows/check.yml']);
  assert(result.markers.includes('ruff.toml'));
  assert(!JSON.stringify(result).includes('DO_NOT_EXECUTE_OR_PRINT'));
});

test('changing adapter selection invalidates a previously reviewed plan', (t) => {
  const root = fixture(t);
  const bundle = buildBundle(source);
  const plan = makePlan(root, bundle);
  plan.adapters = [];
  assert.throws(() => applyPlan(root, bundle, plan), /Plan changed/);
  assert.deepEqual(fs.readdirSync(root), []);
});
