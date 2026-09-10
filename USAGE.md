# Auterix — install, update and migrate

One workflow. Any AI coding tool.

The CLI always requires an explicit absolute project root. Start from a trusted
checkout or reviewed bundle. `inspect` reports convention/CI file names and bounded
package.json script names, never script bodies. It does not read environment files,
install packages, fetch code or execute consumer scripts.
All `--out` paths must name new files; existing files and symlinks are refused.

## New or existing repository

Follow the [initialization runbook](docs/initialization.md) to preserve existing
policy and create a meaningful first task. Do not treat a successful install as
completed project configuration or verified AI-client behavior.

1. Run `node bin/workflow.mjs inspect --root /absolute/project`.
2. Read the repository's existing instructions and project conventions.
3. Run `node bin/workflow.mjs plan --root /absolute/project --out /absolute/install-plan.json`.
4. Review creates, unchanged files and conflicts against the source bundle.
5. Resolve conflicts manually. Move retained project-specific instructions into
   the project profile/linked docs and preserve the higher-priority policies in
   AGENTS.md. The installer does not merge unknown instructions; prepare the exact
   starter content only after preserving/reconciling the original, then replan.
6. Apply the new plan: `node bin/workflow.mjs apply --root /absolute/project --plan /absolute/install-plan.json`.
7. Populate `.ai/project.json`, `AGENTS.md` and the current task. Run the installed
   checker, relevant project checks and a representative cross-tool handoff.

Select only the discovery adapters you need with `plan --adapters codex,cursor`.
Use `--adapters none` for manual attachment through AGENTS.md only. The default
selects all six documented adapters. Unselected vendor files are not read or
changed by adoption. The plan/lock bind the selection, and updates retain it.
Changing or dropping already-managed adapters needs a new plan; retirement is
a conflict to review, not permission to delete files.

For Codex, an existing root `AGENTS.override.md` takes precedence over AGENTS.md.
The plan detects it and refuses application until its retained project policy
explicitly links `.ai/manifest.json`. Review that reconciliation yourself. Scoped
overrides, global settings and tool configuration still need manual/native-client
checks; presence of a link does not prove an agent obeyed it.

Each profile command declares `id`, `command`, `mode` (`read-only`, `local-write`
or `external-write`) and `status` (`available` or `deferred`). A deferred command
also requires `owner`, `trigger`, `fallback` and an `expires` ISO date, so missing capabilities have a
concrete route to completion. Declaring a command never causes its execution.
The installed read-only checker accepts no arguments to use the current project,
or `--root /absolute/project`; mutating adoption always requires an explicit root.

A bundle can be selected for plan and apply with
`--bundle /absolute/workflow-bundle.json`. The exact same bundle must be used for
both. The digest covers all files and metadata; editing the plan or changing
target files invalidates it. Digest validation detects changes, not authorship.

## Updating

For 1.2.0, first read [the context contract](docs/context-contract.md). Keep old
completed tasks as history; create a current packet with `Task schema: 1`, risk,
workflow, dependencies and substantive sections. Set the manifest's current task
and register any new workflow paths deliberately. All profile document arrays
must contain existing local instruction artifacts. A staged update rejects invalid
context before modifying files; it never rewrites project-owned context for you.

For the 1.0.0 source-name transition, read the
[Auterix 1.1 migration notes](docs/migration-1.1.md) first.

Use `update-plan` with the new reviewed checkout or bundle:

```sh
node bin/workflow.mjs update-plan --root /absolute/project --bundle /absolute/new-bundle.json --out /absolute/update-plan.json
node bin/workflow.mjs apply --root /absolute/project --bundle /absolute/new-bundle.json --plan /absolute/update-plan.json
node /absolute/project/.ai/tools/check.mjs --root /absolute/project
```

The update replaces only unchanged managed files. Project-owned AGENTS, manifest,
profile and tasks are preserved. Local managed edits, missing managed files and
upstream removals require explicit reconciliation; no automatic merge/delete is
performed. A repeated unchanged update writes no managed content.

Consumer distributions should pin both version and source digest and retain the
reviewed bundle or release reference. Keep application rules in the profile so
workflow updates can be reviewed independently of application code.

## Legacy Claude migration

The retired sync script exits nonzero without fetching or writing anything.
Inventory `.claude/settings.json`, hooks, commands, agents, skills, plans and local
permissions separately. Preserve project plans and genuine project rules. Read
and reconcile old behavior before removing or disabling it. The new installer
does not copy these paths and does not disable pre-existing hooks for you.

Do not copy `settings.json` from this repository into consumers. Its historical
permissions and hidden format hooks are outside the maintained baseline. Imported
skills require separate license, provenance, relevance and instruction review.

## Recovery and ejection

Before adoption, preserve the project in its normal version-control workflow.
The installer validates before and after writing and automatically rolls back
ordinary write failures. If interrupted, or if concurrent edits prevent safe
rollback, `.ai/workflow.writer.json` retains prior contents, intended hashes and
the plan digest. Inspect each listed file: restore previous bytes only when its
current hash matches the intended write; preserve changed user content and resolve
the conflict manually. Remove the journal only after verifying consistency, then
run the installed checker. Empty staging directories may remain after rollback.
A journal blocks later updates and checks. It contains only adoption targets;
do not add secrets to those files. No global or whole-repository reset is needed.

`node bin/workflow.mjs eject-plan --root /absolute/project` is read-only. It lists
unchanged managed files eligible for reviewed removal and locally edited files
to preserve. Remove discovery links and managed files as one reviewed change;
retain project tasks, decisions, handoffs and independent policies. If nothing
has changed since adoption, reverting its commit is the simplest rollback.

For a still-usable manual workflow, retain a reviewed local copy of the rules and
task templates before removing upstream-managed core files, then repoint AGENTS,
manifest, task Workflow and decision links together. Alternatively retain the core
as a documented local fork and stop upstream updates. Verify the resulting manual
entry and task handoff; do not remove the lock while leaving stale discovery links.

## Extending and verifying support

Add portable guidance to `baseline/managed` and project starter defaults to
`baseline/project`. Keep vendor bridges limited to discovery. Add a current
official source and setup requirements to the adapter registry, then add static
tests. Record actual client/version execution separately using the installed
tool-verification template; never promote support based on file presence alone.

Run `node --test` before proposing a source update. No publish/tag/push/PR action
is implicit in these instructions or commands.
