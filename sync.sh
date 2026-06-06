#!/bin/bash
# sync.sh — pull latest workflow into the current project's .claude/
# Safe: only overwrites agents/, commands/, skills/, settings.json
# Never touches: plans/, settings.local.json, CLAUDE.md

set -e

REPO="SapanMozammel/claude-workflow"
CLAUDE_DIR=".claude"

if [ ! -d "$CLAUDE_DIR" ]; then
  echo "No .claude/ found. Run from your project root."
  exit 1
fi

echo "Syncing workflow from $REPO..."

npx --yes degit "$REPO/agents"   "$CLAUDE_DIR/agents"   --force
npx --yes degit "$REPO/commands" "$CLAUDE_DIR/commands" --force
npx --yes degit "$REPO/skills"   "$CLAUDE_DIR/skills"   --force
npx --yes degit "$REPO"          "$CLAUDE_DIR"          --force -- settings.json

echo "Done. plans/, settings.local.json, and CLAUDE.md untouched."
