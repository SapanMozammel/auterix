---
description: Create a pull request with structured body, quality gate, auto-detected change categories, and a suggested merge-commit message
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git rev-parse:*), Bash(git branch:*), Bash(git push:*), Bash(git fetch:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(pnpm run lint:*), Bash(pnpm run test:*), Bash(pnpm run build:*), Bash(pnpm run type:check:*), Read, Grep, Glob
---

# Pull Request

## Input

Optional target branch and flags: `$ARGUMENTS`

Default base: dynamically detected via `git rev-parse --abbrev-ref origin/HEAD` (sapan currently uses `main`).

## Flags

Parse `$ARGUMENTS`, strip flags, treat the remainder as the target branch:

- `--skip-tests` — skip Vitest (doc-only PRs only)
- `--skip-build` — skip the `pnpm run build` smoke (doc-only PRs only)

## Process

1. **Detect base branch + branch state.**

   ```bash
   BASE=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's@^origin/@@')
   BASE=${BASE:-main}                                                # fallback if origin/HEAD unset
   CURRENT=$(git branch --show-current)
   # If $ARGUMENTS specifies a target (e.g. "dev"), override BASE
   ```

   - Confirm `CURRENT` is not `$BASE`.
   - `git status` must be clean (no uncommitted changes — prompt to `/commit` first).
   - `git fetch origin` then verify `CURRENT` is up to date with its upstream. If unpushed commits remain, run `/push` first or push as part of step 7.
   - Confirm there are commits beyond the base: `git log "$BASE..HEAD" --oneline` must be non-empty.

2. **Quality gate** — run in this order, stop on first failure:

   ```bash
   pnpm run lint
   pnpm run test            # skip iff --skip-tests
   pnpm run type:check
   ```

   Plus, conditionally:

   ```bash
   pnpm run build           # if app/**, src/app/**, next.config.ts, src/proxy.ts, or .env* changed (skip iff --skip-build)
   ```

   Decide whether build is needed by checking `git diff --name-only "$BASE...HEAD"` against those paths.

3. **Gather full-branch diff** (NOT just the last commit):

   ```bash
   git diff "$BASE...HEAD"
   git log "$BASE..HEAD" --reverse --pretty=format:"- %s"
   git diff --name-only "$BASE...HEAD"
   ```

4. **Auto-detect categories** from the changed-file list:

   - **Components**: any path under `src/components/**`
   - **Routes added**: new `src/app/**/page.tsx`, `src/app/**/layout.tsx`, `src/app/**/route.ts`
   - **Tests added**: new files in `tests/**` or `e2e/**`
   - **Docs touched**: `CLAUDE.md`, `docs/**`, `.claude/plans/**/prd.md`, top-level `*.md`
   - **i18n**: `src/i18n/**`, translation `*.json` files
   - **Styling/tokens**: `tailwind.config.ts` (when present), `src/styles/**`, `src/app/fonts.ts`
   - **State**: `src/store/**`, `src/providers/**`, `src/hooks/**`
   - **GraphQL operations** (when Apollo is in use): new or changed `*.graphql` files in `src/lib/apollo/**`; flag breaking field renames or schema changes
   - **Config/infra**: `next.config.ts`, `src/proxy.ts`, `tsconfig.json`, `package.json`, `pnpm-lock.yaml`, `eslint.config.mjs`, `.github/**`
   - **Data**: `src/data/{content,config}/**`

5. **Draft PR body** using exactly these sections (omit a section only if it has no content):

   ```md
   ## Summary
   - <1–3 bullets — the why, not the what>

   ## UI / UX Changes
   - <visible behavior or layout changes>
   - Figma: <node id or URL — only if referenced in the diff or commit messages>

   ## Routing & Layout Changes
   - <new routes, layout/provider changes, locale-prefix updates>

   ## i18n
   - <translation keys added/changed; locales touched; RTL impact>

   ## State & Data
   - <Redux slices, hooks, static data files>

   ## GraphQL Changes
   - <when Apollo is in use: new typed operations, schema fields touched, breaking renames; otherwise omit>

   ## Tests Added
   - <Vitest unit/component (`tests/**`) and Playwright e2e (`e2e/**`) — list files>

   ## Docs Updated
   - <CLAUDE.md / docs/ / .claude/plans/*/prd.md / inline JSDoc>

   ## Test Plan
   - [ ] <reviewer-runnable verification step>
   - [ ] <visual check at mobile / tablet / desktop if UI>
   - [ ] <i18n check on `/ar` (RTL) if i18n touched>
   - [ ] <theme toggle (light/dark) if tokens or color classes touched>

   ## Risks / Rollback
   - Risk: <what could break in prod>
   - Rollback: <revert this PR / revert specific commits / unset feature flag>
   ```

6. **Title** — under 70 chars, conventional prefix matching the dominant change type:
   - `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`
   - Title says the headline; the body holds the detail. Don't pack the title with scope soup.

7. **Push and create PR.**

   ```bash
   # Push with -u if no upstream yet
   git push -u origin "$CURRENT"

   gh pr create \
     --base "$BASE" \
     --title "<short title>" \
     --body "$(cat <<'EOF'
   ## Summary
   ...
   EOF
   )"
   ```

   Target branch: use `$ARGUMENTS` value if provided (e.g. `dev`, `staging`), otherwise `$BASE`.

8. **Print the PR URL** returned by `gh pr create`.

9. **Suggest a merge-commit message** for when the PR is merged. Default to squash-merge style (matches sapan's one-commit-per-release convention on `main`). Provide:

   - **Title** (under 72 chars, ending with ` (#<PR number>)` — what GitHub appends on squash):
     - If the PR is a release (bumps `package.json` version + has a CHANGELOG-equivalent entry), use `chore: release vX.Y.Z — <short descriptor> (#N)`
     - Otherwise use the dominant commit `<type>` from the PR commits and a descriptive one-liner
   - **Body** (2–4 sentences): the "why" summarized from the PR body. Name the specific problem solved or capability added; avoid restating bullets verbatim.
   - **Alternative** (one line): a tighter title-only option for users who prefer minimal messages, OR a note about non-squash merge if history preservation matters.

   Present all three together at the end of the report, clearly labeled.

## Hard rules — DO NOT BREAK

- **Default base is detected dynamically** via `git rev-parse --abbrev-ref origin/HEAD` (sapan currently `main`). Override only via `$ARGUMENTS`.
- **Never skip the quality gate silently.** `--skip-tests` / `--skip-build` are doc-only escape hatches — verify the diff actually matches docs-only scope before honoring them.
- **Never `--no-verify`** on the push that precedes the PR.
- **Never force-push** as part of `/pr`. If the branch needs a force update, the user does it explicitly.
- Always diff against the **base branch tip**, not just `HEAD~1`. Single-commit branches and 12-commit branches both need the full picture.
- **The suggested merge message is advisory** — do NOT merge the PR yourself; the user decides when and how to merge.

## Notes

- This project uses **pnpm**. Never substitute `npm` / `npx` / `yarn`.
- TypeScript strict mode + `exactOptionalPropertyTypes` are on; `pnpm run type:check` is the canonical type check.
- Prettier runs via the PostToolUse hook in `.claude/settings.json` and via `/format` (or `pnpm run format:all` directly) — no separate command in the PR gate. Prefer `/format` when the diff touches `className` strings or `@apply` directives — it adds the Tailwind v3→v4 `!utility` sweep on top of the standard format pipeline.
- **GraphQL section is included only when Apollo is in use** — i.e., when files under `src/lib/apollo/**` changed. Skip the section otherwise (sapan is static-content first; Apollo is foundation-only with no endpoint set).
