# Design System — Typography

## Font Families

| Class | Font | Weight | Use for |
|---|---|---|---|
| `font-dm` | DM Sans | 400 | Body copy, UI labels, default text |
| `font-hg` | Hanken Grotesk | 500, 700 | Nav, buttons, badges, hero subtext |
| `font-cg` | Cormorant Garamond | 500 | Section titles, CTAs, display headings |
| `font-bungee` | Bungee | 400 | Logo + brand watermark only |
| `font-arabic` | Noto Sans Arabic | 400 | RTL content (Arabic locale only) |

**Rules:**
- Never inherit font silently — always apply an explicit font class
- Never introduce new font families — use only the five above
- `font-bungee` is logo/brand only
- DM Sans has only weight 400 — never use `font-light` (300) with `font-dm`
- Hanken Grotesk has weights 500 and 700 only — never use `font-semibold` (600) with `font-hg`
- Cormorant Garamond has only weight 500 — never use `font-bold` (700) with `font-cg`

## Role Assignments

| UI Element | Font class |
|---|---|
| Page body, paragraphs, labels | `font-dm` |
| Navigation links | `font-hg` |
| Buttons, badges, chips | `font-hg` |
| Section titles (`SectionTitle title`) | `font-cg` |
| CTAs, display headings | `font-cg` |
| SectionTitle watermark | `font-cg` (low opacity) |
| Logo, brand mark | `font-bungee` |
| Arabic locale text | `font-arabic` |

## Typography Utility Classes

Custom `@utility` blocks in `src/styles/utilities.scss` bundle font family + size + weight + line-height into single classes. Use these instead of repeating inline class blobs.

### Heading Utilities

| Class | Composition |
|---|---|
| `text-heading-xlarge` | `font-hg text-3xl font-bold sm:text-4xl lg:text-5xl` |
| `text-heading-large` | `font-cg text-2xl font-medium sm:text-3xl lg:text-5xl` |
| `text-heading-medium` | `font-cg text-2xl font-medium sm:text-3xl lg:text-4xl` |
| `text-heading-medium-alt` | `font-hg text-xl font-medium sm:text-2xl lg:text-3xl` |
| `text-heading-small` | `font-hg text-base font-medium sm:text-lg` |
| `text-heading-small-alt` | `font-hg text-sm font-medium sm:text-base` |
| `text-heading-xsmall` | `font-hg text-xs font-bold sm:text-sm` |

### Body Utilities

| Class | Composition |
|---|---|
| `text-paragraph-medium` | `font-dm text-sm font-normal sm:text-base` |
| `text-paragraph-small` | `font-dm text-xs font-normal sm:text-sm` |

### tailwind-merge Integration

`cn()` in `src/lib/utils/index.ts` uses `extendTailwindMerge` with a regex (`/^(heading|paragraph)-/`) to register these under the font-size theme group — prevents tailwind-merge from misclassifying them as text-color and stripping them inside `cn()`.

## Text Sizing Scale (mobile-first)

| Role | Classes |
|---|---|
| Body | `text-sm sm:text-base` |
| Subtitles / meta | `text-xs sm:text-sm` |
| Section titles | `text-2xl sm:text-3xl lg:text-5xl` |
| Hero headings | `text-xl sm:text-4xl lg:text-5xl` |
| Watermarks | `text-5xl sm:text-7xl` |

Always use mobile-first breakpoints (`sm:`, `md:`, `lg:`) — no bare large sizes without a smaller default.

---

## See also

- [`workflow/tailwind-mangle.md`](../workflow/tailwind-mangle.md) — sapan's custom `@utility` classes (`text-heading-xlarge`, `text-paragraph-medium`, `font-cg`, etc.) get mangled to `tw-X` in production. The mangler auto-discovers them from emitted CSS — no special registration. Note: `font-dm` and `font-arabic` are runtime-toggled on `<body>` via `classList.toggle`, so they are auto-reserved by the mangler and keep their original names.

## See also (external reference)

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/design/frontend-design/`](../external/design/frontend-design/) — production-grade visual quality, anti-generic-AI aesthetics, type-pairing patterns. Sapan's font registry (`font-dm`/`font-hg`/`font-cg`/`font-bungee`/`font-arabic`) is closed; load this skill for general typography principles, not for adding fonts.
