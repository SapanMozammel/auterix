# /review-i18n

**Purpose:** Deep audit of internationalization coverage — produce two PRDs: (1) hardcoded user-facing strings that should be translated, (2) translated values that should NOT be (proper nouns, tech names, broken placeholders).

Steps Claude must follow:

1. **Load the skill**: `.claude/skills/workflow/i18n-audit.md` — it defines what counts as translatable, intentional hardcoded exceptions, namespace conventions, and verification commands.

2. **Spawn two parallel Explore agents** (single message, multiple tool calls):

   **Agent A — hardcoded UI strings**
   Scope: `src/app/` and `src/components/`. Inspect JSX text, `aria-label`, `placeholder`, `alt`, `title`, and default prop values. Exclude everything imported from `src/data/` and the intentional hardcodes listed in the skill. For each finding: `file:line` — exact string — suggested key path (prefer reusing existing keys in the baseline locale namespace files).

   **Agent B — over-translation check**
   Scope: all locale JSON files. Verify: tech names intact, ICU placeholders (`{name}`, etc.) intact, key parity against baseline locale, no untranslated-but-should-be values, no over-translated proper nouns.

3. **Run the orphan-key scan** (Node snippet from the skill under "Orphan-key detection"). This finds keys that exist in the baseline locale files but are never referenced from any translation call-site in `src/`. These are dead translation data — must land in PRD 3.

4. **Verify each flagged file + each orphan candidate**: read the flagged lines and grep for the orphan key literal yourself before trusting results. Orphan detection has false-positive risk (dynamic key lookups); confirm by reading the translator callers in the same file.

5. **Write PRD 1** to `.claude/plans/missing-translations-audit/prd.md`:
   - Summary (count of findings + files affected)
   - Numbered violations grouped by area (Contact, Articles, Error, etc.)
   - Each task marked `[🔄]`
   - Explicit "Out of scope" list (prior user directives like watermarks, theme names, dates, etc.)
   - Affected files list
   - Verification section (type:check, test, parity check, browser smoke)

6. **Write PRD 2** to `.claude/plans/over-translation-audit/prd.md`:
   - If zero violations: short clean-audit record listing the verification criteria and bash snippets for future regression checks
   - If violations found: per-locale table of `locale/file.json`, key path, current value, expected value, with `[🔄]` fix tasks
   - Intentional English-only values list (watermarks, brand names, theme tokens)

7. **Write PRD 3** to `.claude/plans/orphan-translation-keys-audit/prd.md`:
   - If zero orphans: short clean-audit record stating no dead keys, with the detection command for future regression.
   - If orphans found: list every unused key path from the baseline locale, with `[🔄]` tasks to remove the key from all locale files.
   - Include verification (re-run parity + orphan detection after removal).

8. **Report**: total findings per PRD, all three paths, and the `/implement` command(s) to run next.

**Rules:**
- Never translate values listed under "Intentional hardcoded" in the skill — flagging them is a false positive.
- Preserve PRD history — never overwrite existing completed tasks (`[✅]`). If a PRD already exists, append a new "Round N" section.
- Do NOT apply fixes. This command produces PRDs only. Fixes land via `/implement [audit-name]`.
- Always use the 2-parallel-agent pattern plus the orphan-key scan — a single agent misses cross-file over-translation issues and neither agent catches unused keys.
