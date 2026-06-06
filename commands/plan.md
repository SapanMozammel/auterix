---
description: Plan a sapan feature with a PRD at .claude/plans/[kebab-name]/prd.md — explore code, load skills, write the plan. No code written.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash(git checkout *), Bash(git branch *), Bash(git status *), Bash(git rev-parse *)
---

# Feature Planning

You are a senior frontend architect on the sapan portfolio (Next.js 16 App Router, React 19, Tailwind v4 + sapan CSS variable tokens, Redux Toolkit, next-themes, next-intl 16-locale, Three.js / R3F, Framer Motion, GSAP). Given a feature description, produce a comprehensive PRD that an engineer can execute against without further clarification.

## Input

Feature description: `$ARGUMENTS`

## Skills to load FIRST (before reading any project files)

Invoke each via the **Skill** tool before exploring code. **Sapan rules in `CLAUDE.md` and `.claude/skills/{architecture,design-system,workflow}/` are authoritative — when external skill guidance conflicts, sapan rules win.**

**Always-load (sapan-canonical):**

- `component-patterns` (sapan) — Server vs Client decision, `cn()`, file organization, animation library matrix, pre-write checklist
- `feature-planning` (sapan, `workflow/feature-planning.md`) — sapan PRD format conventions

**Conditional load (only when the feature scope warrants it):**

- `colors` / `typography` / `spacing` (sapan) — when the feature has UI surfaces or token decisions
- `routing` (sapan) — when the feature adds routes, locale-prefix logic, or RTL surfaces
- `state` (sapan) — when the feature touches Redux, modals, or theme
- `data` (sapan) — when the feature adds new static content under `src/data/{content,config}/`
- `next-best-practices` — drives RSC vs client decisions, route handlers, metadata, image/font
- `nextjs-app-router-patterns` — when the feature uses parallel routes, streaming, advanced data fetching
- `react-best-practices` — when authoring new TSX components
- `no-use-effect` — automatic on any React work (skill is ALWAYS ACTIVE)
- `frontend-design` — when the feature has UI work that requires distinctive visual quality
- `web-design-guidelines` — required for the A11y / UX section
- `vercel-react-best-practices` — when judging perf decisions
- `apollo-client` — only when the feature touches `src/lib/apollo/`
- `playwright-best-practices` — when the feature adds e2e specs
- `figma:figma-implement-design` — only if a Figma URL or node id is supplied

## Process

1. **Restate the feature in one sentence.** If vague or ambiguous, ask to clarify before proceeding.

2. **Ask the user about branching:** "Should I create a new branch for this? (yes/no)" — if yes, suggest `feature/[kebab-feature-name]` and ask to confirm or rename. If yes, create the branch from the current branch before proceeding (use dynamic base detection: `git rev-parse --abbrev-ref origin/HEAD`).

3. **Read sapan context.** Root `CLAUDE.md` plus `.claude/skills/{architecture,design-system,workflow}/*.md` for any directories the feature will touch.

4. **Skim sibling PRDs in `.claude/plans/*/prd.md`** (active and historical) to reuse existing patterns and avoid conflicts.

5. **`Glob` + `Grep` the codebase** for related routes, components, slices, types, and data files. Note what can be reused or extended vs newly built. Never assume paths — verify.

6. **Read every affected file before proposing changes.**

7. **If a Figma URL or node id is supplied**, capture the design hand-off via `figma:figma-implement-design` skill (frame name, node id, mapped variables).

8. **Decide Server vs Client** for every new component with explicit reasoning per `component-patterns.md`. Default Server; opt to client only when hooks, events, refs, or browser APIs are needed.

9. **Write the PRD to `.claude/plans/[kebab-feature-name]/prd.md`** with the section structure below.

10. If a PRD at that path already exists, **preserve completed `[✅]` tasks** and append new steps; never overwrite history (sapan rule).

11. **Report:** feature (1 sentence), branch name (if created), affected files, new files, step count, plan path.

12. **Prompt:** "Ready? Run `/implement [plan-name]`"

## PRD Structure

Use exactly these sections in order (omit a section only if it has no content for the feature):

- **Feature** — title and one-sentence summary
- **Context** — what + why + who; links to related PRDs and sibling features
- **Adoption Brief** — what's adopted (components, deps, skills, agents, commands) and what's NOT adopted (with reasons)
- **Skill Dependencies** — which sapan architecture/workflow/design-system skills this feature inherits from (cite, don't duplicate); list the bridge skill if one is being authored
- **Architecture Strategy** — section per concern: data, state, routing, styling, accessibility
- **Component Type Decision** — for each new component: file path, RSC vs `'use client'`, where it lives. Per `component-patterns.md` File Organization (`src/components/layout/{SectionName}/`, `src/components/layout/common/`, `src/components/ui/`, `src/components/icons/`)
- **Data & Types** — static content under `src/data/{content,config}/`; types under `src/types/`. **When Apollo is in use** (`src/lib/apollo/operations/*.graphql`): name operations, fragment colocation, codegen flow.
- **Design System** — sapan tokens (`--color-{primary,success,info,warning,danger}`, `--color-secondary-N`); custom utilities (`text-heading-xlarge`, `font-cg`, etc.); font registry — never new fonts; `bg-light dark:bg-slate-900` is canonical (memory).
- **i18n** — translation keys per namespace (`common`/`navigation`/`home`/`blog`); locale-prefix routing (`as-needed`); RTL impact on `ar` (`dir="rtl"`); `Link` from `@/i18n/navigation` for internal nav
- **State** — Redux slices (`uiSlice` for UI state, `localeSlice` for locale + RTL); typed `useAppDispatch` / `useAppSelector` only; theme via `next-themes` (NOT Redux)
- **Accessibility** — WCAG 2.1 AA: keyboard nav, focus rings, ARIA roles/labels, color contrast, `motion-reduce:` variants, screen reader notes
- **Testing Strategy** — Vitest unit/component tests in `tests/` (sapan placement, NOT `__tests__/`); Playwright e2e in `e2e/`; coverage bar (render + loading/error/empty + interactions + URL/localStorage + motion-reduce + a11y)
- **Performance** — RSC streaming, `<Suspense>` fallbacks, `next/dynamic({ ssr: false })` for heavy modals/3D content, `next/image` `sizes` and `priority`, bundle deltas
- **SEO** — `metadata` or `generateMetadata` export per locale, JSON-LD if applicable, hreflang for 16 locales + `x-default`, sapan canonical: `legalName: "Mozammel Ali"` and brand `"Sapan Mozammel"`
- **Affected Files** — list every existing file that will be modified
- **New Files** — list every new file with one-line purpose
- **Implementation Steps** — numbered, grouped by phase, each `[⬜]` (use sapan markers `[⬜]/[🔄]/[✅]`, never `[x]`); preserve any existing `[✅]` if updating
- **Verification** — checklist the implementer self-reviews against before declaring done; include `pnpm run lint`, `pnpm run type:check`, `pnpm run test`, `pnpm run build` (when relevant)
- **Risks & Open Questions** — anything ambiguous; flag before implementation rather than guessing

## Rules

- **No code written during planning.** Only the PRD file.
- **No extra features.** Plan exactly the scope the user described; flag scope-creep candidates as Open Questions.
- **No new dependencies unless unavoidable.** Reuse existing components, utilities, and patterns first.
- **Sapan PRD path convention:** `.claude/plans/[kebab-feature-name]/prd.md`. Never `docs/prd/*` (that was R&D's path).
- **Markers are sacred:** use `[⬜]` for pending, `[🔄]` for in-progress, `[✅]` for completed. Never `[x]`.
- **PRD history is sacred:** when updating an existing PRD, preserve every `[✅]` step verbatim. Append new steps; never overwrite.
- **Sapan-canonical exceptions** (per memory): `bg-light dark:bg-slate-900` is the canonical pair (don't propose `bg-white dark:bg-zinc-900` unless the rule changes); `font-bungee` is logo/brand-only; legal name is "Mozammel Ali" (copyright/JSON-LD), brand name is "Sapan Mozammel" (everywhere public); use "Frontend Developer" not "Senior"; avoid specific response-time windows like "24 hours" in user copy.

## Notes

- This command supersedes the deprecated R&D `/feature` command (which wrote PRDs to `docs/prd/{feature-slug}.md`). Sapan path is `.claude/plans/[kebab-name]/prd.md` — the project standard.
- For trivial 1-line text changes, skip `/plan` and go direct to `/implement` (which does its own skill loading).
