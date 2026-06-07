# /translate [locale?]

**Purpose:** Translate i18n message files across all locales (or one specific locale) in parallel using subagents.

Steps Claude must follow:
1. If `$ARGUMENTS` is a locale code (e.g. `fr`, `ar`): translate only that locale
2. If `$ARGUMENTS` is empty: translate all supported locales in parallel (read locale list from `architecture/routing.md`)
3. Read all files in the baseline locale directory (e.g. `src/i18n/locales/en/`) as the source of truth
4. For each target locale, spawn a **parallel subagent** with:
   - The full baseline locale namespace files
   - The existing target locale files (to preserve already-translated keys)
   - The locale name and RTL flag (check `architecture/routing.md` for RTL locales)
   - Instruction: translate only keys missing or marked as stale; do not overwrite existing translations
5. Each subagent writes its output to `src/i18n/locales/[locale]/[namespace].json`
6. After all subagents complete, report: locales updated, keys added per locale, any failures

**Rules:**
- Never translate proper nouns: site name, technology names, company names
- Preserve all interpolation placeholders exactly: `{name}`, `{count}`, etc.
- Arabic (`ar`): right-to-left, use formal Modern Standard Arabic
- For locales with regional variants (`zh-CN`, `pt-BR`): use the specified regional form
