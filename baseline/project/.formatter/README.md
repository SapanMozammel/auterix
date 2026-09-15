# Formatter

A single-source-of-truth code formatter setup, checked in as regular project
content — Auterix's portable core doesn't select a formatter for you (see
`docs/architecture.md`), so this only exists once you choose to use it.

1. Edit `FORMATTER_CONFIG.md`.
2. `node .formatter/sync.cjs` — regenerates `.prettierrc.cjs` and
   `.prettierignore` at the project root.
3. `npm install -D prettier` and run it.

This is yours to edit or delete. Auterix never overwrites it after the first
install.
