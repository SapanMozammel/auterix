# Distribution architecture

`baseline/managed/` owns portable instructions, templates and discovery bridges.
`baseline/project/` provides editable starter context. `lib/workflow.mjs` implements
filesystem guards, content-addressed bundles, preview plans, adoption and checking.
`bin/workflow.mjs` is the source CLI; the same library and a small checker are
included in every consumer. No framework, provider, formatter, package manager or
permission settings are selected by the portable core.

The project keeps `AGENTS.md`, `.ai/manifest.json`, `.ai/project.json`, tasks, ADRs,
design decisions, reviews and handoffs. Updates manage only recorded file hashes.
Changing managed content requires a reviewed upstream change or an explicit fork;
the updater reports drift and never replaces local edits automatically.

Bundle SHA-256 detects changed content; it is not a signature or proof that code
is trustworthy. Inspect a release and its source before adoption. No network
fetching, package installation or project script execution occurs in the CLI.
Planning and inspection are read-only except an explicit, newly created `--out`.
Application uses a per-project exclusive writer guard and records its recovery
journal before changing managed files. It retains that journal if a write fails.
This is journalled recovery, not an atomic multi-file transaction: a failure can
leave partially written guidance until the recorded recovery is completed.
Filesystem operations assume no hostile process concurrently replaces directories;
symlink checks and drift checks protect ordinary local races, not a hostile OS.

An update never removes files dropped by upstream: it reports a retirement conflict
for review. Ejection is preview-only; preserving or manually removing files remains
a reviewed project change. Version 1 deliberately avoids automatic merges,
permission changes, hidden shell hooks, network synchronization and global setup.
