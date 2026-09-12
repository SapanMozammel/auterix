/**
 * Tests for the Auterix Doctor diagnostic scorecard (lib/doctor.mjs)
 */
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runDiagnostics, formatScorecard } from '../lib/doctor.mjs';

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'auterix-doctor-'));
}

function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('runDiagnostics', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = createTempDir();
  });

  afterEach(() => {
    removeDir(tmpDir);
  });

  it('returns zero score for empty project', () => {
    const report = runDiagnostics(tmpDir);
    assert.strictEqual(report.maxScore, 100);
    assert.strictEqual(report.checks.length, 8);
    assert.strictEqual(report.status, 'AT RISK');
  });

  it('detects missing memory file', () => {
    const report = runDiagnostics(tmpDir);
    const memCheck = report.checks.find((c) => c.name === 'Memory File');
    assert.strictEqual(memCheck.passed, false);
    assert.ok(memCheck.fix.includes('memory'));
  });

  it('passes memory check when memory file has decisions', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.ai/memory.md'),
      '## Architecture\n- [2026-01-01] (agent): Initial setup\n'
    );
    const report = runDiagnostics(tmpDir);
    const memCheck = report.checks.find((c) => c.name === 'Memory File');
    assert.strictEqual(memCheck.passed, true);
  });

  it('fails memory check when memory file has no timestamped entries', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.ai/memory.md'), '# Memory\nEmpty file.\n');
    const report = runDiagnostics(tmpDir);
    const memCheck = report.checks.find((c) => c.name === 'Memory File');
    assert.strictEqual(memCheck.passed, false);
  });

  it('passes schema check when schema.md exists and is non-trivial', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.ai/schema.md'),
      '## Users Table\n| Column | Type |\n|--------|------|\n| id | uuid |\n| email | text |\n'
    );
    const report = runDiagnostics(tmpDir);
    const schemaCheck = report.checks.find((c) => c.name === 'Schema Distillation');
    assert.strictEqual(schemaCheck.passed, true);
  });

  it('passes protected boundaries check when project.json has boundaries', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.ai/project.json'),
      JSON.stringify({ schemaVersion: 1, name: 'test', stack: 'node', protectedBoundaries: ['migrations/*'], commands: [] })
    );
    const report = runDiagnostics(tmpDir);
    const boundaryCheck = report.checks.find((c) => c.name === 'Protected Boundaries');
    assert.strictEqual(boundaryCheck.passed, true);
  });

  it('passes task tracking check when current.md has required headings', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai/tasks'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.ai/tasks/current.md'),
      '# Task\n## Objective\nDo something.\n## Scope\nThis module.\n## Acceptance\nTests pass.\n'
    );
    const report = runDiagnostics(tmpDir);
    const taskCheck = report.checks.find((c) => c.name === 'Task Tracking');
    assert.strictEqual(taskCheck.passed, true);
  });

  it('passes secret scan when .env is gitignored', () => {
    fs.writeFileSync(path.join(tmpDir, '.env'), 'SECRET=abc');
    fs.writeFileSync(path.join(tmpDir, '.gitignore'), '.env\nnode_modules/\n');
    const report = runDiagnostics(tmpDir);
    const secretCheck = report.checks.find((c) => c.name === 'Secret Leak Scan');
    assert.strictEqual(secretCheck.passed, true);
  });

  it('fails secret scan when .env exists without gitignore', () => {
    fs.writeFileSync(path.join(tmpDir, '.env'), 'SECRET=abc');
    const report = runDiagnostics(tmpDir);
    const secretCheck = report.checks.find((c) => c.name === 'Secret Leak Scan');
    assert.strictEqual(secretCheck.passed, false);
  });

  it('passes roles check when .ai/roles/ has role files', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai/roles'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.ai/roles/architect.md'), '# Role: Architect\n');
    const report = runDiagnostics(tmpDir);
    const rolesCheck = report.checks.find((c) => c.name === 'Roles Defined');
    assert.strictEqual(rolesCheck.passed, true);
  });

  it('passes roles check with monolithic roles.md fallback', () => {
    fs.mkdirSync(path.join(tmpDir, '.ai/core'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.ai/core/roles.md'), '# Roles\n| Architect | ... |\n');
    const report = runDiagnostics(tmpDir);
    const rolesCheck = report.checks.find((c) => c.name === 'Roles Defined');
    assert.strictEqual(rolesCheck.passed, true);
  });

  it('calculates correct percentage and status', () => {
    // Set up 4 passing checks out of 8 → 50%
    fs.mkdirSync(path.join(tmpDir, '.ai/tasks'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, '.ai/core'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, '.ai/roles'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.gitignore'), '.env\n');
    fs.writeFileSync(path.join(tmpDir, '.ai/roles/architect.md'), '# Architect\n');
    fs.writeFileSync(
      path.join(tmpDir, '.ai/tasks/current.md'),
      '## Objective\nx\n## Scope\ny\n## Acceptance\nz\n'
    );
    fs.writeFileSync(
      path.join(tmpDir, '.ai/project.json'),
      JSON.stringify({ schemaVersion: 1, name: 'test', stack: 'node', protectedBoundaries: ['x'], commands: [] })
    );
    const report = runDiagnostics(tmpDir);
    // Secret scan + Roles + Task tracking + Protected Boundaries = 4 × 12.5 = 50
    assert.strictEqual(report.percentage, 50);
    assert.strictEqual(report.status, 'NEEDS ATTENTION');
  });
});

describe('formatScorecard', () => {
  it('produces formatted output string with ANSI codes', () => {
    const report = {
      score: 50,
      maxScore: 100,
      percentage: 50,
      status: 'NEEDS ATTENTION',
      checks: [
        { name: 'Test Check 1', passed: true, points: 12.5, maxPoints: 12.5, message: 'OK' },
        { name: 'Test Check 2', passed: false, points: 0, maxPoints: 12.5, message: 'Failed', fix: 'Run fix command' },
      ],
    };
    const output = formatScorecard(report);
    assert.ok(output.includes('AUTERIX DOCTOR'));
    assert.ok(output.includes('Test Check 1'));
    assert.ok(output.includes('Test Check 2'));
    assert.ok(output.includes('NEEDS ATTENTION'));
    assert.ok(output.includes('Run fix command'));
  });
});
