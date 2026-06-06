# claude-workflow

Private single-source repo for Claude Code workflow — agents, slash commands, skills, and base settings.

## Setup in a new project

```bash
# From your project root:
mkdir -p .claude/plans

# Clone workflow into a temp dir, then copy what you need
TMP=$(mktemp -d)
gh repo clone SapanMozammel/claude-workflow "$TMP" -- --depth=1 --quiet
cp -r "$TMP/agents"   .claude/agents
cp -r "$TMP/commands" .claude/commands
cp -r "$TMP/skills"   .claude/skills
cp    "$TMP/settings.json" .claude/settings.json
cp    "$TMP/CLAUDE.template.md" CLAUDE.md
rm -rf "$TMP"
```

Then edit `CLAUDE.md` to describe your project's stack and conventions.

## Sync an existing project

```bash
# From your project root (safe — never touches plans/ or CLAUDE.md):
TMP=$(mktemp -d)
gh repo clone SapanMozammel/claude-workflow "$TMP" -- --depth=1 --quiet
bash "$TMP/sync.sh"
rm -rf "$TMP"
```

## What's included

| Directory | Contents |
|---|---|
| `agents/` | `code-reviewer`, `test-writer`, `e2e-spec-author`, `graphql-architect`, `tailwind-class-reviewer` |
| `commands/` | `/commit`, `/push`, `/pr`, `/plan`, `/implement`, `/review`, `/test`, `/fix-issue`, and more |
| `skills/` | Architecture, design-system, workflow, and external framework skills |
| `settings.json` | Base permissions + PostToolUse Prettier hooks |

## What's NOT here (project-specific)

- `plans/` — PRDs live in the project repo
- `settings.local.json` — local overrides stay local
- `CLAUDE.md` — project instructions (use `CLAUDE.template.md` as a starting point)
- `resume/` — sapan.dev-only pipeline

## Update the workflow

Edit files in this repo, commit, push. Then run `sync.sh` in each project to pull the changes.
