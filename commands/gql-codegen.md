---
description: Run GraphQL codegen and report type drift between .graphql operations and generated types
allowed-tools: Bash(pnpm gql:codegen*), Bash(pnpm exec graphql-codegen*), Bash(pnpm run type:check*), Bash(pnpm exec tsc*), Read
---

# GraphQL Codegen

Runs `pnpm gql:codegen` (which invokes `graphql-codegen --config codegen.ts`) then `pnpm run type:check`, surfacing any drift between `.graphql` operations and the generated types in `src/types/graphql/`. Run after writing or editing any `.graphql` file.

## Input

No arguments.

## Process

1. **Confirm a schema source exists.** Either `NEXT_PUBLIC_GRAPHQL_ENDPOINT` is set in the environment, or `schema.graphql` exists at the repo root. If neither, abort with: "No schema source — set `NEXT_PUBLIC_GRAPHQL_ENDPOINT` in `.env.local` or commit a `schema.graphql` file."

   ```bash
   [ -f schema.graphql ] || [ -n "$NEXT_PUBLIC_GRAPHQL_ENDPOINT" ] || echo "MISSING"
   ```

2. **Run codegen:**

   ```bash
   pnpm gql:codegen
   ```

   The script's exit code reflects schema/operation validity. Common failures:
   - Operation references a field that doesn't exist on the schema → fix the operation
   - Schema file malformed → fix the schema (or re-introspect when the endpoint is live)
   - No `.graphql` documents found → expected on the empty scaffold; codegen has `ignoreNoDocuments: true` so this is non-fatal

3. **Run type-check:**

   ```bash
   pnpm run type:check
   ```

   Generated types are written to `src/types/graphql/` (gitignored, regenerated on demand). Note: `src/types/graphql/` is excluded from `tsconfig.json` until a real operation lands — the empty `client-preset` stub trips `noUnusedLocals` (`import * as types` declared but unused). Once an operation references `types`, this exclusion can be lifted; track that in the first GraphQL feature PRD.

4. **Report drift.** If `pnpm run type:check` fails:
   - List `.tsx` / `.ts` files where types changed shape (compare error file paths against modified `.graphql` files)
   - For each: surface the column number + expected vs received types from the tsc output

5. **Exit non-zero** if codegen or type-check fails. Print a one-line summary on success: `codegen: ok · type-check: ok · operations: <count> · fragments: <count>`.

## Hard rules — DO NOT BREAK

- **Never edit files under `src/types/graphql/`** — they're regenerated. Edits will be wiped on the next codegen.
- **Never widen types or add `as any`** to silence drift errors. Fix the operation or the schema source.
- **Never commit `src/types/graphql/`** — it's gitignored. If it shows up in `git status`, the gitignore entry was deleted.
- **Never substitute `npm` or `npx` for `pnpm`** — sapan is pnpm-only.

## Notes

- Codegen config: `codegen.ts` at repo root. Schema source is `schema.graphql` (placeholder until the first GraphQL feature lands and the endpoint is decided).
- Output: `src/types/graphql/` with `client-preset` (typed `gql` document node + fragment masking).
- For end-to-end operation scaffolding (operation file → component → wired UI), use `/gql-add-query [feature description]` instead — it delegates to the `graphql-architect` agent.
