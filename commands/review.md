---
description: Review staged or recent sapan changes for security, a11y, hydration, performance, effects/state, and sapan code conventions. Auto-writes a follow-up PRD on Critical/Warning findings.
allowed-tools: Read, Grep, Glob, Bash(git diff*), Bash(git diff --cached*), Bash(git log*), Bash(git status*), Bash(git rev-parse*), Bash(pnpm run lint*), Bash(pnpm run test*), Bash(pnpm run type:check*)
---

# Code Review

Review the current sapan portfolio changes for quality, security, a11y, and convention compliance.

## Input

Scope (optional): `$ARGUMENTS`

- **No argument** → review staged changes (`git diff --cached`); if empty, fall back to working tree (`git diff`)
- **A file path** (e.g. `src/components/layout/Hero/index.tsx`) → review that file as a single-scope target
- **A glob pattern** (e.g. `src/components/layout/**/index.tsx`) → review all matching files
- **A commit hash or branch ref** → review that commit's diff (`git show $ARGUMENTS`) or `git diff $ARGUMENTS`

## Skills to load FIRST (before the gate or diff)

Invoke each via the **Skill** tool. **Sapan rules in `CLAUDE.md` and `.claude/skills/{architecture,design-system,workflow}/` override external skill guidance on conflict.**

- `react-best-practices` — React quality checklist for TSX files (component structure, hooks, a11y, perf, TS).
- `vercel-react-best-practices` — load before judging Priority 4 (Performance).
- `next-best-practices` — load before judging Priority 2 (Hydration & RSC).
- `web-design-guidelines` — load before judging Priority 1 (Security & A11y).
- `no-use-effect` — load before judging Priority 5 (Effects & State).
- `apollo-client` — load **only** when reviewing files that import from `src/lib/apollo/`. Rules apply only when Apollo is in use.

## Flags

Parse `$ARGUMENTS` for these flags (remove them before using the rest as scope):

- `--skip-build` — skip the lint + type-check gate (use only for doc-only diffs)
- `--skip-tests` — skip the test gate (use only for doc-only diffs)

## Pre-Review (Quality Gate)

Run BEFORE reading the diff. Stop and surface failures immediately — no review of broken trees.

```bash
# Lint + types (skip if --skip-build)
pnpm run lint
pnpm run type:check

# Tests (skip if --skip-tests)
pnpm run test
```

Then identify changed files:

```bash
git diff --cached --name-only   # or git diff --name-only when nothing staged
git diff --cached                # full patch for review
```

## Checklist

Apply checks **only to changed code**. Report issues only when >80% confident. Do not flag style preferences that Prettier/ESLint already handle.

### Priority 1: Security & Accessibility (Critical)

- `dangerouslySetInnerHTML` with unsanitized user input → XSS
- External `<a>` missing `rel="noopener noreferrer"` when `target="_blank"`
- `next/image` missing `alt` (decorative needs `alt=""`, never absent)
- Icon-only buttons missing `aria-label` / accessible name
- Color-only state communication (no text/icon fallback)
- Modals/dropdowns without focus trap or `Escape` handler
- Interactive surfaces (custom buttons, cards) without keyboard handlers (`onKeyDown` Enter/Space)
- Hardcoded secrets, API keys, tokens

### Priority 2: Hydration & RSC Boundaries (Critical / Warning)

- `'use client'` only where it's actually needed (hooks, browser APIs, event handlers)
- RSC files importing `useState` / `useEffect` / `useRef` / `next/navigation`'s client hooks (must be client)
- Top-level `localStorage` / `window` / `document` access in client components without a mount guard
- DOM-mutating libs (lightboxes, react-modal portals) without `next/dynamic` + `ssr: false`
- Server / Client mismatch — values that differ between SSR and first client render (`Date.now()`, `Math.random()`, locale)
- `next/dynamic` with `ssr: false` used inside an RSC (only valid in client components)
- Client component importing a Server Component (forbidden direction)

### Priority 3: Data Layer (Critical / Warning)

**Sapan is static-content first.** Static data lives in `src/data/{content,config}/` and is imported directly by Server Components. Data-layer rules below apply ONLY to files that import from `src/lib/apollo/` (Apollo is foundation-only — no endpoint set until a real query lands).

When Apollo IS in use:

- `useQuery` / `useSuspenseQuery` should generally be the choice; `useQuery` requires explicit `loading` and `error` handling before reading `data`
- `useMutation` without `onError` (sapan should add a generic `onError` helper once the first mutation lands)
- Inline `gql` template literals in components — operations live in `src/lib/apollo/operations/*.graphql` and are imported via codegen-generated documents
- Hand-typed query results — use generated types from `src/types/graphql/`, never hand-roll
- Reactive variables and `@client` directives — **forbidden** (Redux owns UI state; Apollo owns remote data)
- `useEffect` wrapping any Apollo hook — Apollo manages its own lifecycle

When Apollo is NOT in use: skip P3 entirely. Static-data routes in `src/data/{content,config}/` are correct by design.

### Priority 4: Performance (Warning)

- Raw `<img>` instead of `next/image`; missing `sizes` on responsive images; missing `priority` on LCP image
- Heavy modals / lightboxes / chart libs / 3D content not loaded via `next/dynamic`
- Animations without `motion-safe:` / `prefers-reduced-motion` gate
- Missing Suspense boundary around RSC data dependency that streams
- List rendering without stable `key` (array index for dynamic lists is a bug)
- Three.js / R3F components rendered eagerly when offscreen (should pause via `IntersectionObserver`)
- Unbounded GraphQL queries (when Apollo is in use) — no `first` / pagination on potentially large lists

### Priority 5: Effects & State (Warning)

- `useEffect` for derived state — sapan rule: **no-direct-useEffect** — prefer derivation, `useMemo`, event handlers, key-based reset, `useSyncExternalStore`
- Missing or excess deps in remaining effects
- Cleanup function missing for subscriptions, listeners, intervals, timeouts, GSAP contexts
- `useMemo` / `useCallback` overused (no dep on heavy compute) or underused (passed to memoized children)
- Local state (`useState`) holding values that belong in Redux — `isContactModalOpen` belongs in `uiSlice`; `currentLocale` / `isRTL` belong in `localeSlice`
- Raw `useDispatch()` / `useSelector()` instead of typed `useAppDispatch()` / `useAppSelector()` from `@/store/hooks`
- Theme stored in Redux instead of `next-themes` (theme is `next-themes`'s responsibility — `.dark` class on `<html>`)

### Priority 6: Conventions & Readability (Suggestion / Warning)

**Sapan-canonical rules** (per `CLAUDE.md` Code Conventions + sapan skills):

- Relative imports (`../../`) instead of `@/` path alias
- `any` type, `// @ts-ignore`, `// @ts-nocheck` introduced in new code (strict mode forbids)
- `interface` keyword used for props or type definitions — sapan uses `type` only
- `function Foo() {}` declaration — sapan uses arrow functions only (`const Foo = () => {}`)
- String concatenation or template literals for className composition — must use `cn()` from `@/lib/utils`
- Hardcoded hex colors / arbitrary CSS values (`#4a4ded`, `[16px]`) — must use sapan tokens (`text-primary`, `p-4`)
- Hardcoded color values that duplicate sapan tokens (`bg-[#ffffff]` → `bg-white`)
- Inline `style={{}}` for static values — prefer Tailwind utilities or `@utility` SCSS classes
- Both `export const Foo` AND `export default Foo` for the same component — sapan rule: one or the other (`export default` at the bottom)
- `font-bungee` outside `Logo.tsx` or brand watermarks — sapan rule: logo/watermark only
- Font classes outside sapan registry (`font-sans`, `font-serif`, `font-mono`) — sapan rule: use only `font-dm` / `font-hg` / `font-cg` / `font-bungee` / `font-arabic`
- Internal navigation using `next/link` directly instead of `Link` from `@/i18n/navigation` (locale-aware)
- External navigation (`https://`, `mailto:`, `tel:`) using `Link` from `@/i18n/navigation` instead of `NextLink` from `next/link`
- "Senior" or seniority claims in user-facing copy — sapan memory: use "Frontend Developer", never "Senior" (overclaiming breaks trust)
- Specific response-time windows ("24 hours", "within X days") in user copy — sapan memory: use "as soon as possible"
- Legal vs brand name confusion: `legalName` JSON-LD field and copyright must say "Mozammel Ali"; everywhere else (UI, navigation, branding) is "Sapan Mozammel"
- Testimonial copy framing — sapan memory: peer/collaborator voice only; never "hired", "brought on", "first hire"
- Module structure changed but `CLAUDE.md` / `docs/DEVELOPMENT_GUIDE.md` not updated
- Vitest test missing for new logic (sapan tests live in `tests/` outside `src/`, NOT `__tests__/` next to source)
- PRD update overwriting `[✅]` history — sapan rule: PRD history is sacred, preserve completed steps
- `[x]` markers used in PRD checklists — sapan rule: use `[⬜]` / `[🔄]` / `[✅]` only

## What NOT to Flag

- **`bg-light dark:bg-slate-900` pairing** — sapan-canonical pair (memory rule); never flag as "color tokens don't match"
- **Formatting issues** — Prettier handles via PostToolUse hook in `.claude/settings.json`
- **Pre-existing issues in untouched files** unless they pose a critical security risk
- **Stylistic preferences** with no rule backing
- **Adding type hints to code outside the diff** (scope creep)
- **<80% confidence findings** (better to under-flag than over-flag)
- **Intentional viewport-relative values** in known locations per `design-system/spacing.md` (Hero `-mb-[20vw]`, Technologies `pt-[20vw]`, SectionTitle watermark sizes, admin dashboard `em` values)
- **`font-bungee` in `Logo.tsx` or brand watermark contexts** — that IS the allowed use
- **Apollo P3 rules on non-Apollo files** — gate by `import` statements pointing at `@/lib/apollo/`

## Output Format

Group findings by file, ordered by severity (Critical → Warning → Suggestion):

```
### `src/components/layout/Hero/index.tsx`

- **Line 42** | **Critical** | Icon-only `<button>` missing `aria-label`
  **Fix:** Add `aria-label="Close menu"` (or similar descriptive text); the icon child does not provide an accessible name.

- **Line 67** | **Warning** | `useEffect` derives `displayName` from `firstName + lastName`
  **Fix:** Derive directly: `const displayName = firstName + ' ' + lastName` — no effect needed.
```

## Verdict

End every review with one of:

| Verdict | Criteria |
|---|---|
| **APPROVE** | No Critical or Warning issues found |
| **APPROVE WITH WARNINGS** | Warning issues exist but non-blocking — list them |
| **REQUEST CHANGES** | Any Critical issue, or multiple Warnings that compound |

### Summary Table

```
| Severity   | Count |
|------------|-------|
| Critical   | 0     |
| Warning    | 0     |
| Suggestion | 0     |

**Verdict: APPROVE**
```

## Auto-PRD-on-violations (sapan memory rule — NOT opt-in)

When the review finds **any Critical or Warning** issues, write or update a follow-up PRD at `.claude/plans/[scope-slug]-review/prd.md` so the user can run `/implement [scope-slug]-review` to apply fixes.

**Slug derivation:**

- File-scoped review (`$ARGUMENTS = <path>`) → kebab-case from the file path (e.g., `src/components/layout/Hero/index.tsx` → `hero-component-review`)
- Diff-scoped review (default) → kebab-case from the feature/branch name (e.g., a diff on `feature/contact-form-redesign` → `contact-form-redesign-review`)
- Multi-file review with no obvious feature → `code-review-{YYYY-MM-DD}` (today's date)

**PRD structure:**

- Standard sapan PRD layout: Context, Affected Files, Implementation Steps, Verification, Risks
- Each violation is a separate `[⬜] Step N: <fix description>` entry under Implementation Steps
- Severity prefixes the step description: `[Critical]` or `[Warning]`
- Quote the original line + the suggested fix verbatim
- **Preserve `[✅]` markers** if the PRD already exists — never overwrite completed history
- End with a Verification block listing the items to re-check after fixes ship

**Final prompt to user:** "Ready? Run `/implement [scope-slug]-review`"

This behavior carries over from the deprecated `/audit` command per sapan's memory rule — *"Always create/update PRD after audit if violations found, never skip"* — and is **not optional**. The `code-reviewer` agent enforces the same policy.
