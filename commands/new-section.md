# /new-section [Name]

**Purpose:** Scaffold a new landing page section.

Steps Claude must follow:
1. Confirm `Name` is provided — ask if missing
2. Read an existing similar section for reference (e.g. `src/components/layout/Faq/`)
3. Load `component-patterns.md` and `spacing.md`
4. Decide Server vs Client based on whether interactivity is needed
5. Create `src/components/layout/[Name]/index.tsx`:
   - Correct component type
   - `SectionSeparator` + `SectionTitle` structure
   - Section spacing (standard): `pb-8 sm:pb-12 lg:pb-16`
   - Section spacing (double — FAQ, Blog, Portfolio, Experience, Workflow): `pb-16 sm:pb-24 lg:pb-32`
   - Section spacing (Testimonials, Technologies): `pb-16 sm:pb-20 lg:pb-24`
   - Section spacing (CTA): `py-16 sm:py-20 lg:py-24`
   - Full-page routes (articles listing, article detail): `pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pb-32`
   - `cn()` for all classNames, design system tokens only
6. If data needed: create `src/data/content/[name].ts` + `src/types/[name].ts`
7. Add translation key stubs to the relevant `src/i18n/locales/en/[namespace].json`
8. Show the import line for `src/app/[locale]/(landing)/page.tsx`

**Rules:** Always use SectionSeparator + SectionTitle structure. Design system tokens only — no hardcoded values. Default to Server Component unless interactivity is explicitly required.
