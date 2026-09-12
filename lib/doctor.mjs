/**
 * Auterix Doctor — AI Safety & Readiness Scorecard
 * Scans a project and produces a scored diagnostic report (0–100%)
 * with actionable fix recommendations for each failing check.
 *
 * Zero dependencies — uses only Node.js standard library.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const POINTS_PER_CHECK = 12.5;

const sha256 = (content) =>
  createHash('sha256').update(content).digest('hex');

/**
 * Individual diagnostic checks — each returns { name, passed, points, maxPoints, message, fix }
 */

function checkAdapterSync(root) {
  const name = 'Adapter Sync';
  const maxPoints = POINTS_PER_CHECK;
  const lockPath = path.join(root, '.ai/workflow.lock.json');

  if (!fs.existsSync(lockPath)) {
    return { name, passed: false, points: 0, maxPoints, message: 'No lockfile found', fix: 'npx auterix init' };
  }

  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
    if (!lock.files || typeof lock.files !== 'object') {
      return { name, passed: false, points: 0, maxPoints, message: 'Invalid lockfile format', fix: 'npx auterix init' };
    }

    const drifted = [];
    for (const [file, expectedHash] of Object.entries(lock.files)) {
      const filePath = path.join(root, file);
      if (!fs.existsSync(filePath)) {
        drifted.push(file);
        continue;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      if (sha256(content) !== expectedHash) {
        drifted.push(file);
      }
    }

    const total = Object.keys(lock.files).length;
    if (drifted.length === 0) {
      return { name, passed: true, points: maxPoints, maxPoints, message: `${total}/${total} adapters verified` };
    }
    return { name, passed: false, points: 0, maxPoints, message: `${drifted.length}/${total} adapters drifted`, fix: 'npx auterix apply' };
  } catch {
    return { name, passed: false, points: 0, maxPoints, message: 'Lockfile could not be parsed', fix: 'npx auterix init' };
  }
}

function checkSchemaDistillation(root) {
  const name = 'Schema Distillation';
  const maxPoints = POINTS_PER_CHECK;
  const schemaPath = path.join(root, '.ai/schema.md');

  if (!fs.existsSync(schemaPath)) {
    return { name, passed: false, points: 0, maxPoints, message: '.ai/schema.md not found', fix: 'npx auterix extract-schema --file <schema-file> --out .ai/schema.md' };
  }

  const content = fs.readFileSync(schemaPath, 'utf-8').trim();
  if (content.length < 10) {
    return { name, passed: false, points: 0, maxPoints, message: '.ai/schema.md is effectively empty', fix: 'npx auterix extract-schema --file <schema-file> --out .ai/schema.md' };
  }

  return { name, passed: true, points: maxPoints, maxPoints, message: `Schema documented (${content.length} chars)` };
}

function checkMemoryFile(root) {
  const name = 'Memory File';
  const maxPoints = POINTS_PER_CHECK;
  const memoryPath = path.join(root, '.ai/memory.md');

  if (!fs.existsSync(memoryPath)) {
    return { name, passed: false, points: 0, maxPoints, message: '.ai/memory.md not found', fix: 'npx auterix memory --category architecture --note "Initial project setup"' };
  }

  const content = fs.readFileSync(memoryPath, 'utf-8');
  // Check if there's at least one recorded decision (timestamped entry)
  const hasEntry = /- \[\d{4}-\d{2}-\d{2}\]/.test(content);
  if (!hasEntry) {
    return { name, passed: false, points: 0, maxPoints, message: 'No recorded decisions found', fix: 'npx auterix memory --category architecture --note "Describe a key decision"' };
  }

  return { name, passed: true, points: maxPoints, maxPoints, message: 'Cross-agent memory active' };
}

function checkPreCommitHook(root) {
  const name = 'Pre-Commit Hook';
  const maxPoints = POINTS_PER_CHECK;
  const hookPath = path.join(root, '.git/hooks/pre-commit');

  if (!fs.existsSync(hookPath)) {
    return { name, passed: false, points: 0, maxPoints, message: 'No pre-commit hook installed', fix: 'npx auterix init --pre-commit' };
  }

  const content = fs.readFileSync(hookPath, 'utf-8');
  if (!content.includes('auterix') && !content.includes('check.mjs') && !content.includes('workflow.mjs')) {
    return { name, passed: false, points: 0, maxPoints, message: 'Pre-commit hook exists but does not reference Auterix', fix: 'npx auterix init --pre-commit' };
  }

  return { name, passed: true, points: maxPoints, maxPoints, message: 'Auterix guardrail active' };
}

function checkProtectedBoundaries(root) {
  const name = 'Protected Boundaries';
  const maxPoints = POINTS_PER_CHECK;
  const projectPath = path.join(root, '.ai/project.json');

  if (!fs.existsSync(projectPath)) {
    return { name, passed: false, points: 0, maxPoints, message: '.ai/project.json not found', fix: 'npx auterix init' };
  }

  try {
    const project = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
    if (!Array.isArray(project.protectedBoundaries) || project.protectedBoundaries.length === 0) {
      return { name, passed: false, points: 0, maxPoints, message: 'No protected boundaries defined', fix: 'Edit .ai/project.json and add protectedBoundaries array' };
    }
    return { name, passed: true, points: maxPoints, maxPoints, message: `${project.protectedBoundaries.length} boundaries protected` };
  } catch {
    return { name, passed: false, points: 0, maxPoints, message: 'project.json could not be parsed', fix: 'npx auterix init' };
  }
}

function checkTaskTracking(root) {
  const name = 'Task Tracking';
  const maxPoints = POINTS_PER_CHECK;
  const taskPath = path.join(root, '.ai/tasks/current.md');

  if (!fs.existsSync(taskPath)) {
    return { name, passed: false, points: 0, maxPoints, message: '.ai/tasks/current.md not found', fix: 'Create .ai/tasks/current.md with Objective, Scope, Acceptance, Evidence, Handoff sections' };
  }

  const content = fs.readFileSync(taskPath, 'utf-8');
  const requiredHeadings = ['## Objective', '## Scope', '## Acceptance'];
  const missing = requiredHeadings.filter((h) => !content.includes(h));
  if (missing.length > 0) {
    return { name, passed: false, points: 0, maxPoints, message: `Task file missing: ${missing.join(', ')}`, fix: 'Add required headings to .ai/tasks/current.md' };
  }

  return { name, passed: true, points: maxPoints, maxPoints, message: 'Task tracking active' };
}

function checkSecretLeakScan(root) {
  const name = 'Secret Leak Scan';
  const maxPoints = POINTS_PER_CHECK;

  const dangerousFiles = ['.env', '.env.local', '.env.production'];
  const staged = dangerousFiles.filter((f) => {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) return false;
    // Check if file is tracked by looking for .gitignore coverage
    const gitignorePath = path.join(root, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
      if (gitignore.includes('.env') || gitignore.includes(f)) return false;
    }
    return true;
  });

  if (staged.length > 0) {
    return { name, passed: false, points: 0, maxPoints, message: `${staged.join(', ')} not in .gitignore`, fix: 'Add .env* to .gitignore' };
  }

  return { name, passed: true, points: maxPoints, maxPoints, message: 'No credential exposure detected' };
}

function checkRolesDefined(root) {
  const name = 'Roles Defined';
  const maxPoints = POINTS_PER_CHECK;

  // Check for modular roles directory first
  const rolesDir = path.join(root, '.ai/roles');
  if (fs.existsSync(rolesDir) && fs.statSync(rolesDir).isDirectory()) {
    const roleFiles = fs.readdirSync(rolesDir).filter((f) => f.endsWith('.md'));
    if (roleFiles.length > 0) {
      return { name, passed: true, points: maxPoints, maxPoints, message: `${roleFiles.length} modular roles defined` };
    }
  }

  // Fall back to checking monolithic roles.md
  const rolesPath = path.join(root, '.ai/core/roles.md');
  if (fs.existsSync(rolesPath)) {
    const content = fs.readFileSync(rolesPath, 'utf-8');
    if (content.includes('Architect') || content.includes('Engineer')) {
      return { name, passed: true, points: maxPoints, maxPoints, message: 'Roles defined in .ai/core/roles.md' };
    }
  }

  return { name, passed: false, points: 0, maxPoints, message: 'No role definitions found', fix: 'npx auterix init' };
}

/**
 * Runs all diagnostic checks and returns a scored report.
 * @param {string} root - Absolute path to project root
 * @returns {{ score: number, maxScore: number, percentage: number, status: string, checks: Array }}
 */
export function runDiagnostics(root) {
  const resolvedRoot = path.resolve(root);

  const checks = [
    checkAdapterSync(resolvedRoot),
    checkSchemaDistillation(resolvedRoot),
    checkMemoryFile(resolvedRoot),
    checkPreCommitHook(resolvedRoot),
    checkProtectedBoundaries(resolvedRoot),
    checkTaskTracking(resolvedRoot),
    checkSecretLeakScan(resolvedRoot),
    checkRolesDefined(resolvedRoot),
  ];

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const percentage = Math.round((score / maxScore) * 100);

  let status;
  if (percentage === 100) status = 'EXCELLENT';
  else if (percentage >= 75) status = 'GOOD';
  else if (percentage >= 50) status = 'NEEDS ATTENTION';
  else status = 'AT RISK';

  return { score, maxScore, percentage, status, checks };
}

/**
 * Formats a diagnostic report as ANSI-colored terminal output.
 * @param {{ score: number, maxScore: number, percentage: number, status: string, checks: Array }} report
 * @returns {string}
 */
export function formatScorecard(report) {
  const CYAN = '\x1b[36m';
  const GREEN = '\x1b[32m';
  const YELLOW = '\x1b[33m';
  const RED = '\x1b[31m';
  const DIM = '\x1b[2m';
  const BOLD = '\x1b[1m';
  const RESET = '\x1b[0m';

  const lines = [];
  const width = 50;

  lines.push('');
  lines.push(`${CYAN}┌${'─'.repeat(width)}┐${RESET}`);
  lines.push(`${CYAN}│${RESET}  🏥  ${BOLD}AUTERIX DOCTOR${RESET} — AI Readiness Report${' '.repeat(width - 44)}${CYAN}│${RESET}`);
  lines.push(`${CYAN}├${'─'.repeat(width)}┤${RESET}`);

  for (const check of report.checks) {
    const icon = check.passed ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
    const pts = `${check.points} / ${check.maxPoints}`;
    const nameStr = check.name;
    const dots = '.'.repeat(Math.max(1, width - nameStr.length - pts.length - 10));
    lines.push(`${CYAN}│${RESET}  ${icon} ${nameStr} ${DIM}${dots}${RESET} ${pts}${CYAN}│${RESET}`);

    if (!check.passed && check.fix) {
      lines.push(`${CYAN}│${RESET}     ${DIM}→ ${check.fix}${RESET}${' '.repeat(Math.max(0, width - check.fix.length - 8))}${CYAN}│${RESET}`);
    }
  }

  lines.push(`${CYAN}├${'─'.repeat(width)}┤${RESET}`);

  const statusColor = report.percentage === 100 ? GREEN : report.percentage >= 50 ? YELLOW : RED;
  const statusLine = `SCORE: ${report.score} / ${report.maxScore}  ${statusColor}${report.status}${RESET}`;
  lines.push(`${CYAN}│${RESET}  ${BOLD}${statusLine}${RESET}${' '.repeat(Math.max(0, width - 30))}${CYAN}│${RESET}`);
  lines.push(`${CYAN}└${'─'.repeat(width)}┘${RESET}`);
  lines.push('');

  return lines.join('\n');
}
