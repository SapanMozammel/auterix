# claude-workflow

Private single-source repo for Claude Code workflow — agents, slash commands, skills, and base settings.

## Setup in a new project

```bash
# From your project root:
mkdir -p .claude
npx degit SapanMozammel/claude-workflow/agents   .claude/agents
npx degit SapanMozammel/claude-workflow/commands .claude/commands
npx degit SapanMozammel/claude-workflow/skills   .claude/skills
curl -o .claude/settings.json https://raw.githubusercontent.com/SapanMozammel/claude-workflow/main/settings.json

# Copy and fill in the CLAUDE.md template
curl -o CLAUDE.md https://raw.githubusercontent.com/SapanMozammel/claude-workflow/main/CLAUDE.template.md
```

## Sync an existing project

```bash
# From your project root (safe — never touches plans/ or CLAUDE.md):
curl -fsSL https://raw.githubusercontent.com/SapanMozammel/claude-workflow/main/sync.sh | bash
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
