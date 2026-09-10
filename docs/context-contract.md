# Project context contract

The checker validates declared project context without running project commands,
fetching external sources, or proving that recorded outcomes occurred. The same
dependency-free `lib/context.mjs` module supports installed files and the
installer's proposed file view. Its public interface is:

```js
validateContext({
  readFile: (relativePath) => guardedRead(relativePath), // string or null
  today: '2026-09-06', // optional; defaults to the current UTC date
});
// { ok, errors: string[], warnings: string[], context: { manifest, project, task } }
```

The caller must guard symlinks, root boundaries and file access; this module has
no filesystem imports. Reader failures become diagnostics. It checks local path
syntax before calling the reader and reads at most 256 linked artifacts and 64
declared tasks. `context` can be partial when `ok` is false. `warnings` is reserved
for nonblocking diagnostics and is currently empty. The module never interprets
command text as a shell program or decides whether its declared mode is truthful.

## Project profile and links

Manifest and profile `schemaVersion` remain `1`. The manifest names
`.ai/project.json`, a Markdown `currentTask`, nonempty `readOnStart`, and nonempty
`workflows` arrays. `AGENTS.md` must link to `.ai/manifest.json`. The profile keeps
nonempty `name` and `stack`, arrays of `commands` and `protectedBoundaries`, and
arrays of `architectureDocuments`, `designDocuments`, and `externalReferences`.
Use `[]` when no references apply. A populated reference array must contain safe
repository-relative `.md` or `.json` files that exist and are nonempty. External
references name local review records; those records own source URLs, pinned
revisions and review decisions. Their contents do not become project authority.

Linked Markdown documents are checked recursively for ordinary inline links and
reference definitions to local `.md` and `.json` files. Relative `..` components
are resolved against the containing document and must stay inside the repository.
Code examples and HTML comments are excluded. HTTP(S), mail and same-document
anchor links are not fetched. Other local file links receive path safety checks,
but source, image and binary files are not opened or checked for existence.
Fragments, reference labels and custom Markdown extensions are not validated.
JSON documents are not recursively interpreted as instruction schemas.

Absolute paths, drive/URI prefixes, backslashes, encoded paths, control characters,
and references into `.git`, `.env*`, `node_modules`, `.ssh`, `.aws` or `.gnupg`
are rejected. Context should contain synthetic examples and reviewed guidance,
never secrets or customer data.

## Task schema 1

Every current task and explicitly declared prerequisite task has one copy of each
header field before its first level-two section:

```markdown
# Preserve cart quantity

Task schema: 1
Status: ready
Owned files: src/cart/, test/cart.test.mjs
Risk: medium
Workflow: .ai/core/workflows/implementation.md
Dependencies: .ai/tasks/storage-port.md
```

`Owned files` lists nonempty comma-separated paths, directories or globs scoped
under a named directory, such as `src/**/*.ts`. Root-wide `*`, `**/*`, `.`, `/`,
traversal and placeholders are rejected. Commas delimit entries; use explicit
paths instead of brace/comma glob expressions. Ownership is declared scope, not
proof that the working-tree diff stayed inside it.

`Risk` is `low`, `medium` or `high`; explain its reason in Scope. `Workflow` names
one of the manifest's registered workflow paths. `Dependencies` is `none` or
comma-separated `.ai/tasks/*.md` paths. Cycles, missing dependencies, duplicate
dependencies and invalid prerequisite tasks fail validation. For `ready`,
`in_progress`, `verification`, `review` and `complete`, all prerequisites must be
complete, including prerequisites of prerequisites. Use `draft`, `discovery` or
`blocked` while waiting for a prerequisite. `cancelled` preserves a stopped task.
These nine status values form the supported lifecycle; static checking cannot
prove the order of earlier state transitions.

Objective, Scope, Acceptance, Evidence and Handoff sections are required and must
contain nonempty text beyond comments or bare placeholders such as TODO/TBD.
Drafts describe what is known, what has not been checked and the next discovery
step. A `complete` task additionally requires a nonempty Review section and may
not retain unchecked acceptance checklist items. Record actual commands/results,
findings, resolutions or authorized risk acceptance, and the next step. Merely
passing these textual checks does not prove acceptance, code quality, review,
runtime client behavior or authorization.

## Accountable deferrals

Commands retain `id`, `command`, `mode` (`read-only`, `local-write` or
`external-write`) and `status` (`available` or `deferred`). A deferred command also
requires `owner`, `trigger`, `fallback` and `expires`. Expiry is a real ISO calendar
date `YYYY-MM-DD`, valid through that UTC date. An expired deferral fails checking
until resolved or renewed with an owner-reviewed reason and fallback. The checker
validates date and metadata, not whether that owner actually authorized renewal.

Optional profile `deferrals` uses an array of objects with unique `id`, `reason`,
`owner`, `trigger`, `fallback` and `expires` for unavailable capabilities that are
not commands. Absence and `[]` both mean no recorded profile-level deferrals.
Deferred work must be reported as deferred and must not be counted as a passing
acceptance result.

## Existing project migration

Before adopting an update with this validator, inspect the current task, add the
explicit task schema and metadata, fill its existing sections, and add Review if
it is complete. Add missing profile document arrays and expiry dates to existing
deferrals. Keep project `schemaVersion: 1`. The checker names missing fields and
the current task migration in its diagnostics; an updater must not silently
rewrite project-owned context to pass validation.

Historical task files remain untouched and are not interpreted as task schema 1
merely because a history document links them or lists them in `readOnStart`.
Selecting one as current or declaring it as a dependency explicitly brings it
into validation scope. Migrate that selected task's metadata before continuing,
preserving its historical evidence and decisions.
