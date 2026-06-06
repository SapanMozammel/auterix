---
description: Run Lighthouse CI locally against /  and /articles, report budget verdict + score deltas vs the previous run
allowed-tools: Bash(pnpm run lhci*), Bash(pnpm run build*), Bash(node *), Read
---

# Lighthouse CI

Runs Lighthouse CI locally against the configured URLs (`/`, `/articles`) using `.lighthouserc.json`. Reports per-URL median scores, the budget verdict, and the delta vs the last run if one is on disk.

## Input

Optional flags: `$ARGUMENTS`

- `--no-build` — skip the production build (only safe if `.next/` is fresh)
- `--collect-only` — run `lhci collect` without `lhci assert` or `lhci upload` (useful for local debugging)

## Process

1. **Confirm `.lighthouserc.json` exists:**

   ```bash
   [ -f .lighthouserc.json ] || echo "MISSING"
   ```

   If missing, abort with: "`.lighthouserc.json` not found at the repo root."

2. **Persist the previous run** — if `.lighthouseci/manifest.json` already exists, copy it to `.lighthouseci/last-run-manifest.json` BEFORE running. The new `lhci collect` will overwrite the directory; we need the snapshot for delta comparison.

   ```bash
   if [ -f .lighthouseci/manifest.json ]; then
     cp .lighthouseci/manifest.json .lighthouseci/last-run-manifest.json
   fi
   ```

3. **Run Lighthouse:**

   ```bash
   pnpm run lhci   # or `pnpm run lhci:collect` if --collect-only
   ```

   `lhci autorun` runs `collect → assert → upload` in sequence. The script's exit code reflects assertion pass/fail. `temporary-public-storage` upload posts a public URL to the report.

4. **Parse the median scores per URL** from `.lighthouseci/manifest.json` (the entry with `isRepresentativeRun: true` is the median run):

   ```bash
   node -e "
   const fs = require('fs');
   const path = '.lighthouseci/manifest.json';
   if (!fs.existsSync(path)) process.exit(0);
   const data = JSON.parse(fs.readFileSync(path, 'utf8'));
   for (const r of data) {
     if (r.isRepresentativeRun) {
       const s = r.summary;
       console.log(\`\${r.url}: perf=\${s.performance.toFixed(2)} a11y=\${s.accessibility.toFixed(2)} bp=\${s['best-practices'].toFixed(2)} seo=\${s.seo.toFixed(2)}\`);
     }
   }
   "
   ```

5. **Compute deltas** vs the last run if `.lighthouseci/last-run-manifest.json` exists. For each URL + category, report sign + magnitude:
   - `↑ +0.05` (improvement)
   - `↓ -0.03` (regression)
   - `=` (no change within ±0.005)

6. **Read `.lighthouseci/assertion-results.json`** if present — surface the failing audits (top 3 by impact). Each entry has `auditId`, `auditTitle`, `actual`, `expected`, `level` (`'error'` or `'warn'`).

7. **Print a concise table:**

   ```
   URL                              perf    a11y    bp      seo     verdict
   http://localhost:8002/           0.68    0.98    1.00    0.92    ⚠ warn
   http://localhost:8002/articles   0.92    0.98    1.00    1.00    ✓ pass
   ```

   Plus the top 3 failing audits with their documentation link.

8. **Print the public report URL(s)** that `lhci upload` returned — they look like `https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/<id>.report.html`.

## Hard rules — DO NOT BREAK

- **Never push.** Local-only.
- **Never commit `.lighthouseci/`** — it's gitignored. If artifacts show up in `git status`, they shouldn't be staged.
- **Never silently widen budget thresholds in `.lighthouserc.json`** to make a run pass. If a budget needs tuning, open a discussion with the user — don't tune it from this command.
- **Never skip the build (`--no-build`)** unless the user explicitly passed the flag AND the diff against the last build is empty (no `src/**` changes).
- If `pnpm run build` fails, stop. The Lighthouse run depends on a working production bundle.

## Notes

- Default thresholds (per `.lighthouserc.json`):
  - performance ≥ 0.80 (warn)
  - accessibility ≥ 0.95 (error)
  - best-practices ≥ 0.90 (error)
  - seo ≥ 0.90 (warn — lowered from 0.95 because homepage's `link-text` and `robots-txt` audits drag the median; tracked as follow-up)
- Port: `8002` (sapan dev = 8000, e2e = 8001, lhci = 8002 — registry documented in `docs/DEVELOPMENT_GUIDE.md`).
- For the GitHub Actions CI run, the `lighthouse` job in `.github/workflows/ci.yml` runs the same `pnpm exec lhci autorun` with `continue-on-error: true` for the first 2 weeks; promote to blocking after a perf-tuning pass.
