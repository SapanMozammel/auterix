# Initialize an adopted project

Auterix supplies a workflow, not application configuration. Inventory and retain
the repository's stack, formatter, package manager, commands, instructions, task
history and accepted decisions. Nothing here installs dependencies, executes
discovered scripts or changes application identity automatically.

## Establish the task before changing the application

For an existing repository, use its current task mechanism to record the adoption
scope and authority first. For a new repository without task records, create a
short project-owned initialization record. Include the target root, owned paths,
protected behavior, acceptance and rollback. Do not rename application files or
replace instructions while the intended ownership is still unknown.

Inspect the source and follow the [adoption commands](../USAGE.md). Review the
exact preview; conflicts require manual reconciliation, not an overwrite flag.
Preserve original instructions in their existing history or a project-owned
document, retain higher-priority rules, and only then prepare the reviewed starter
content and replan. Legacy hooks and permissions remain active until separately
reviewed; installation does not disable them. Select only needed client adapters.

After adoption, copy `.ai/templates/task.md` into a new project-owned task such as
`.ai/tasks/initialize-project.md`. Fill its fields and sections with the real
initialization work, then set `.ai/manifest.json` `currentTask` to that exact path.
Keep completed tasks as history. Record dependencies only when they are actual
prerequisites; do not rewrite unrelated historical records into the new format.

Set the task's workflow to an entry listed in the manifest, usually
`.ai/core/workflows/migration.md` for adopting an existing project. Record precise
owned paths, risk, prerequisites, non-goals and any accepted architecture/design
decisions. Populate acceptance and the next action before implementation begins.

## Configure project-owned context manually

Edit `.ai/project.json` and project instructions using inspected repository facts:

| Context                  | What to record or preserve                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack and identity       | Actual project purpose, runtime/framework versions and package manager. Keep existing package names unless renaming is in the task.                  |
| Commands                 | Exact root commands and their effects. Inspect the script behind each command; registration never authorizes its execution.                          |
| Capability gaps          | Mark unavailable checks deferred with an owner, trigger, fallback and expiry; explain prerequisites and do not report a pass.                        |
| Boundaries               | Runtime and data ownership, external-service limits, sensitive-data exclusions and operations requiring separate authority.                          |
| Decisions and references | Existing architecture/design documents and reviewed reference sources. Use real repository-relative paths; preserve provenance.                      |
| Current work             | Current task, accepted decisions, concrete next step, completed evidence and outstanding risks. Link relevant artifacts without loading all history. |

Formatting, linting, source folders, tests and CI remain project-owned. Keep their
existing executable configuration and editor settings. Do not copy another
consumer's commands, framework choices or formatter merely because it uses Auterix.

If the task includes creating an application from a template, first inventory its
identity-bearing files: root/workspace package metadata, internal imports and
aliases, application metadata, public URLs, environment examples, Compose/service
names and test database names. Record the exact old-to-new mapping and owned paths
in the initialization task. Apply it deliberately and run that application's
relevant checks; Auterix has no application rename or automatic configuration tool.
Keep source notices and distinguish your business choices from retained examples.

## Verify and hand off

Run the installed checker from the consumer repository:

```sh
node .ai/tools/check.mjs --root /absolute/path/to/project
```

Then run only the applicable, inspected project checks authorized by the task.
Record exact commands, results, environment and unavailable prerequisites. Check
that application files and old instructions/history match the reviewed scope.
Create a reviewed no-op update preview to confirm that local context is preserved.
Use `eject-plan` to inspect the recovery/removal boundary if needed; it deletes
nothing and does not turn broken discovery links into a usable manual workflow.

Move the task through implementation, verification and review as the evidence
changes. Before marking it complete, resolve acceptance, record review findings
and retain the next actionable task or maintenance step. A fresh reader should be
able to identify the task, authority, commands, relevant decisions and remaining
work from these files alone. An installed-checker pass verifies structure and
integrity; actual native-client continuation requires its separate runtime test.
