# Archived Claude-only usage — do not execute

Historical reference only. The synchronization and setup commands below are
retired. Use the current root USAGE.md and preview-based installer instead.

How to use this repo as a single source of truth for your Claude Code workflow across multiple projects.

---

## Bootstrapping a new project

Run these commands from your **project root** (requires `gh` CLI, already authenticated):

```bash
mkdir -p .claude/plans

TMP=$(mktemp -d)
gh repo clone SapanMozammel/claude-workflow "$TMP" -- --depth=1 --quiet

cp -r "$TMP/agents"            .claude/agents
cp -r "$TMP/commands"          .claude/commands
cp -r "$TMP/skills"            .claude/skills
cp    "$TMP/settings.json"     .claude/settings.json
cp    "$TMP/CLAUDE.template.md" CLAUDE.md

rm -rf "$TMP"
```

Then edit `CLAUDE.md` to describe your project's stack, commands, and conventions.

---

## Syncing an existing project

When you update a skill, agent, or command in this repo, pull the changes into any project without touching its plans or CLAUDE.md:

```bash
# From your project root:
TMP=$(mktemp -d)
gh repo clone SapanMozammel/claude-workflow "$TMP" -- --depth=1 --quiet
bash "$TMP/sync.sh"
rm -rf "$TMP"
```

What `sync.sh` overwrites: `agents/`, `commands/`, `skills/`, `settings.json`
What it **never touches**: `plans/`, `settings.local.json`, `CLAUDE.md`

---

## What lives where

| Location | What goes here | Examples |
|---|---|---|
| This repo (`claude-workflow`) | Generic, reusable workflow | Slash commands, agents, external skills |
| Project `.claude/plans/` | Project-specific PRDs | `why-render/prd.md`, `auth-flow/prd.md` |
| Project `CLAUDE.md` | Project-specific instructions | Stack, file conventions, commands |
| Project `.claude/settings.local.json` | Local-only permissions | Custom build scripts, local tools |

**Rule of thumb:** if it applies to more than one project, it belongs in this repo. If it's specific to one project, it stays in that project.

---

## Improving the workflow

1. Edit the relevant file in `~/Sites/claude-workflow`
2. Test it in one project first
3. Commit and push to `main`
4. Run `sync.sh` in projects that need the update

```bash
cd ~/Sites/claude-workflow
# ... edit a skill or command ...
git add <file>
git commit -m "feat(commands): improve /commit message format"
git push
```

---

## Adding a new skill

1. Create the file under `skills/` (use kebab-case):
   ```
   skills/workflow/my-new-skill.md
   ```
2. Reference it in the relevant slash command or agent that loads it
3. Commit + push → sync to projects that need it

---

## Adding a new slash command

1. Create `commands/my-command.md`
2. Follow the existing command format (see any file in `commands/` as a template)
3. Add it to the `CLAUDE.md` commands table in projects that will use it

---

## Project-specific settings

If a project needs extra permissions (e.g. a build script, a custom tool), add them to `.claude/settings.local.json` in that project — not here:

```json
{
  "permissions": {
    "allow": [
      "Bash(bash scripts/build.sh)"
    ]
  }
}
```

`settings.local.json` is in `.gitignore` in this repo and is never overwritten by `sync.sh`.

---

## Repo structure

```
claude-workflow/
├── agents/          # Sub-agent definitions (code-reviewer, test-writer, etc.)
├── commands/        # Slash commands (/commit, /push, /pr, /plan, /implement, etc.)
├── skills/
│   ├── architecture/    # Component patterns, routing, state, data
│   ├── design-system/   # Colors, typography, spacing tokens
│   ├── workflow/        # Testing, feature-planning, no-use-effect, etc.
│   └── external/        # React, TypeScript, Next.js, Playwright, Apollo skills
├── settings.json        # Base permissions + PostToolUse Prettier hooks
├── CLAUDE.template.md   # Starter template for new project CLAUDE.md
├── sync.sh              # Safe sync script for existing projects
├── USAGE.md             # This file
└── README.md            # Quick-start reference
```
