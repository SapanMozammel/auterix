# Auterix — install, update and migrate

One workflow. Any AI coding tool.

The CLI always requires an explicit absolute project root. Start from a trusted
checkout or reviewed bundle. `inspect` reports known file names; it does not read
environment files, install packages, fetch code or execute consumer scripts.
All `--out` paths must name new files; existing files and symlinks are refused.

## New or existing repository

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

Each profile command declares `id`, `command`, `mode` (`read-only`, `local-write`
or `external-write`) and `status` (`available` or `deferred`). A deferred command
also requires `owner`, `trigger` and `fallback`, so missing capabilities have a
concrete route to completion. Declaring a command never causes its execution.
The installed read-only checker accepts no arguments to use the current project,
or `--root /absolute/project`; mutating adoption always requires an explicit root.

A bundle can be selected for plan and apply with
`--bundle /absolute/workflow-bundle.json`. The exact same bundle must be used for
both. The digest covers all files and metadata; editing the plan or changing
target files invalidates it. Digest validation detects changes, not authorship.

## Updating

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
For write failures, `.ai/workflow.writer.json` contains prior contents and the
plan digest. Inspect and recover the listed files manually, then remove the
journal only after verifying consistency. A journal blocks later updates and
checks so partial adoption cannot silently appear successful. It contains only
the managed/adoption target files; do not add secrets to those files.

`node bin/workflow.mjs eject-plan --root /absolute/project` is read-only. It lists
unchanged managed files eligible for reviewed removal and locally edited files
to preserve. Remove discovery links and managed files as one reviewed change;
retain project tasks, decisions, handoffs and independent policies. If nothing
has changed since adoption, reverting its commit is the simplest rollback.

## Extending and verifying support

Add portable guidance to `baseline/managed` and project starter defaults to
`baseline/project`. Keep vendor bridges limited to discovery. Add a current
official source and setup requirements to the adapter registry, then add static
tests. Record actual client/version execution separately using the installed
tool-verification template; never promote support based on file presence alone.

Run `node --test` before proposing a source update. No publish/tag/push/PR action
is implicit in these instructions or commands.
