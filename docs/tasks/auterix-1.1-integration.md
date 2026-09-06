# Auterix 1.1 integration and repository handoff

Status: complete

## Outcome and authority

Complete the Auterix identity migration, license the author's original maintained
workflow, upgrade Aufnehmen safely, and prepare verified review PRs for both
repositories. The owner authorized the GitHub rename, commits, pushes and PRs and
delegated license selection; MIT was chosen. Merging, visibility changes, tags,
package/release publication and deployment remain out of scope.

## Scope and ownership

Own `lib/`, `test/`, `baseline/managed/.ai/core/LICENSE.md`, `LICENSE`,
`package.json`, `AGENTS.md`, `README.md`, `USAGE.md`, `docs/` and
`.github/workflows/check.yml`. Preserve historical external skills and their
licenses. Aufnehmen owns its managed update and application engineering checks.
Recto receives documentation-only handoff changes.

## Acceptance

- GitHub identity is Auterix, preserving repository ID, history and visibility.
- New bundles use version 1.1.0 and the canonical source; only the exact prior
  source alias remains accepted. Real 1.0.0 consumers upgrade without losing
  project context; unknown sources and managed drift still fail closed.
- MIT notice accompanies the maintained distribution and installed bundle.
- Conformance and consumer checks pass; exact digest and findings are recorded.
- Review branches and PRs exist with remote checks reported honestly.

## Progress and decisions

- GitHub repository ID 1261468915 was renamed from `claude-workflow` to
  `auterix`, with tagline **One workflow. Any AI coding tool.** Private visibility
  is preserved; Aufnehmen remains a separate public MENN template.
- Preserve the original 1.0.0 bundle as a migration fixture; never rewrite its
  source identity or digest to make it appear newly authored.
- Compatibility is an explicit two-name allowlist, not arbitrary source trust.
- Local MIT notices do not relicense historical third-party material.

## Verification and findings

- Failing-first migration run: 3 failures/31 passes before the source change.
  After implementation and license coverage, `node --test`: **35 passed**, no skips.
- Real immutable 1.0.0 artifact upgrades through the new CLI; project context,
  standalone checking, repeat-update idempotency and conflict safety are covered.
- 1.1.0 bundle: 30 files, 26 managed; source `SapanMozammel/auterix`; digest
  `205d0a55f2f543049c1f353a4d84d6f16a198929a9f2ec9cff7d3f15fef2ae6f`.
- Aufnehmen adopted the reviewed plan: two managed writes plus lock update, all
  five inspected project-context files preserved byte-for-byte. Repeated preview
  proposed no writes or conflicts. Standalone validation passes.
- Aufnehmen full gate passed all 16 checks: 144 unit/contract/tooling tests,
  3 real MongoDB tests, 4 browser/accessibility journeys, builds and dependency audit.
- Maintained-file formatting and whitespace checks passed. Historical fixture
  bytes retain their independent pinned hash and were excluded from formatting.
- Review [PR #1](https://github.com/SapanMozammel/auterix/pull/1) is open against
  `main`, with implementation commit `71f4abf355ed9f08aeed9b6f138e94aaa0775f55`.
  [PR CI](https://github.com/SapanMozammel/auterix/actions/runs/34041316927)
  passed all four Node 22/24 × Linux/macOS jobs; the push run also passed.
- The initial HTTPS push was refused because the OAuth token lacks workflow-file
  scope. Existing SSH authentication completed the authorized push; no credentials
  or account scopes were changed. Local secret-pattern scanning also passed.
- Independent migration review confirmed the identity, fixture, license and
  conflict boundaries. It caught source-relative installed-checker examples;
  those now use absolute consumer paths so the documented commands work without
  an implicit directory change. Its five focused checks passed.

See the completed foundation history in [universal-baseline.md](universal-baseline.md);
its earlier counts describe that revision, not this update.

## Risks and handoff

Native client runtime verification remains the founder's deferred task. Documented
adapters/manual context do not certify client behavior. No release or merge is
implicit in a green PR. Next: founder review of PR #1, then separately authorized
merge/publication and native client checks. The branch contains the implementation
and this durable evidence; no Recto product or Git changes were included. CI for
any subsequent documentation commit is visible on the same PR.
