# Universal workflow baseline

Status: complete

## Objective and ownership

Evolve the existing Claude workflow repository into a portable source for multiple
AI tools and arbitrary project stacks; Aufnehmen consumes it as a MENN profile.
Owned paths: `baseline/**`, `bin/**`, `lib/**`, `test/**`, `docs/**`, `AGENTS.md`,
`README.md`, `USAGE.md`, `sync.sh`, `package.json`, `.prettierrc.json`,
`.github/workflows/check.yml`.
The retained historical library is not installed or automatically executed.

## Acceptance

- Canonical product, design, architecture, implementation, testing, review,
  security, migration and release guidance has one source.
- Six vendor discovery adapters and a generic path have an honest support matrix.
- Explicit-root inspection, preview, guarded adoption/update, drift validation,
  and removal preview preserve project-owned files and unknown instructions.
- A content-addressed distributable and standalone validator work without this
  checkout, credentials, network access, or consumer script execution.
- Synthetic documentation, Python and TypeScript consumers pass tests, including
  conflicts, plan tampering, local drift and symlink boundaries.

## Evidence and handoff

Implemented a dependency-free Node installer/checker, versioned content-addressed
bundle, editable project profile and task seed, canonical workflows and templates,
six documented vendor adapters, and generic manual discovery. The installed
checker is self-contained and can use the current project directory.

Verification on 2026-09-06, macOS, Node v24.20.0:

- `node --test`: 29 tests passed; no skipped tests. Includes three different-stack
  consumers, standalone validation, profile-preserving update, unknown conflicts,
  drift/tampering, path and link safety, required metadata, bounded UTF-8 content,
  deferred-capability accountability, and a real mid-write permission failure.
- Two independently reported installer findings were reproduced with failing
  tests, fixed, and retested: file/ancestor collisions and multibyte size bounds.
  The independent reviewer reread both fixes and confirmed 29/29 passing tests
  with no remaining specific finding within the reviewed installer scope.
- Root reviewer requested stronger required-file/lock validation and explicit
  deferred command owner/trigger/fallback; implemented and regression-tested.
- Maintained source and documentation were formatted using the workspace's
  available Prettier with this repository's configuration. `git diff --check`
  passes. No historical skill or command contents were modified.
- CI is prepared for Node 22/24 on Linux/macOS; remote CI has not run because
  these local changes have not been pushed.
  CI uses read-only permissions, disabled persisted checkout credentials and a
  ten-minute job timeout. No authentication, publication or write hooks are added.

Actual execution in other AI clients remains deferred to the user's planned
client checks. Owner: repository maintainer. Trigger: each client is available for
a fresh-session test. Fallback: static bridge validation and explicit manual
context attachment. Antigravity requires confirmation of Always On activation.

Review/install the released bundle in Aufnehmen and add MENN-specific context to
its project profile. Recovery is journalled and manual, not an atomic multi-file
transaction. The owner must choose license terms before an open-source release;
legacy external skills remain excluded. No repository rename, commit, push,
remote write or package publication was performed.

## Auterix naming — 2026-09-06

The owner selected **Auterix** and **One workflow. Any AI coding tool.**
Scope: local README/usage/provenance branding, private package name/description,
this handoff, and the local review checkout directory. Aufnehmen's project-owned
documentation references the same name and tagline. No runtime behavior or
managed workflow content changes are included.

GitHub remains `SapanMozammel/claude-workflow`. Preserve the original source
identity, bundle digest, CLI paths, historical archives and existing Git branch.
The tagline expresses tool-neutral design; native support still requires the
recorded client verification. Remote rename and publication need separate approval.

Verification: `node --test` passed all 29 tests after the local checkout moved to
`/Users/sapanmozammel/Sites/auterix`. Private package name and exact tagline were
asserted. Rebuilt bundle source/digest match Aufnehmen's installed lock; version
1.0.0 and digest `a073d5251e29ecffa545afa11ee1bf05cb21b198f5de86bfb2c5de56c9425d43`
are unchanged. Focused Prettier and `git diff --check` passed. Aufnehmen's installed
workflow and documentation checks passed. Independent read-only naming review
found no substantive issue. Branch and origin are unchanged; the original local
`claude-workflow/main` checkout remains clean. All changes remain uncommitted.

Next: owner review. GitHub rename, source-identity migration, commit, push, PR and
publication remain separate approval-gated actions.
