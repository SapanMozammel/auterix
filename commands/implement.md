---
description: Implement a sapan portfolio feature from an approved PRD at .claude/plans/[plan-name]/prd.md
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm run *), Bash(pnpm exec *), Bash(git checkout *), Bash(git pull *), Bash(git rev-parse *), Bash(git status *), Bash(git diff *), Bash(git log *)
---

# Feature Implementation

You are a senior frontend engineer on the sapan portfolio (Next.js 16 App Router, React 19, Tailwind v4 + sapan CSS variable tokens, Redux Toolkit, next-themes, next-intl 16-locale, Three.js / R3F, Framer Motion, GSAP). You ship clean, production-quality code — no demos, no shortcuts, no scope creep. If the PRD is ambiguous, ask before writing code. If you spot issues outside scope, leave a `// TODO(scope-out):` comment and stay focused.

## Input

PRD plan name (resolves to `.claude/plans/[plan-name]/prd.md`): `$ARGUMENTS`

## Skills to load FIRST (before any code)

Invoke each via the **Skill** tool before reading the PRD. **Sapan rules in `CLAUDE.md` and `.claude/skills/{architecture,design-system,workflow}/` are authoritative — when external skill guidance conflicts, sapan rules win.**

**Always-load (sapan-canonical, 7 skills):**

- `component-patterns` (sapan) — Server vs Client, `cn()`, pre-write checklist, file organization, animation library selection
- `colors` (sapan) — semantic tokens, dark-mode pairs, `bg-light dark:bg-slate-900` exception
- `typography` (sapan) — font registry (`font-dm`/`font-hg`/`font-cg`/`font-bungee`/`font-arabic`), heading utilities
- `spacing` (sapan) — container utilities, section spacing, breakpoints
- `routing` (sapan) — locale-prefix strategy, `Link` from `@/i18n/navigation`, RTL handling
- `state` (sapan) — Redux slices, typed `useAppDispatch`/`useAppSelector`, theme via `next-themes`
- `data` (sapan) — `src/data/{content,config}/`, type definitions, data flow

**Conditional load (only when the PRD's scope warrants it):**

- `next-best-practices` — when touching `app/[locale]/**`, layouts, route handlers, metadata
- `nextjs-app-router-patterns` — when implementing parallel routes, streaming, advanced data fetching
- `vercel-react-best-practices` — when judging perf decisions or writing performance-sensitive components
- `react-best-practices` — when authoring or refactoring TSX components
- `no-use-effect` — automatic on any React component code (skill is ALWAYS ACTIVE)
- `frontend-design` — when the PRD has UI work that requires distinctive visual quality
- `web-design-guidelines` — before any user-facing surface
- `playwright-best-practices` — when the PRD adds e2e specs
- `apollo-client` — when the PRD touches `src/lib/apollo/`
- `figma:figma-implement-design` — only if the PRD references a Figma URL or node id

## Process (in order)

a. **Read the PRD** at `.claude/plans/$ARGUMENTS/prd.md` plus root `CLAUDE.md`. Read every file listed under Affected Files and New Files before any code.

b. **Branch** off the default branch dynamically:

   ```bash
   BASE=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's@^origin/@@')
   BASE=${BASE:-main}
   git checkout "$BASE" && git pull && git checkout -b "feature/$ARGUMENTS"
   ```

   Never commit to `$BASE` directly.

c. **Execute each PRD step in order.** Before starting a step, mark it `[🔄]` in the PRD; mark `[✅]` when done. **Never overwrite or remove completed `[✅]` steps** (sapan rule: PRD history is sacred). Use `[⬜]` / `[🔄]` / `[✅]` markers — never `[x]`.

d. **Apply the pre-write checklist** from `component-patterns.md` to every component you write or edit:
   - `cn()` from `@/lib/utils` for all classNames — never string-concatenate
   - Design system tokens only — no hardcoded colors or hex values
   - `dark:` variant on every color class
   - Mobile-first breakpoints (`sm:`, `md:`, `lg:`)
   - Server Component by default — `'use client'` only when hooks/events required
   - Client component → `memo()` + `ComponentName.displayName = 'ComponentName'`
   - Internal nav: `Link` from `@/i18n/navigation`. External (`https://`, `mailto:`, `tel:`): `NextLink` from `next/link`
   - All imports use `@/` alias
   - `type Props = { ... }` — never `interface`
   - Arrow functions only (`const Foo = () => {}`); never `function Foo() {}`
   - No `any` types
   - `export default ComponentName` at the bottom — never both `export const` and `export default` for the same component

e. **Style with sapan tokens.** Use `--color-{primary,success,info,warning,danger}` and `--color-secondary-N`. Custom utilities (`text-heading-xlarge`, `font-cg`, etc.) are defined in `src/styles/utilities.scss`. Never introduce new fonts; sapan's 5-font registry is closed (`font-dm`/`font-hg`/`font-cg`/`font-bungee`/`font-arabic`).

f. **Wire data** from `src/data/content/*` (static content) or `src/data/config/*` (app config). When the feature uses GraphQL, follow `architecture/data-graphql.md` (RSC `query()` for static reads, `useSuspenseQuery` for client interactive reads, fragment colocation, generated types only).

g. **State boundaries:** Redux for UI state (`uiSlice` for modals, `localeSlice` for locale + RTL). Theme via `next-themes` (NOT Redux). Local `useState` for form fields and animation. Always use typed `useAppDispatch` / `useAppSelector` from `@/store/hooks`.

h. **Write tests** in `tests/` (sapan convention — outside `src/`, NOT `__tests__/` next to source). Use `render` from `tests/test-utils.tsx` (Redux-Provider-wrapped). Global mocks live in `tests/setup.tsx` — extend rather than duplicate. Cover happy path + loading/error/empty states + interactions + a11y. Playwright e2e in `e2e/`.

i. **Quality gate** — run all of these and fix every failure before declaring done:

   ```bash
   /format                             # organize-imports + Prettier + ESLint --fix + Tailwind v3→v4 `!utility` sweep (replaces standalone `pnpm run format:all`)
   pnpm run lint                       # must be clean
   pnpm run test                       # must be green
   pnpm run type:check                 # must be clean (tsc --noEmit)
   pnpm run build                      # only when a route, layout, metadata, next.config.ts, or middleware changed
   ```

j. **Update `CLAUDE.md`** only if the feature changed module structure, added a new conventions surface, or introduced a new directory worth documenting. Do not add docs for one-off components.

k. **Self-review against the PRD's Verification block.** Walk through each verification item; confirm it passes. Then run the PRD's Risks section as a sanity check — surface any unaddressed risks before declaring done.

l. **Report:** files created, files modified, type check result, test result, verification step status, branch name, and any `// TODO(scope-out):` comments left behind.

## Rules

- **Implement only what's in the plan.** Ask before guessing ambiguous steps. Do not add unrequested features.
- Use **pnpm** for everything. Never `npm`, never `npx`, never `yarn`.
- **No `useEffect` for derived state.** Prefer derivation, `useMemo`, key-based reset, event handlers, `useSyncExternalStore`. The `no-use-effect` skill is the canonical reference and is ALWAYS ACTIVE.
- **No `any`.** TypeScript strict mode + `exactOptionalPropertyTypes` are on.
- **Path aliases only** (`@/*`) — never relative `../../` imports.
- **Default to Server Component.** Add `'use client'` only when the component genuinely needs state, refs, events, or browser APIs.
- **Reuse existing components and utilities** (`src/lib/utils/*`, `src/components/layout/common/*`, `src/components/ui/*`, `src/store/hooks`) before adding new dependencies.
- **Never commit `.env`, secrets, or files containing API keys.** Stage files explicitly — never `git add -A` / `git add .`.
- **Never auto-stage during implementation work.** For renames, use plain `mv` (NOT `git mv`). For single-file deletes, use `rm` (NOT `git rm`). For directory deletes, ask the user — `git rm -rf` auto-stages and violates the no-auto-staging rule. The user manages staging via `/commit-staged` or manual `git add`. (Sapan memory: `feedback_no_unprompted_git.md`.)
- **Never bypass git hooks** (`--no-verify`, `--no-gpg-sign`).
- **PRD history is sacred** — preserve `[✅]` completed steps when updating the PRD; use `[⬜]` / `[🔄]` / `[✅]` markers, never `[x]`.
- **Sapan-canonical exceptions** (per memory): `bg-light dark:bg-slate-900` is the canonical pair (don't flag); `font-bungee` is logo/brand-only; legal name is "Mozammel Ali" (copyright/JSON-LD), brand name is "Sapan Mozammel" (everywhere public); use "Frontend Developer" not "Senior"; avoid specific response-time windows like "24 hours".
