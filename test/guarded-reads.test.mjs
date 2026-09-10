import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { applyPlan, buildBundle, digest, makePlan } from '../lib/workflow.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'auterix-read-guard-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function release(mutator) {
  const { sourceDigest, ...bundle } = buildBundle(source);
  mutator(bundle);
  return { ...bundle, sourceDigest: digest(bundle) };
}

for (const kind of ['manifest-case', 'adapter-entry']) {
  test(`${kind} rejects a protected context target before any content read`, (t) => {
    const root = fixture(t);
    const target = kind === 'manifest-case' ? '.ENV.private.json' : '.env.private.json';
    const targetPath = path.join(root, target);
    fs.writeFileSync(targetPath, '{"synthetic":true}');
    const bundle = release((value) => {
      const artifact = kind === 'manifest-case' ? '.ai/manifest.json' : '.ai/adapters.json';
      const file = value.files.find((entry) => entry.path === artifact);
      const parsed = JSON.parse(file.content);
      if (kind === 'manifest-case') parsed.readOnStart.push(target);
      else parsed.tools.find((entry) => entry.id === 'codex').entry = target;
      file.content = JSON.stringify(parsed);
    });
    const plan = makePlan(root, bundle);
    const originalRead = fs.readFileSync;
    let protectedReads = 0;
    fs.readFileSync = (...args) => {
      if (args[0] === targetPath) protectedReads++;
      return originalRead(...args);
    };
    syncBuiltinESMExports();
    try {
      assert.throws(
        () => applyPlan(root, bundle, plan),
        kind === 'manifest-case' ? /instruction artifact/ : /Adapter discovery entry/,
      );
    } finally {
      fs.readFileSync = originalRead;
      syncBuiltinESMExports();
    }
    assert.equal(protectedReads, 0, 'rejection must happen before reading protected content');
    assert.deepEqual(fs.readdirSync(root), [target], 'invalid staged data must not install files');
  });
}

test('concurrent linked override policy changes invalidate adoption and preserve the user edit', (t) => {
  const root = fixture(t);
  const initial = buildBundle(source);
  applyPlan(root, initial, makePlan(root, initial));
  const overrideFile = path.join(root, 'AGENTS.override.md');
  fs.writeFileSync(overrideFile, 'Original project policy. Read .ai/manifest.json.\n');
  const managedPath = '.ai/core/roles.md';
  const managedBefore = fs.readFileSync(path.join(root, managedPath), 'utf8');
  const lockBefore = fs.readFileSync(path.join(root, '.ai/workflow.lock.json'), 'utf8');
  const next = release((value) => {
    value.files.find((file) => file.path === managedPath).content += '\nNew review guidance.\n';
  });
  const plan = makePlan(root, next, 'update');
  const originalRename = fs.renameSync;
  const userPolicy = 'Changed project policy. Read .ai/manifest.json.\n';
  let changed = false;
  fs.renameSync = (from, to) => {
    const result = originalRename(from, to);
    if (!changed && to === path.join(root, managedPath)) {
      changed = true;
      fs.writeFileSync(overrideFile, userPolicy);
    }
    return result;
  };
  syncBuiltinESMExports();
  try {
    assert.throws(() => applyPlan(root, next, plan), /override.*changed|discovery.*changed/i);
  } finally {
    fs.renameSync = originalRename;
    syncBuiltinESMExports();
  }
  assert(changed, 'test must inject the change during a managed write');
  assert.equal(fs.readFileSync(overrideFile, 'utf8'), userPolicy);
  assert.equal(fs.readFileSync(path.join(root, managedPath), 'utf8'), managedBefore);
  assert.equal(fs.readFileSync(path.join(root, '.ai/workflow.lock.json'), 'utf8'), lockBefore);
  assert(!fs.existsSync(path.join(root, '.ai/workflow.writer.json')));
});
