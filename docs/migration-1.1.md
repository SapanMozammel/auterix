# Auterix 1.1 migration

Version 1.1.0 uses `SapanMozammel/auterix` as its canonical source identity.
Version 1.0.0 used `SapanMozammel/claude-workflow`. The repository was renamed
in place; new validation accepts only these two exact identities, not arbitrary
repositories. A content digest detects modification but does not authenticate
the source. Review the checkout/bundle before using it.

The original 1.0.0 bundle in `test/fixtures/workflow-1.0.0.json` is immutable
migration evidence, with source digest
`a073d5251e29ecffa545afa11ee1bf05cb21b198f5de86bfb2c5de56c9425d43`.
Do not edit a consumer lock's source or hash by hand.

## Upgrade

Run the **new source CLI**, not the legacy installed checker, to plan and apply:

```sh
node bin/workflow.mjs update-plan --root /absolute/project --out /absolute/new-auterix-plan.json
node bin/workflow.mjs apply --root /absolute/project --plan /absolute/new-auterix-plan.json
node /absolute/project/.ai/tools/check.mjs --root /absolute/project
```

Review the exact plan before the apply command. Existing project-owned instructions,
manifest, profile and tasks are preserved. Changed/missing managed content is a
conflict; do not overwrite it to force an upgrade. The new checker and lock are
installed together, and the MIT notice is added at `.ai/core/LICENSE.md`.
An unchanged repeat update proposes no managed writes.

The old standalone checker knows only the old source identity. It cannot validate
a hand-edited new lock. Use the reviewed installer so code and metadata stay aligned.

## Recovery

Before applying, retain the reviewed old bundle and preserve the consumer worktree
using its normal version-control process. If a write fails, inspect the recovery
journal and follow [recovery guidance](../USAGE.md#recovery-and-ejection).
To roll back a completed update, revert exactly the reviewed managed-file and lock
changes together, preserving later project-owned work. Never restore only one side
of the checker/lock pair. The newly added license notice must be considered in the
same rollback; old-bundle update planning will report its retirement for review.

The branding and license update does not grant new tool permissions or certify
native AI client execution.
