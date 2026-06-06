# Design System — Spacing & Layout

## Container Utilities

```scss
.container        // mx-auto max-w-full px-6 md:max-w-[80%] md:px-0 2xl:max-w-[90rem]
.container-fluid  // mx-auto max-w-full px-6 md:px-10
```

- Use `.container` for all landing page sections
- Use `.container-fluid` for full-bleed sections that need more horizontal breathing room

## Section Spacing

| Role | Classes |
|---|---|
| Section vertical padding (standard) | `pb-8 sm:pb-12 lg:pb-16` |
| Section vertical padding (double — FAQ, Blog, Portfolio, Experience, Workflow) | `pb-16 sm:pb-24 lg:pb-32` |
| Section title area padding | `py-6 sm:py-10` |
| Content gaps (standard) | `gap-4 sm:gap-5` |
| Content gaps (Workflow, Testimonials) | `gap-8` |

### Section Spacing Exceptions

| Section | Classes |
|---|---|
| Testimonials | `pb-16 sm:pb-20 lg:pb-24` |
| Technologies | `pt-[20vw] pb-16 sm:pb-20 lg:pb-24` |
| CTA | `py-16 sm:py-20 lg:py-24` |
| Hero section (top offset for fixed header) | `pt-14 sm:pt-20` |
| Hero inner container | `pt-16 sm:pt-24 lg:pt-32` |
| Full-page routes (articles listing, article detail) | `pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pb-32` |

Every landing section wraps content in:
```tsx
<div className="container flex w-full grow flex-col">
```

Full-page routes use `<section>` directly with the SectionSeparator inside — no intermediate wrapper div.

## Layout — Fixed Elements

| Element | Classes |
|---|---|
| Header height | `h-14 sm:h-20` (fixed position) |
| Footer vertical padding | `py-4 sm:py-6` |

## Section Separator Utility

The `SectionSeparator` component uses:
```
absolute inset-x-3 inset-y-0 -z-10 md:inset-x-10
```

## Card & Component Padding

| Context | Classes | Notes |
|---|---|---|
| BlogCard body | `p-5` | |
| ProjectCard body | `p-4 sm:p-6 lg:p-8 xl:p-12` | |
| TimelineItem | `p-4 md:p-6` | |
| ContactModal | `p-6 sm:p-7` | |
| WorkflowCard | `p-6 md:p-8` | |
| ArticleDetail | `p-6 sm:p-8 lg:p-10` | |
| CTA hero card | `p-8 sm:p-12 lg:p-16` | |
| Article callout | `p-4 sm:p-5` | |
| Icon containers | `p-2` or `p-3` | |

## Form Inputs

| Element | Classes |
|---|---|
| Text inputs | `px-3 py-2.5` |

## Accordion Padding

| Element | Classes |
|---|---|
| Accordion trigger buttons | `px-5 py-4 lg:px-8 lg:py-5` |
| Accordion content panel | `px-5 lg:px-8 pb-4 lg:pb-5` |

## Navigation

| Element | Classes |
|---|---|
| Nav links | `px-2 lg:px-3 py-1.5` |

## Buttons

Handled by the Button component variants — do not add manual padding to buttons.

## Responsive Breakpoints (Tailwind defaults)

| Token | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Intentional Viewport-Relative Values

These arbitrary values are **not violations** — no Tailwind scale equivalent exists for viewport-relative spacing. Do not flag them in audits.

| Location | Value | Reason |
|---|---|---|
| `Hero/index.tsx` — AdminScreen wrapper | `-mb-[20vw]` | Visually overlaps admin screen into the Technologies section below |
| `Technologies/index.tsx` — section | `pt-[20vw]` | Compensates for the Hero AdminScreen negative margin overlap |
| `SectionTitle.tsx` — watermark `<span>` | `text-[12vw] sm:text-[10vw]` | Decorative watermark scales proportionally with viewport |
| `SectionTitle.tsx` — subtitle `<p>` | `pt-[10vw]` (with watermark) / `pt-[2vw]` (without) | Pushes subtitle below the absolute-positioned watermark |
| All admin dashboard components | `em`-based values throughout | Mock dashboard UI scales proportionally — all spacing relative to a root font-size |

---

**Rules:**
- Always mobile-first — write the base (mobile) style first, then add `sm:` / `md:` / `lg:` overrides
- Never use arbitrary values for spacing when a Tailwind scale value exists
- Use `container` or `container-fluid` for section widths — never set `max-w-*` manually on sections

---

## See also (external reference)

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/design/web-design-guidelines/`](../external/design/web-design-guidelines/) — spacing rhythm, density principles, responsive breakpoint conventions. Sapan's spacing scale and breakpoint set are closed; load for cross-cutting layout decisions, not for introducing new arbitrary spacing values.
