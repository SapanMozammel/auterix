# Workflow source repository

This repository maintains a portable AI engineering workflow consumed by application
repositories. Read `docs/tasks/auterix-1.1-integration.md` and `docs/architecture.md`
before editing. The maintained distribution is `baseline/`, `lib/`, and `bin/`.
The original `commands/`, `agents/`, `skills/`, and `settings.json` are historical
references, excluded from releases; they do not define current project policy.

Use Node's built-in test runner (`node --test`). Keep the installer dependency-free
and fail closed on unknown content, changed plans, paths outside the explicit root,
and symlinks. Never run consumer scripts during discovery. Use synthetic fixtures.
Preserve unrelated changes. Do not commit, push, publish, or open a PR without
explicit authorization. Record evidence and handoff in the task before stopping.
