# Formatter Configuration

This is your project's single source of truth for code formatting. Edit the
values below, then run `node .formatter/sync.cjs` to regenerate `.prettierrc.cjs`
and `.prettierignore` at your project root. Never hand-edit those generated
files — they get overwritten every time you run the sync.

```config
# Basic Formatting
PRINT_WIDTH=100
INDENT_STYLE=space
INDENT_SIZE=2
USE_SINGLE_QUOTES=true
USE_SEMICOLONS=true
TRAILING_COMMA=all

# Advanced Formatting
BRACKET_SPACING=true
ARROW_PARENS=always
END_OF_LINE=lf
PROSE_WRAP=preserve

# File-Specific Overrides
JSON_TRAILING_COMMA=none
MARKDOWN_PROSE_WRAP=always
YAML_INDENT_SIZE=2

# Extra ignore patterns (comma-separated, appended to the generated
# .prettierignore in addition to the built-in safe defaults below)
EXTRA_IGNORE_PATTERNS=
```

## What ships in the built-in `.prettierignore`

`sync.cjs` always writes a **blacklist** (not a whitelist) — it excludes
known noise (`node_modules/`, build output, lockfiles, `.min.*`, logs, caches)
and otherwise formats everything. This matters: a whitelist-style ignore file
(`/*` + `!/src/`) silently breaks the moment your project has more than one
source root — e.g. a monorepo with `apps/*/src` and `packages/*/src` — because
`/src/` only unignores a root-level `src/` folder. If you've hit "File is
ignored, skipping" in your editor's Prettier extension for files that plainly
aren't build output, this is almost always why. Add repo-specific exclusions
via `EXTRA_IGNORE_PATTERNS` above rather than switching the strategy back to
a whitelist.

## Usage

```sh
node .formatter/sync.cjs   # generates .prettierrc.cjs + .prettierignore
npm install -D prettier    # if you don't already have it
npx prettier --write .
```

No framework, plugin, or package manager is assumed. Add
`prettier-plugin-tailwindcss`, `eslint-config-prettier`, or anything else your
stack needs — `sync.cjs` prints its next-steps output as plain text, it never
touches your `package.json`.
