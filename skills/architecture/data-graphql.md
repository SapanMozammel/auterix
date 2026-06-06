# Architecture — GraphQL Data (Apollo Client 4.x)

Sapan's Apollo Client conventions. Apollo runs **alongside** Redux: Redux owns UI state, Apollo owns remote data + its cache. The runtime is wired in `src/lib/apollo/`; this skill is the convention layer that sits on top.

This skill is a thin extension of sapan's architecture skills. It cites and links — it does NOT duplicate component-pattern, state, or no-effect rules.

## Required reading first

Before authoring any GraphQL operation or component, read these sapan skills (authoritative — sapan rules win when external Apollo guidance conflicts):

- [`component-patterns.md`](./component-patterns.md) — Server-component-default rule, RSC vs Client decision tree, arrow functions, `type` over `interface`, `cn()`, `export default` at bottom
- [`data.md`](./data.md) — when to keep static (`src/data/content/*`) vs go remote
- [`state.md`](./state.md) — Redux ownership of UI state; do not introduce reactive variables or `@client` directives
- [`routing.md`](./routing.md) — locale-aware fetching with next-intl
- [`../workflow/no-use-effect.md`](../workflow/no-use-effect.md) — Apollo hooks own their own lifecycle; never wrap them in `useEffect`
- [`../workflow/testing.md`](../workflow/testing.md) — Vitest + RTL conventions for any Apollo test
- [`../design-system/colors.md`](../design-system/colors.md), [`typography.md`](../design-system/typography.md), [`spacing.md`](../design-system/spacing.md) — token-only when scaffolding loading skeletons or any visible UI

If any of those change, reread before authoring Apollo code. This skill extends them — it does not stand alone.

## 1. When to reach for Apollo

Defer to [`data.md`](./data.md) for the static-vs-remote choice. Apollo only enters once you've decided remote.

- Static content (blogs list snapshot, portfolio metadata, FAQ) → `src/data/content/*` import — no Apollo
- Live, schema-shaped data (Hashnode posts, GitHub repo stats, custom CMS) → Apollo
- Fire-and-forget REST mutations with no caching benefit (contact form via Resend) → REST in `src/app/api/*` — not Apollo

## 2. RSC vs Client decision tree

Anchored to [`component-patterns.md`](./component-patterns.md)'s server-default rule. The same decision applies to Apollo operations:

| Use | When |
|---|---|
| RSC `query()` from `@/lib/apollo/client` | Static read per page load (blog list, profile data, public schema) — default |
| Client `useSuspenseQuery` | Interactive read (filters, infinite scroll, mutations affecting visible state) — default for client |
| Client `useQuery` | Polling, optional-with-fallback, or when `useSuspenseQuery` is genuinely wrong |

RSC `query()` is preferred whenever the data is read-once-per-render. It eliminates the round-trip and lets the React tree stream.

## 3. Redux/Apollo state boundary

Anchored to [`state.md`](./state.md).

- **Redux** owns UI state (`uiSlice`, `localeSlice`)
- **Apollo** owns remote data + its cache
- **Reactive variables** are NOT used (Redux already owns the surface)
- **`@client` directives / Apollo Local State** are NOT used (same reason)

If you find yourself wanting to put a UI flag in Apollo's cache, stop and put it in `uiSlice` instead.

## 4. i18n boundary

Anchored to [`routing.md`](./routing.md).

- RSC `query()` calls inside `[locale]` segments must accept `params.locale` if the data is locale-scoped — pass it through to the operation as a variable
- Client queries inside locale-aware components read locale from `useLocale()` (next-intl) — never hand-build it from URL parts
- Translation keys (UI copy) are never fetched via GraphQL — they live in `src/i18n/locales/*`

## 5. Auth boundary

| Env var | Visibility | Read by |
|---|---|---|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | Browser-visible (URL only) | Both `createServerLinks()` and `createClientLinks()` |
| `GRAPHQL_AUTH_TOKEN` | Server-only — **never** prefix with `NEXT_PUBLIC_` | Only `createServerLinks()` (via the `SetContextLink`) |

If a feature needs authenticated data:

1. Fetch via RSC `query()` — server-only
2. Pass the resolved data to client components as props

A client-side authenticated query is forbidden. The `graphql-architect` agent refuses to scaffold one.

## 6. Operation file conventions

- Operations: `src/lib/apollo/operations/*.graphql` initially. Migrate next to the consuming component (component-colocated `.graphql` next to the `.tsx`) when the operation has a single consumer.
- **Named operations only** — no anonymous `query { ... }`. Always `query GetPosts(...) { ... }`.
- One operation per file unless the operations are tightly related.
- Component file conventions still follow [`component-patterns.md`](./component-patterns.md): arrow functions, `type` not `interface`, `export default` at bottom.

## 7. Fragment colocation

- Fragments: `src/lib/apollo/fragments/*.graphql` initially. Move next to the consuming component when used.
- **"Fragments are for colocation, not reuse"** — Apollo skill ground rule. If a fragment is used by N components, ask whether N is real reuse or a missing parent component.

## 8. Data masking

`dataMasking: true` is set on every `ApolloClient` instance (server in `src/lib/apollo/client.ts`, browser in `src/lib/apollo/provider.tsx`). The convention test in `tests/apollo.test.tsx` asserts it stays enabled. **Never disable it** — masking ensures parent components can't accidentally read fragment-scoped fields.

## 9. No-useEffect rule

Anchored to [`../workflow/no-use-effect.md`](../workflow/no-use-effect.md).

Apollo hooks (`useQuery`, `useSuspenseQuery`, `useMutation`) own their own lifecycle. **Never wrap them in `useEffect`.** If you think you need to, you almost certainly want to:

- Read the cache directly via `useFragment` or `client.cache.readQuery`
- Pass variables that change derivatively
- Use a Suspense boundary instead of an effect-driven loading flag

## 10. Loading and error states

- `useSuspenseQuery` → defers to the parent Suspense boundary; the parent renders `loading.tsx` or a custom fallback
- `useQuery` → MUST handle `loading` + `error` branches before reading `data`
- Loading skeletons use design-system tokens — see [`../design-system/spacing.md`](../design-system/spacing.md) and [`../design-system/colors.md`](../design-system/colors.md)

## 11. Codegen flow

- Run `pnpm gql:codegen` (or `/gql-codegen`) after writing or changing any `.graphql` file
- Generated output lives in `src/types/graphql/` (gitignored, regenerated on demand)
- CI will run codegen before `pnpm type:check` once a real GraphQL feature ships — until then the placeholder `schema.graphql` keeps the toolchain valid

## 12. Testing

Anchored to [`../workflow/testing.md`](../workflow/testing.md).

- Vitest + RTL with `MockedProvider` from `@apollo/client/testing` for component tests
- Playwright `mockGraphQL` fixture in `e2e/fixtures.ts` — intercept the endpoint URL via `page.route()` with deterministic JSON responses
- Same network-mock discipline as Resend / Turnstile — never hit a real GraphQL endpoint in CI

## 13. Slash commands and agent

- `/gql-codegen` — runs codegen + type-check, surfaces drift
- `/gql-add-query [feature description]` — delegates to the `graphql-architect` agent
- `graphql-architect` agent — designs and scaffolds GraphQL operations end-to-end; reads this skill first, sapan architecture skills second, external Apollo skill last

## 14. See also

- External: [`../external/data/apollo-client/`](../external/data/apollo-client/) — Apollographql's general Apollo Client 4.x patterns (cache, fragments, RSC, testing, mutations, troubleshooting). Lower priority than sapan rules — load when this bridge skill doesn't cover the case.

---

**Anti-rule reminder.** This skill extends sapan conventions; it must not duplicate them. If you see component-pattern, state, or no-effect rules restated here, collapse the duplication and link to the source.
