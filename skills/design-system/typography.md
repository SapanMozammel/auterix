# Design System — Typography

## Font Families

Define your project's font registry here. Example structure:

| Class | Font | Weight | Use for |
|---|---|---|---|
| `font-sans` | (your body font) | 400 | Body copy, UI labels, default text |
| `font-display` | (your display font) | 500, 700 | Headings, section titles |
| `font-mono` | (your mono font) | 400 | Code blocks |

**Rules:**
- Never inherit font silently — always apply an explicit font class
- Never introduce new font families — use only the registered fonts above
- Document which weights each font supports (avoids invisible issues from unsupported weights)

## Role Assignments

| UI Element | Font class |
|---|---|
| Page body, paragraphs, labels | `font-sans` |
| Headings, section titles | `font-display` |
| Code | `font-mono` |

## Typography Utility Classes

If your project defines custom `@utility` blocks in SCSS that bundle font family + size + weight + line-height, document them here. Use these instead of repeating inline class blobs.

### Heading Utilities

| Class | Composition |
|---|---|
| `text-heading-xlarge` | `(your composition)` |
| `text-heading-large` | `(your composition)` |

### Body Utilities

| Class | Composition |
|---|---|
| `text-paragraph-medium` | `(your composition)` |

## Text Sizing Scale (mobile-first)

| Role | Classes |
|---|---|
| Body | `text-sm sm:text-base` |
| Subtitles / meta | `text-xs sm:text-sm` |
| Section titles | `text-2xl sm:text-3xl lg:text-5xl` |

Always use mobile-first breakpoints (`sm:`, `md:`, `lg:`) — no bare large sizes without a smaller default.

---

## See also (external reference)

project rules in this file are authoritative; external references are framework-level guidance — load when project rules don't cover the case.

- [`external/design/frontend-design/`](../external/design/frontend-design/) — production-grade visual quality, type-pairing patterns. Project's font registry is closed; load for general typography principles, not for adding fonts.
