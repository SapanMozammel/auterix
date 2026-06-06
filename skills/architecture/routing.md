# Architecture — Routing & i18n

## Route Structure

| URL | File | Type | Component |
|---|---|---|---|
| `/` | `src/app/[locale]/(landing)/page.tsx` | Home (no URL segment) | Server |
| `/articles` | `src/app/[locale]/articles/page.tsx` | Articles listing (pagination + category filter) | Client |
| `/articles/[slug]` | `src/app/[locale]/articles/[slug]/page.tsx` | Article detail | Server |

## Layout Hierarchy

```
src/app/layout.tsx              # Root — <html lang dir>/<body> with fonts, getLocale() for
                                #   dynamic locale/RTL, global.scss import
src/app/[locale]/layout.tsx     # Locale — NextIntlClientProvider, Providers (Redux + Theme),
                                #   Header, main, Footer, noise overlay, metadata
src/app/[locale]/(landing)/page.tsx
```

- Root layout owns `<html>` and `<body>` (Next.js 16 requires this). It calls `getLocale()` from `next-intl/server` to set `lang` and `dir` dynamically per request, applies the font variables, and toggles the Arabic font class for RTL locales.
- Locale layout owns app structure: `NextIntlClientProvider`, `Providers` (Redux + Theme), Header, `<main>`, Footer, noise overlay, and exports the page metadata.

## i18n — next-intl v4

**16 locales:** `en` (default) · `fr` · `de` · `es` · `ar` · `zh-CN` · `pt-BR` · `ja` · `nl` · `it` · `ru` · `hi` · `no` · `tr` · `ko` · `bn`

**Prefix strategy:** `localePrefix: 'as-needed'`
- English → no prefix: `sapan.dev/`
- All others → prefixed: `sapan.dev/fr/`, `sapan.dev/ar/`

**Translation file structure:**
```
src/i18n/locales/
├── en/                     # Baseline — always complete
│   ├── common.json
│   ├── navigation.json
│   ├── home.json
│   └── blog.json
└── [fr|de|es|ar|...]/      # Partial — missing keys fall back to en
```

**4 namespaces:** `common` · `navigation` · `home` · `blog`

**Locale detection priority:**
1. URL segment (e.g. `/fr/`)
2. `localStorage` key `preferred-language`
3. `Accept-Language` header
4. Falls back to `en`

**Graceful fallback:** Missing namespace files in non-English locales fall back to English automatically.

## Navigation Imports

**Always** import from `@/i18n/navigation` — **never** from `next/navigation`:

```tsx
// ✓ internal routes — locale-aware
import { Link, useRouter, usePathname } from '@/i18n/navigation'

// ✓ external links (https://, mailto:, tel:) — no locale prefix needed
import NextLink from 'next/link'

// ✓ both can coexist — for components with mixed links (e.g. Button with dynamic `to` prop)
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'

const isExternal = to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')
const LinkComponent = isExternal ? NextLink : Link

// ✗ wrong — unaliased next/link for internal routes
import Link from 'next/link'
```

## RTL Support (Arabic)

- `src/app/layout.tsx` (root layout) sets `dir="rtl"` when locale is `ar` — it calls `getLocale()` from `next-intl/server` and checks against `RTL_LOCALES`
- Use `rtl:` Tailwind variant for RTL-specific overrides in components:

```tsx
<div className="ml-4 rtl:ml-0 rtl:mr-4">
```

## Root Not-Found Exception

`src/app/not-found.tsx` renders **outside** the locale layout — it has no `NextIntlClientProvider`. Any component that internally uses next-intl's `Link` (including `Button` with a `to` prop) will throw:

```
No intl context found. Have you configured the provider?
```

In `src/app/not-found.tsx`, use `NextLink from 'next/link'` directly for any links:

```tsx
import Link from 'next/link'

<Link href='/' className='...'>Go back home</Link>
```

The locale-level `src/app/[locale]/not-found.tsx` is fine — it renders inside `NextIntlClientProvider` and can use `Button` with `to` or `Link` from `@/i18n/navigation` normally.

## Static Generation

All routes use `generateStaticParams()` to pre-render all locale variants at build time:

```tsx
export const generateStaticParams = () =>
  locales.map((locale) => ({ locale }))
```

---

## See also

For locale-aware spec patterns (sample-locale parameterization, `<html lang>` / `<html dir>` assertions, switcher persistence), see [`../workflow/e2e.md`](../workflow/e2e.md).

### External reference

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/nextjs/nextjs-app-router-patterns/`](../external/nextjs/nextjs-app-router-patterns/) — advanced patterns (parallel routes, intercepting routes, advanced data fetching)
