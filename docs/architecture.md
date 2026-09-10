# Distribution architecture

`baseline/managed/` owns portable instructions, templates and discovery bridges.
`baseline/project/` provides editable starter context. `lib/workflow.mjs` implements
filesystem guards, content-addressed bundles, preview plans, adoption and checking.
`lib/context.mjs` validates project-owned data through a guarded reader, without
filesystem or process access. `bin/workflow.mjs` is the source CLI; these libraries and a small checker are
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
Application validates the proposed installation through an in-memory overlay
before writing anything. It uses the trusted source validator, never imported
bundle code or consumer commands. Preserved task/profile/decision files participate
in validation; old current tasks require the documented 1.2 contract migration.

A per-project exclusive writer guard records previous contents and intended hashes
before changes. Each file is staged beside its destination, flushed, and replaced
atomically (exclusive creation for new targets). The installed result and observed
context are checked again before success. Ordinary failures restore previous bytes.
Rollback never overwrites a concurrent edit: it retains the journal and reports
the affected files for reviewed recovery. Process termination can also leave a
journal. This is recoverable multi-file adoption, not an OS-wide atomic transaction;
do not start agents against a repository while its writer guard exists.
Filesystem operations assume no hostile process concurrently replaces directories;
symlink checks and drift checks protect ordinary local races, not a hostile OS.

An update never removes files dropped by upstream: it reports a retirement conflict
for review. Ejection is preview-only; preserving or manually removing files remains
a reviewed project change. Adapter selection is recorded in the plan and lock;
only selected vendor bridges and a filtered registry are installed. The generic
AGENTS entry is always retained. The source digest identifies the full reviewed
release, while per-file hashes identify the installed selection. Updates retain
that selection unless explicitly changed; deselecting existing managed bridges
produces a retirement conflict rather than deleting files. Version 1 deliberately avoids automatic merges,
permission changes, hidden shell hooks, network synchronization and global setup.
