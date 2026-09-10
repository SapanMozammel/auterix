# Pre-merge requirements completion

Status: complete
Owned files: lib/, bin/, baseline/, test/, package.json, AGENTS.md, README.md, USAGE.md, docs/

## Objective

Close the independently reproduced pre-merge review findings and complete the
portable workflow requirements without adding application services or paid AI dependencies.

## Scope

Task/profile validation, staged adoption and recoverable writes, instruction
discovery conflicts, selectable adapters, realistic adoption fixtures, design
decision sequencing, AI-change evaluation, and adopter documentation. Preserve
historical bundles and third-party notices. The owner initially authorized local
fixes and verification, then explicitly authorized committing these changes.
Pushes, merges, visibility changes and publication remain outside this action.

## Acceptance

- Regression tests reject empty completed tasks and broken project references.
- Invalid adoption state cannot report success; failure recovery preserves user changes.
- Higher-precedence Codex instructions are detected and unrelated adapters are optional.
- Meaningful cross-stack adoption/update/handoff cases pass offline.
- Portable design and AI-change guidance are actionable and tool-neutral.
- Aufnehmen receives a reviewed, versioned update with project context preserved.

## Evidence

Starting revision: 8173ab2845ebbfa194072c465e416e5ca484f584, clean worktree.
Review reproduced invalid task/link acceptance, missing staged validation and
undetected AGENTS.override.md. The five installer regressions failed before fixes.
All 65 source tests now pass on Node 24.20.0, including strict context/dependency
and expiry checks, authentic legacy upgrades, staged rejection, atomic replacement,
rollback, concurrent-edit preservation and three realistic adoption scenarios.

Independent review added three failing-first checks for protected-file read order
and concurrent override policy changes; all three pass after correction. Context
validation also rejects task content hidden entirely in HTML comments. The
fixture continuation tests use a separate Node process, not native AI clients.

Version 1.2.0 bundle: 33 total files, 29 managed; source digest
`05010a2c51570f91cb6e996e3f7abd482a9e41a548f3e9df865b6c55794a8c69`.
Aufnehmen's reviewed update applied nine managed-file writes plus its lock;
six project instructions/profile/task-history files were preserved byte-for-byte.
Standalone strict validation passes, and repeated update preview has no changes.
The historical 1.0.0 fixture remains byte-identical to its original pinned hash.

Focused formatting and `git diff --check` passed. Aufnehmen's full downstream
run passed all 17 quality gates: 167 unit/tooling tests, 3 MongoDB integration
tests, 4 browser/accessibility tests, live contract refresh, builds and dependency
audit. No new remote CI result is claimed for this local revision.

## Review

Independent implementation reviews covered context semantics, guarded reads,
rollback/discovery races, meaningful cross-stack fixtures, and downstream test
isolation. The reproduced findings were fixed with regression evidence. Source
and consumer diffs were reviewed for unintended changes; historical bundles and
third-party notices remain intact. No unresolved high/medium review finding remains
within this implementation scope. Static tests cannot establish native AI behavior.

## Handoff

The pre-merge findings are resolved on the existing feature branch. The owner
authorized recording these verified changes in a local commit so work can return
to Recto. Git history identifies the resulting commit. Push and remote CI remain
separate next steps before merge; existing PR #1 does not yet contain this revision.
Native AI clients remain owner-deferred; public source access is a separate
visibility/release decision. No push, merge, visibility change or publication is
part of this commit handoff.
