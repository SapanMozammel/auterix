# Design System — Spacing & Layout

## Container Utilities

Define your project's container utilities:

```scss
.container        // mx-auto max-w-full px-6 md:max-w-[80%] md:px-0 2xl:max-w-[90rem]
.container-fluid  // mx-auto max-w-full px-6 md:px-10
```

## Section Spacing

Document standard section spacing patterns:

| Role | Classes |
|---|---|
| Section vertical padding (standard) | `pb-8 sm:pb-12 lg:pb-16` |
| Section title area padding | `py-6 sm:py-10` |
| Content gaps (standard) | `gap-4 sm:gap-5` |

Document any section-specific spacing exceptions here.

## Card & Component Padding

Document component-specific padding values:

| Context | Classes |
|---|---|
| Card body | `p-4 sm:p-6` |
| Form inputs | `px-3 py-2.5` |

## Responsive Breakpoints (Tailwind defaults)

| Token | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Intentional Viewport-Relative Values

Document any `vw`/`vh`-based values that are intentional and should not be flagged in audits (e.g. decorative watermarks, overlapping sections):

| Location | Value | Reason |
|---|---|---|
| _(add entries as needed)_ | | |

---

**Rules:**
- Always mobile-first — write the base (mobile) style first, then add `sm:` / `md:` / `lg:` overrides
- Never use arbitrary values for spacing when a Tailwind scale value exists
- Use `container` or `container-fluid` for section widths — never set `max-w-*` manually on sections

---

## See also (external reference)

project rules in this file are authoritative; external references are framework-level guidance — load when project rules don't cover the case.

- [`external/design/web-design-guidelines/`](../external/design/web-design-guidelines/) — spacing rhythm, density principles, responsive breakpoint conventions.
