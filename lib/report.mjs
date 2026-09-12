/**
 * Auterix Compliance Report Formatter
 * Converts check results into structured Markdown for GitHub Step Summary
 * and PR review comments.
 *
 * Zero dependencies — uses only Node.js standard library.
 */

import { VERSION } from './workflow.mjs';

/**
 * Formats a check result into a Markdown compliance report table.
 * Used by action.yml for GITHUB_STEP_SUMMARY output.
 *
 * @param {object} checkResult - The result from workflow.check()
 * @param {object} [options] - Additional formatting options
 * @param {string} [options.lockPath] - Path to lockfile for adapter count
 * @returns {string} Markdown-formatted compliance report
 */
export function formatComplianceReport(checkResult, options = {}) {
  const lines = [];
  const timestamp = new Date().toISOString();

  lines.push('## 🛡️ Auterix Compliance Report');
  lines.push('');

  if (checkResult.ok) {
    lines.push('| Check | Status | Details |');
    lines.push('|-------|--------|---------|');
    lines.push(`| SHA-256 Integrity | ✅ Pass | ${checkResult.managedFiles} managed files verified |`);
    lines.push(`| Manifest Valid | ✅ Pass | Schema v1 compliant |`);
    lines.push(`| Protected Boundaries | ✅ Pass | No unauthorized mutations |`);
    lines.push(`| Context Validation | ✅ Pass | All targets accessible |`);
    lines.push('');
    lines.push('**Result: ✅ ALL CHECKS PASSED**');
  } else {
    lines.push('| Check | Status | Details |');
    lines.push('|-------|--------|---------|');
    lines.push(`| SHA-256 Integrity | ❌ Fail | Architectural drift detected |`);
    lines.push('');
    lines.push('**Result: ❌ DRIFT DETECTED**');
    lines.push('');
    lines.push('Run `npx auterix apply` locally to re-synchronize adapter rules.');
  }

  lines.push('');
  lines.push(`> Verified by [Auterix](https://auterix.dev) v${VERSION} at ${timestamp}`);

  return lines.join('\n');
}

/**
 * Formats a detailed per-adapter SHA-256 parity matrix.
 * Used by the Pro PR Comment Bot for rich inline review comments.
 *
 * @param {object} lockData - Parsed .ai/workflow.lock.json
 * @param {object} [driftMap] - Optional map of file → { expected, actual } for drifted files
 * @returns {string} Markdown-formatted adapter parity matrix
 */
export function formatAdapterParityMatrix(lockData, driftMap = {}) {
  const lines = [];

  lines.push('### Adapter Parity Matrix');
  lines.push('');
  lines.push('| File | SHA-256 (expected) | Status |');
  lines.push('|------|-------------------|--------|');

  if (lockData?.files) {
    for (const [file, hash] of Object.entries(lockData.files)) {
      const shortHash = hash.slice(0, 8);
      const isDrifted = Object.hasOwn(driftMap, file);
      const status = isDrifted ? '❌ Drifted' : '✅ Verified';
      lines.push(`| \`${file}\` | \`${shortHash}…\` | ${status} |`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Formats a safety check summary section.
 *
 * @param {object} options
 * @param {boolean} options.secretsClean - Whether no secrets were detected
 * @param {boolean} options.boundariesIntact - Whether protected boundaries are intact
 * @param {string[]} [options.modifiedProtected] - List of modified protected paths
 * @returns {string} Markdown-formatted safety summary
 */
export function formatSafetyChecks({ secretsClean = true, boundariesIntact = true, modifiedProtected = [] }) {
  const lines = [];

  lines.push('### Safety Checks');
  lines.push('');
  lines.push(`- ${secretsClean ? '✅' : '❌'} No secrets detected in diff`);
  lines.push(`- ${boundariesIntact ? '✅' : '⚠️'} Protected boundaries ${boundariesIntact ? 'intact' : 'modified'}`);

  if (modifiedProtected.length > 0) {
    for (const p of modifiedProtected) {
      lines.push(`  - ⚠️ \`${p}\` — manual review recommended`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
