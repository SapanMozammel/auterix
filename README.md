# Auterix

**One workflow. Any AI coding tool.**

Auterix is a reusable, tool-neutral workflow for AI-assisted product design and
software engineering. Projects adopt shared instructions, tasks, reviews and
handoffs while keeping their own stack and engineering conventions. Aufnehmen
integrates Auterix with a MongoDB, Express, Next.js and Node.js project profile;
other stacks supply their own profile.

The tagline describes the tool-neutral design, not verified native compatibility
with every client. Tools need repository access or explicitly attached context;
see [tool support](docs/tool-support.md) for adapter setup and verification status.

Source: [SapanMozammel/auterix](https://github.com/SapanMozammel/auterix).
Version 1.1.0 emits the Auterix source identity and accepts the exact legacy
`SapanMozammel/claude-workflow` identity for existing reviewed installations.
See the [migration notes](docs/migration-1.1.md) before updating a 1.0.0 consumer.

The current baseline includes product discovery, experienced design practices,
architecture decisions, implementation, testing, security, migration and release
workflows. Thin discovery adapters cover Codex, Claude Code, Cursor, Augment,
Copilot and Antigravity. Other tools can explicitly read the same project files.
See [tool support](docs/tool-support.md) for setup and verification status.

## Adoption

Requires Node.js 22 or later; no package installation, credentials or network
access is required by the installer. Review the checked-out source first.

```sh
node bin/workflow.mjs inspect --root /absolute/path/to/project
node bin/workflow.mjs plan --root /absolute/path/to/project --out /absolute/path/to/new-plan.json
```

Review the plan and source files. Unknown instruction conflicts must be resolved
manually; the installer does not overwrite them or import old permissions.

```sh
node bin/workflow.mjs apply --root /absolute/path/to/project --plan /absolute/path/to/new-plan.json
node bin/workflow.mjs check --root /absolute/path/to/project
```

Then edit the project-owned `.ai/project.json`, `AGENTS.md` and current task with
the actual stack, commands and boundaries. From the adopted repository alone:

```sh
node /absolute/path/to/project/.ai/tools/check.mjs --root /absolute/path/to/project
```

The canonical workflow and templates under `.ai/core` and `.ai/templates` are
managed by a content hash lock. Project instructions, profile, tasks, decisions
and handoffs stay project-owned. See [usage and migration](USAGE.md).

## Distribution and checks

```sh
node --test
node bin/workflow.mjs bundle --out /absolute/path/to/new-bundle.json
```

Bundles are versioned and content-addressed. Adoption can use `--bundle` to select
that exact artifact. The installed checker has no source-checkout dependency.
Tests exercise documentation, Python and TypeScript consumers plus conflict,
drift, path, handoff structure and standalone validation behavior.

Client runtime verification is deferred until the actual clients are exercised;
static integration checks are not a claim that every model follows instructions.
No hosted service, paid inference, hidden hook or global permission change is
required. The portable workflow deliberately leaves formatting and application
architecture to each project's profile.

## Legacy source

The original `agents/`, `commands/`, `skills/`, `settings.json` and
`CLAUDE.template.md` remain historical references, excluded from fresh bundles.
`sync.sh` now exits without changing files. Do not use the archived setup or
permission settings for new projects. Review [provenance](docs/provenance.md),
[architecture](docs/architecture.md) and the [implementation evidence](docs/tasks/universal-baseline.md).

## License

Original maintained code and guidance are [MIT licensed](LICENSE). Bundles include
the notice at `.ai/core/LICENSE.md`; retain it when reusing the workflow.
Historical third-party material keeps its own terms and remains excluded from
bundles. See [provenance](docs/provenance.md) for the scope.
