#!/bin/bash
# sync.sh — pull latest workflow into the current project's .claude/
# Safe: only overwrites agents/, commands/, skills/, settings.json
# Never touches: plans/, settings.local.json, CLAUDE.md

set -e

REPO="SapanMozammel/claude-workflow"
CLAUDE_DIR=".claude"
TMP_DIR=$(mktemp -d)

if [ ! -d "$CLAUDE_DIR" ]; then
  echo "No .claude/ found. Run from your project root."
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "GitHub CLI (gh) is required. Install: https://cli.github.com"
  exit 1
fi

echo "Cloning workflow from $REPO..."
gh repo clone "$REPO" "$TMP_DIR" -- --depth=1 --quiet

echo "Syncing agents/, commands/, skills/, settings.json..."
rm -rf "$CLAUDE_DIR/agents" "$CLAUDE_DIR/commands" "$CLAUDE_DIR/skills"
cp -r "$TMP_DIR/agents"   "$CLAUDE_DIR/agents"
cp -r "$TMP_DIR/commands" "$CLAUDE_DIR/commands"
cp -r "$TMP_DIR/skills"   "$CLAUDE_DIR/skills"
cp    "$TMP_DIR/settings.json" "$CLAUDE_DIR/settings.json"

rm -rf "$TMP_DIR"
echo "Done. plans/, settings.local.json, and CLAUDE.md untouched."
