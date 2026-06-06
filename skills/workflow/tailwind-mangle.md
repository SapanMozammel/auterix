---
name: tailwind-mangle
description: "Sapan's production-only Tailwind class mangler. Runs as a post-build pass over .next/ output (bundler-agnostic — works on Turbopack). Triggers when authoring or reviewing components that use `cn()`, when wiring deploy commands, when running `pnpm build:mangled` locally, or when interpreting a `tw-X` class in production support."
---

# Tailwind Class Mangling (sapan, post-build)

Sapan ships production builds with mangled Tailwind class names — `flex items-center px-4` becomes `tw-a tw-b tw-c` in the served HTML and CSS. The mangler is a Node script (`scripts/mangle.mjs`) that runs **after** `pnpm build` and rewrites `.next/` artifacts in place. It is bundler-agnostic and works on Turbopack (sapan's default).

## When mangling runs

| Command | Bundler | Mangled? |
|---|---|---|
| `pnpm dev` | Turbopack | No — DevTools shows readable Tailwind classes |
| `pnpm build` | Turbopack | No — fast staging build |
| `pnpm build:mangled` | Turbopack + post-build script | **Yes** |
| `pnpm mangle` | n/a (post-build only) | Yes (re-mangles existing `.next/`) |
| Vercel deploy | Set via `vercel.json` `buildCommand` to `pnpm build:mangled` | Yes |

## Pipeline

```
pnpm build           → Turbopack emits .next/
  ↓
node scripts/mangle.mjs
  ↓ Pass 1: discover Tailwind CSS chunks (those containing @layer)
  ↓ Pass 1: extract candidate class selectors from those CSS files
  ↓ Pass 1: extract statically-used class tokens from HTML class="…" attrs
  ↓         and JS / RSC className:"…" / "className":"…" string literals
  ↓ Pass 1: scan JS chunks for classList.{add,remove,toggle,replace}("X")
  ↓         — every captured X is added to the reserve list
  ↓
  ↓ Mapping = (CSS classes ∩ static-use tokens) − reserve-list
  ↓ Sequential alphabetical assignment: tw-a, tw-b, …, tw-z, tw-aa, tw-ab, …
  ↓ Mapping written to .tw-patch/class-list.json (gitignored)
  ↓
  ↓ Pass 2: rewrite Tailwind CSS selectors (longest-first to avoid prefix collisions)
  ↓ Pass 2: rewrite HTML class attributes (token-by-token)
  ↓ Pass 2: rewrite JS / RSC className string literals (token-by-token)
```

The intersection-with-static-use filter naturally excludes Tailwind-generated CSS rules that aren't actually used in any rendered output, AND classes added at runtime via `classList.*` (which auto-populate the reserve list).

## Constraints when authoring components

These follow from the post-build extraction model — anything dynamic that doesn't appear as a literal string in the SSR'd HTML or compiled JS chunk silently fails to mangle, then ships broken.

- **All className composition via `cn()` from `@/lib/utils`.** Never template literals like `` className={`flex ${x}`} ``, never string concatenation (`'flex ' + variant`), never conditional outside `cn()` (`cond ? 'flex' : 'block'`).
- **Static class strings only.** `cn('p-4')` and `cn(conditionMap[key])` where keys are static strings are fine. `cn(\`p-${n}\`)` and `cn(apiResponse.className)` are not.
- **Runtime DOM class manipulation is auto-handled.** If you call `el.classList.add('foo')`, the mangler scans the emitted JS and adds `foo` to the reserve list automatically. No manual reserve registration needed.
- **Variants pass through.** `dark:`, `rtl:`, `sm:`/`md:`/`lg:`, `motion-reduce:`, `motion-safe:`, `before:`/`after:`, etc. are all part of the class identity. Each `variant:base` combo gets its own `tw-X` slot, distinct from the unprefixed base. Compound variants like `dark:before:bg-success` work the same way.
- **Custom `@utility` classes get mangled too.** `text-heading-xlarge`, `text-paragraph-medium`, `font-cg`, `glow-blob-primary` — all auto-discovered from emitted CSS.

## What's reserved

Built-in seed: `dark`, `light` (next-themes default strategy classes — runtime-set via `classList`).

Auto-detected per build: every literal argument passed to `classList.{add,remove,toggle,replace}("…")` anywhere in the emitted JS. Sapan's current reserve list (auto-detected as of 2026-05-03) includes:

- `dark`, `light` — next-themes
- `font-arabic`, `font-dm` — locale-driven body font swap
- `bg-primary`, `bg-secondary-300` — runtime-set color toggles
- `block-interactivity-`, `allow-interactivity-` — R3F interactivity prefixes

If you add a new `classList.add("X")` call in any future PR, `X` is automatically reserved on the next mangled build.

## Mapping file lifecycle

- Path: `.tw-patch/class-list.json`
- Format: flat object — `{ "originalClass": "mangledName", … }`
- Gitignored. Regenerated on every `pnpm mangle` run.
- CI uploads as artifact for production-support reverse lookup.

## Reverse lookup ("what was `tw-abc`?")

Open `.tw-patch/class-list.json` (or the CI artifact for the affected build), find the entry whose value is `tw-abc`, read its key. Example:

```json
{
  "dark:bg-black": "tw-fw",
  "flex": "tw-jt",
  "text-primary": "tw-vt"
}
```

`tw-vt` → `text-primary`.

## Why post-build, not a webpack/Turbopack plugin

Earlier drafts of this integration tried `unplugin-tailwindcss-mangle` wired into webpack via `next build --webpack`. That approach hit four blockers (Turbopack lock-out, RSC `next-flight-client-entry-loader` crash, SCSS extraction issue, custom `@utility` discovery gap). The post-build script sidesteps all four by operating on emitted artifacts only — bundler-agnostic, no upstream dependency, no plugin hook integration.

Trade-off: source maps for class-name positions are invalidated in the mangled bundle. Source maps for application logic remain intact. In practice this means DevTools' "view original" jump for a specific class doesn't resolve to a meaningful source location, but you can still reverse-look up the original class name from the mapping JSON.

## Pre-flight check

Before running `pnpm build:mangled`, invoke the `tailwind-class-reviewer` agent to scan source for mangle-incompatible patterns. It catches the four common failure modes (template-literal className, string concat, conditional outside `cn()`, variable-as-className without `cn()` wrapping).

## See also

- `architecture/component-patterns.md` — the `cn()` mandate sapan-wide.
- `design-system/typography.md` — custom `@utility` classes (`text-heading-xlarge`, `font-cg`) get mangled in prod.
- `workflow/tailwind-v4-syntax.md` — important modifier `h-9!` (suffix) interacts cleanly with mangling.
- `workflow/tailwind-diagnostics.md` — v3 alias names (`flex-shrink-0`, `bg-opacity-*`, etc.) are NOT emitted by v4's generator and therefore silently drop out of the mangler. Run `/fix-tw-diagnostics` before `pnpm build:mangled` to ensure every class in source has a canonical CSS counterpart.
