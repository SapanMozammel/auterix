# Architecture — Data & Types

## src/data/content/

Static content files — imported directly by Server Components.

| File | Exports |
|---|---|
| `admin-dashboard.tsx` | `menuItems`, `inboxList` — Hero admin screen mock data (uses `.tsx` for JSX icons) |
| `blogs.ts` | `BLOG_POSTS`, `FEATURED_BLOGS`, `BLOGS_PER_PAGE`, `CATEGORY_COLORS`, `DEFAULT_CATEGORY_COLOR` |
| `experience.ts` | `EXPERIENCE_DATA` — work history array |
| `faq.ts` | `FAQ_DATA` — accordion items array |
| `portfolio.tsx` | `PORTFOLIO_PROJECTS` — project cards (uses `.tsx` for JSX icons) |
| `testimonials.ts` | `TESTIMONIAL_LIST` — testimonial items array |
| `workflow.ts` | `WORKFLOW_STEPS` — process steps array |

> `portfolio.tsx` uses `.tsx` extension because items include JSX (SVG icons inline). All others are `.ts`.

## src/data/config/

App-level configuration — imported by routing, i18n, and component logic.

| File | Exports |
|---|---|
| `languages.ts` | `LANGUAGES`, `LanguageCode`, `Language` — locale metadata (name, flag, RTL) |
| `technologies.ts` | `TECH_STACK` — tech stack grid items |

## src/types/

TypeScript type definitions — one file per domain. Single-consumer prop types are colocated with their component (kept inline as `type Props = { … }` next to the component that uses them); only types shared across multiple consumers, or that describe content/data shapes, live in `src/types/`.

| File | Types |
|---|---|
| `about.ts` | `QuickFact`, `EducationItem`, `LanguageLevel`, `LanguageItem`, `SkillGroup`, `Certification`, `SocialLink`, `AboutData`, `AboutTabId`, `AboutTab` |
| `blog.ts` | `ContentBlock`, `BlogPost`, `BlogCardProps` |
| `button.ts` | `BaseButtonProps`, `LinkButtonProps`, `RegularButtonProps`, `ButtonProps`, `ConnectButtonProps`, `GradientStop`, `SvgShapeProps`, `CenterSvgProps`, `ButtonContentProps`, `ButtonVariantConfig` |
| `contact.ts` | `ContactFormData`, `ContactFormErrors`, `ContactSubmitStatus`, `ContactFormProps` |
| `experience.ts` | `ExperienceType`, `ExperienceItem`, `TimelineItemProps`, `TimelineProps`, `TimelineProgressBarProps` |
| `faq.ts` | `FaqItem`, `AccordionItemProps`, `AccordionProps` |
| `graphql/` | Generated GraphQL document + result types (codegen output) |
| `i18n.ts` | `Locale`, `LocaleState` |
| `portfolio.ts` | `PortfolioProject`, `ProjectCardProps` |
| `stacking-cards.ts` | `UseStackingCardsOptions` |
| `technology.ts` | `TechStackItem`, `TechnologiesDisplayProps` |
| `testimonial.ts` | `TestimonialData` |
| `workflow.ts` | `WorkflowStep`, `WorkflowContentProps`, `WorkflowProgressProps` |

## src/lib/utils/

Pure utility functions.

| File | Exports |
|---|---|
| `index.ts` | `cn()` — clsx + extendTailwindMerge (with typography preset regex) |
| `image.ts` | `getBlurDataURL()` |

## Data Flow

```
src/data/ (static files)
  ↓ import
Server Component (reads data, no fetch needed)
  ↓ props
Child Components (receive data as typed props)
```

No `fetch()`, no API calls for static content — it's all imported directly.

## Rules

- Use `type` (never `interface`) for all type definitions
- No `any` types — TypeScript strict mode enforced
- `portfolio.tsx` is the only data file that may contain JSX — all others must be `.ts`
- New data files go in `src/data/content/` (changing content) or `src/data/config/` (app config)
- New type files go in `src/types/` only when shared across multiple consumers or describing content/data shapes; single-consumer prop types stay inline next to the component
- One file per domain, named after the domain

---

## See also

For GraphQL data fetching conventions (RSC vs Client decision, fragment colocation, codegen flow, auth boundary), see [`data-graphql.md`](./data-graphql.md).

### External reference

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/typescript/typescript-expert/`](../external/typescript/typescript-expert/) — deep TS problem-solving for complex data type modeling
- [`external/data/apollo-client/`](../external/data/apollo-client/) — Apollo Client 4.x patterns. **Load only when Apollo is in use** (file imports from `src/lib/apollo/`). Once a real query ships, this skill is the deep reference.
