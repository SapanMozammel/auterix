# Design System — Colors

## Semantic Color Tokens (always prefer these)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#4a4ded` | Light-mode accent: text, bg, border, ring, fill, shadow, gradients, CTA rays |
| `--color-success` | `#43ead4` | Dark-mode accent (mirrors primary): text, bg, border, ring, fill, shadow, gradients |
| `--color-info` | `#1f8fff` | Hero radial glow, brand gradient end, SVG strokes/fills, admin dashboard borders/bg/shadows |
| `--color-warning` | `#ff6f00` | Warning states, article callout variants, code block dots |
| `--color-danger` | `#f56565` | Form validation errors (text + border), error icon bg |
| `--color-white` | `#ffffff` | Light-mode text on accent, bg surfaces, ring, overlay glass |
| `--color-black` | `#0e0c15` | Dark-mode bg surfaces, shadow colors, image overlays |
| `--color-light` | `#ecf1f4` | Light-mode surface buttons, contact modal bg, dark hamburger lines |
| `--color-dark` | `#0e0e2c` | Light-mode primary text/headings, dark-mode contact modal bg, tooltips text |

## Secondary Scale (neutral grays)

`--color-secondary` (#f1f5f9) through `--color-secondary-900` (#0f172a)
Key stops: `100` `200` `300` `400` `500` `600` `700` `800` `900`

## Primitive Palettes

22 families: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose — each with shades 25–950 + a100.

**Rules:**
- Semantic tokens first. Fall back to primitives only when semantic tokens don't fit.
- `bg-light` always pairs with `dark:bg-slate-900` — this is an intentional design rule, not a violation.

---

## Dark Mode

- Controlled via `next-themes` with class strategy (`.dark` on `<html>`)
- Custom variant: `@custom-variant dark (&:where(.dark, .dark *));`
- Pattern: always write light-mode default, then `dark:` override

### Core Swap Pattern
```
text-primary dark:text-success
bg-primary/10 dark:bg-success/10
border-primary dark:border-success
```

---

## Dark Mode Pairs

### Backgrounds

| Light | Dark | Context |
|---|---|---|
| `bg-white` | `dark:bg-black` | Page body, cards, blog cards, containers, workflow, popover |
| `bg-white/95` | `dark:bg-black/95` | Mobile nav sheet with backdrop-blur |
| `bg-white/50` | `dark:bg-black/50` | Testimonial cards, sheet overlay, About screen availability pill / tech chips |
| `bg-white/30` | `dark:bg-black/30` | About screen panel cards, chips, PhotoCard inner frame |
| `bg-secondary` | `dark:bg-secondary-900` | Accordion items |
| `bg-secondary` | `dark:bg-dark` | Contact modal |
| `bg-light` | `dark:bg-slate-900` | Hamburger button, social link buttons, sheet base |
| `bg-light/70` | `dark:bg-slate-900/70` | Hero decorative circles |
| `bg-light/20` | `dark:bg-slate-900/20` | Admin screen container |
| `bg-light/10` | `dark:bg-slate-900/10` | Admin travel card |
| `bg-black` | `dark:bg-white` | Hamburger lines |
| `bg-secondary-600/5` | `dark:bg-secondary-400/5` | Nav icon wraps (inactive) |
| `bg-secondary-100` | `dark:bg-secondary-800` | Tags, chips, category default, timeline progress track |
| `bg-secondary-200` | `dark:bg-secondary-700` | Workflow progress track, article dot separators |
| `bg-secondary-300` | `dark:bg-secondary-700` | Timeline dots (inactive) |
| `bg-primary` | `dark:bg-success` | Active states, progress bar, availability dot, tooltips |
| `bg-primary/80` | `dark:bg-success/80` | Cursor tooltip, project card badge |
| `bg-primary/10` | `dark:bg-success/10` | Soft accent fills, icon containers, switchers |
| `bg-primary/5` | `dark:bg-success/5` | Nav active, workflow icon outer |
| `bg-danger` | `dark:bg-success` | Testimonial decorative blur |
| `bg-{color}-50` | `dark:bg-{color}-950` | Blog category badges (sky, blue, violet, green, orange, cyan) |
| `bg-{color}-25/90` | `dark:bg-{color}-a100/90` | Portfolio card backgrounds |
| `bg-info/30` | — | Admin dashboard buttons, avatars, email cards (same both modes) |
| `bg-info/5`, `bg-warning/5`, `bg-success/5` | — | Article callout backgrounds (same both modes) |
| `before:bg-primary` | `dark:before:bg-success` | Article list bullet dots, accordion toggle line |
| `after:bg-primary` | `dark:after:bg-success` | Accordion toggle line |
| `bg-secondary-800` | — | Code block header (both modes, no swap) |
| `bg-secondary-900` | — | Code block body (both modes, no swap) |

### Text

| Light | Dark | Context |
|---|---|---|
| `text-dark` | `dark:text-white` | Headings, section titles, card titles, icons |
| `text-white` | `dark:text-dark` | On accent backgrounds, tooltips, badges |
| `text-primary` | `dark:text-success` | Accent text, active nav, icons, links, progress, stars |
| `text-primary/50` | `dark:text-success/50` | Subtle accent numbering (mobile nav) |
| `text-secondary-100/50` | `dark:text-secondary-800/50` | Watermark text (SectionTitle) |
| `text-secondary-400` | `dark:text-secondary-600` | Muted meta: nav numbering, timestamps |
| `text-secondary-500` | `dark:text-secondary-500` | Mid-tone: labels, form labels, subtitles |
| `text-secondary-600` | `dark:text-secondary-400` | Body text: descriptions, FAQ, excerpts, footer, nav inactive |
| `text-secondary-700` | `dark:text-secondary-300` | Rich text: article paragraphs, list items |
| `text-{color}-700` | `dark:text-{color}-300` | Blog category badge text |
| `text-info`, `text-warning`, `text-success` | — | Article callout labels (same both modes) |
| `placeholder:text-secondary-600/50` | `dark:placeholder:text-secondary-400/50` | Form input placeholders |

### Hover

| Light | Dark | Context |
|---|---|---|
| `hover:bg-secondary/50` | `dark:hover:bg-secondary-900/50` | Nav item backgrounds |
| `hover:bg-primary` | `dark:hover:bg-success` | Social link buttons (footer) |
| `hover:text-primary` | `dark:hover:text-success` | Nav links, interactive text |
| `hover:text-dark` | `dark:hover:text-white` | Neutral hover text |
| `hover:border-primary` | `dark:hover:border-success` | Pagination, interactive borders |
| `hover:border-secondary-400` | `dark:hover:border-secondary-600` | Category filter borders |
| `group-hover:bg-secondary-200` | `dark:group-hover:bg-secondary-700` | Grouped hover fills |
| `group-hover:text-primary` | `dark:group-hover:text-success` | Grouped hover accent text |
| `group-hover:text-white` | `dark:group-hover:text-dark` | Social icon hover on accent bg |

### Borders

| Light | Dark | Context |
|---|---|---|
| `border-secondary-100` | `dark:border-secondary-800` | Inner dividers |
| `border-secondary-200` | `dark:border-secondary-700` | Dividers, sheet/panel borders, form inputs |
| `border-secondary-200/50` | `dark:border-secondary-700/50` | Cards, containers |
| `border-secondary-100` | `dark:border-secondary-800` | Timeline dots (inactive) |
| `border-secondary-300` | `dark:border-secondary-700` | Pagination, interactive |
| `border-indigo-100` | `dark:border-teal-900` | Timeline dots (active, set via JS classList) |
| `border-secondary-400` | `dark:border-secondary-600` | Section lines, header, footer |
| `border-primary` | `dark:border-success` | Accent borders, tooltips |
| `border-primary/10` | `dark:border-success/10` | Subtle accent containers |
| `border-primary/50` | `dark:border-success/50` | Icon containers |
| `border-danger` | `dark:border-danger` | Form validation error (same both modes) |
| `border-{color}-100` | `dark:border-{color}-900` | Portfolio card borders |
| `border-info/20` | — | Admin travel card outer border |
| `border-info/30` | — | Admin dashboard panels, dividers, inputs |
| `border-info/50` | — | Admin decorative circles, performance ring |
| `border-info/50`, `border-warning/50`, `border-success/50` | — | Article callout borders (same both modes) |
| `focus:border-primary` | `dark:focus:border-success` | Form input focus state |
| `divide-secondary-400` | `dark:divide-secondary-600` | Popover/switcher section dividers |

### Shadows

| Light | Dark | Context |
|---|---|---|
| `shadow-black/5` | `dark:shadow-white/5` | Cards, containers, Project cards, Tech grid, article cards |
| `shadow-primary/10` | `dark:shadow-success/10` | Workflow accent |
| `shadow-info/10` | — | Admin screen container (same both modes) |

### Rings

| Light | Dark | Context |
|---|---|---|
| `ring-white` | `dark:ring-black` | Timeline dots |
|`ring-secondary-200/50` | `dark:ring-secondary-700/50` | Accordion active border ring (dark only) |

### Misc

| Light | Dark | Context |
|---|---|---|
| `opacity-5` | `dark:opacity-15` | Noise texture overlay |
| `brightness-5` | `dark:invert` | Tech logo images |
| `disabled:brightness-90` | `dark:disabled:brightness-90` | Button disabled state (dark only) |

---

## Gradients

### Brand Text Gradient (Logo/Header/Footer)
```
from-primary to-info dark:from-success
bg-gradient-to-r bg-clip-text text-transparent
```

### Hero Heading Gradient (radial)
```
dark:via-light bg-radial from-slate-400 via-slate-900 via-45% to-slate-600 to-75% dark:from-slate-600 dark:to-slate-400
```

### Background Gradient (Tech grid items)
```
bg-gradient-to-b from-secondary-200/50 to-secondary/50
dark:from-secondary-700/50 dark:to-secondary-900/50
```

### Hero Background Radial (decorative)
```
bg-radial from-info/50 via-info/15 via-40% to-transparent to-60%
```

### CTA Rays (dark section — no dark: variants needed)
```
bg-gradient-to-b from-primary/20 to-transparent   (solid rays)
bg-gradient-to-b from-primary/5 to-transparent     (blurred rays)
bg-gradient-to-b from-primary/10 to-transparent    (top overlay)
```

### Admin Sidebar Active (Hero dashboard)
```
from-info/30 bg-gradient-to-r to-transparent
rtl:from-transparent rtl:to-info/30
```

### Image Overlay Gradient (fixed, both modes)
```
bg-gradient-to-t from-black/30 to-transparent              (blog card)
bg-gradient-to-t from-black/60 via-black/10 to-transparent (article hero)
```

### SVG Gradient (TextUnderline, Logo)
Stops: `--color-info` → `--color-success`

---

## Fills & Strokes

| Light | Dark | Context |
|---|---|---|
| `fill-dark` | `dark:fill-white` | Button SVG paths |
| `stroke-dark` | `dark:stroke-white` | Button SVG paths |
| `group-hover/button:fill-primary` | `dark:group-hover/button:fill-success` | Button SVG hover |
| `group-hover/button:stroke-primary` | `dark:group-hover/button:stroke-success` | Button SVG hover |
| `group-disabled/button:fill-secondary-300` | — | Button SVG disabled state |
| `group-disabled/button:stroke-secondary-300` | — | Button SVG disabled state |
| `fill-none` | — | Button SVG outline paths |
| `fill-primary` | `dark:fill-success` | Tooltip arrow |
| `fill-secondary-100/50` | `dark:fill-secondary-800/50` | World map background (Hero) |
| `fill-info/80` | — | Performance circle text (both modes) |
| `stroke-info` | — | Performance circle ring (both modes) |

---

## See also (external reference)

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/design/web-design-guidelines/`](../external/design/web-design-guidelines/) — a11y contrast standards (WCAG 2.1 AA), color-only state communication rules. Load before judging Priority 1 (a11y) findings on token-related changes.
