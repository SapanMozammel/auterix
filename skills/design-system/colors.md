# Design System — Colors

## Semantic Color Tokens (always prefer these)

Define your project's semantic color tokens here. Example structure:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#...` | Primary accent: text, bg, border, ring, fill, shadow, gradients, CTA |
| `--color-success` | `#...` | Success state / dark-mode accent |
| `--color-info` | `#...` | Informational states, secondary accents |
| `--color-warning` | `#...` | Warning states |
| `--color-danger` | `#...` | Error/destructive states |

## Neutral / Secondary Scale

Define your neutral palette (e.g. slate-100 through slate-900, or a custom scale).

## Dark Mode

- Controlled via `next-themes` with class strategy (`.dark` on `<html>`)
- Pattern: always write light-mode default, then `dark:` override

### Core Swap Pattern

Document your light↔dark color pairings:

```
text-primary dark:text-success
bg-primary/10 dark:bg-success/10
border-primary dark:border-success
```

---

## Dark Mode Pairs

Document intentional light/dark pairs for common contexts (backgrounds, text, borders, shadows, etc.) so reviewers know what's expected vs. what's a bug.

---

## Gradients

Document named gradient patterns your project uses.

---

## See also (external reference)

project rules in this file are authoritative; external references are framework-level guidance — load when project rules don't cover the case.

- [`external/design/web-design-guidelines/`](../external/design/web-design-guidelines/) — a11y contrast standards (WCAG 2.1 AA), color-only state communication rules.
