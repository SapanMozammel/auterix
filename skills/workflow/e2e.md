---
name: e2e
description: "Sapan-canonical Playwright + axe-core e2e conventions. Triggers when authoring or modifying any spec under e2e/, fixtures, page objects, or playwright.config.ts; when running pnpm test:e2e; when /e2e-add-spec is invoked. Encodes the 8-project matrix (chromium/firefox/webkit desktop + iPhone 15 + Pixel 7 + i18n-rtl + dark-mode + motion-on), dedicated dev-server port 8001, fixture catalog (mockContact, mockTurnstile, setLocale; reserved mockGraphQL slot), reduced-motion default, mock-everything-external rule, source-of-truth reads from src/i18n/locales/* and src/data/content/*. Cites external/testing/playwright-best-practices and external/testing/e2e-testing-patterns; extends sapan architecture conventions in component-patterns, routing, state, data, design-system; never duplicates them."
---

# Workflow — End-to-End Testing (Playwright + axe-core)

## Required reading first

Before authoring or modifying any e2e spec, read these sapan skills — they are authoritative:

- [`architecture/component-patterns.md`](../architecture/component-patterns.md) — RSC default, `'use client'` boundary, `cn()` mandate
- [`architecture/routing.md`](../architecture/routing.md) — 16 locales, `localePrefix: 'as-needed'`, `ar` is RTL, `Link` from `@/i18n/navigation`
- [`architecture/state.md`](../architecture/state.md) — Redux for UI state (`uiSlice`, `localeSlice`); next-themes (NOT Redux) for theme
- [`architecture/data.md`](../architecture/data.md) — `src/data/content/*` is the static-content authority
- [`workflow/testing.md`](./testing.md) — Vitest unit/component conventions; the unit-vs-e2e boundary lives there
- [`workflow/no-use-effect.md`](./no-use-effect.md) — effects are last resort; specs assert observable outcomes, not effect-driven side effects
- [`design-system/colors.md`](../design-system/colors.md) — sapan token swap (`text-primary` ↔ `dark:text-success`); `bg-light dark:bg-slate-900` is canonical
- [`design-system/typography.md`](../design-system/typography.md) — font registry (`font-dm`/`font-hg`/`font-cg`/`font-bungee`/`font-arabic`)
- [`design-system/spacing.md`](../design-system/spacing.md) — named spacing scale only

This skill **extends** those conventions for e2e tests; if any of them change, reread before authoring specs. This skill must NOT duplicate them — it cites and extends.

---

## What it is

Playwright + `@axe-core/playwright` for browser-driven end-to-end testing of sapan's landing page, articles, navigation, i18n, theme, and contact-modal flows. Vitest (`tests/`) stays canonical for unit + component tests.

## When to write an e2e

Defer to [`workflow/testing.md`](./testing.md) for the unit-vs-e2e boundary. As a heuristic, e2e is for:

- Cross-component flows that span at least two routes or two surfaces (e.g. Connect CTA → ContactModal → submit → success state)
- Locale-aware behavior (URL prefix, `<html lang>`, `<html dir>`, translation parity at the rendered-DOM level)
- Theme + RTL — `.dark` class swap on `<html>`, `dir="rtl"` for Arabic, persistence across reload
- Network-mocked external integrations (Resend, Cloudflare Turnstile, GraphQL when Apollo lands)
- Accessibility — axe-core scans on production-like routes that Vitest's jsdom can't fully exercise

If the assertion fits comfortably in jsdom + RTL (a single component's render, props, or internal state), it belongs in `tests/`, not `e2e/`.

---

## Project matrix

`playwright.config.ts` defines 8 projects. Every spec runs on all desktop projects unless explicitly skipped via `test.skip`:

| Project | Engine | Use |
|---|---|---|
| `chromium-desktop` | Chromium 1280×800, locale en | Default fast-feedback target; runs on every commit |
| `firefox-desktop` | Firefox 1280×800 | Cross-engine regressions; full PR matrix |
| `webkit-desktop` | WebKit 1280×800 | iOS/Safari regressions for Three.js + GSAP; full PR matrix |
| `mobile-webkit` | `devices['iPhone 15']` | Mobile responsive + iOS Safari Three.js mount |
| `mobile-chromium` | `devices['Pixel 7']` | Mobile responsive on Chromium engine |
| `i18n-rtl` | Chromium, locale `ar`, `baseURL` `/ar` | Arabic RTL flow |
| `dark-mode` | Chromium, `colorScheme: 'dark'` | Dark-mode token swaps |
| `motion-on` | Chromium, no reduced-motion override | Runs ONLY `motion.spec.ts`; reduced-motion stays disabled here |

**Default port: `8001`.** Playwright spawns its own dev server via `webServer.command: 'pnpm next dev --port=8001 --turbo'` so the developer's regular `pnpm dev` on `8000` keeps running side-by-side. Never hardcode `8000` — use `baseURL` in tests.

---

## Fixture catalog

All specs import `test` and `expect` from [`e2e/fixtures.ts`](../../../e2e/fixtures.ts), never raw `@playwright/test`. The default `page` fixture forces `prefers-reduced-motion: reduce` via `page.emulateMedia()`. Available extensions:

| Fixture | Signature | Purpose |
|---|---|---|
| `mockContact` | `(mode: 'success' \| 'error') => Promise<void>` | Routes `**/api/contact` POSTs to a deterministic response. Never let a spec hit Resend live. |
| `mockTurnstile` | `() => Promise<void>` | Routes `**/turnstile/**` to bypass Cloudflare in CI. Production widget cannot be solved headlessly. |
| `setLocale` | `(locale: string) => Promise<void>` | Navigate to locale-prefixed URL + cookie. Pulls canonical locale list from [`src/i18n/routing.ts`](../../../src/i18n/routing.ts). |
| `mockGraphQL` | _reserved_ | Slot reserved for the first GraphQL feature. Comment in `e2e/fixtures.ts` keeps the slot open until Apollo gets a real endpoint. |

To add a new fixture: extend the `test.extend` generic in `e2e/fixtures.ts`, document the contract here, and reference [`external/testing/e2e-testing-patterns/SKILL.md`](../external/testing/e2e-testing-patterns/SKILL.md) for composition idioms.

---

## Wait strategy

| Wait | Allowed? | Use |
|---|---|---|
| `await page.goto(url)` with default `'load'` or `'domcontentloaded'` | yes | Initial navigation |
| `await expect(locator).toBeVisible()` / `toHaveText()` / `toHaveURL()` | yes | Auto-waiting matchers — preferred over manual probes |
| `await locator.waitFor({ state: 'visible' })` | yes | Element-level deterministic wait |
| `await page.waitForFunction(() => …)` | yes (sparingly) | When DOM state isn't expressible as a locator |
| `await page.waitForLoadState('networkidle')` | **NO** | Three.js, fonts, analytics keep network hot indefinitely |
| `await page.waitForTimeout(ms)` | **NO** | Wall-clock waits are flake. Always wait on a deterministic state. |

The grep gate: `grep -r 'waitForTimeout\|networkidle' e2e/` must return nothing. Wired into the verification block in the PRD.

---

## Mock-everything-external rule

Every external network call has a `page.route()` mock — without exception:

- `**/api/contact` → `mockContact('success' | 'error')`
- `**/turnstile/**` → `mockTurnstile()`
- GraphQL endpoint (when Apollo ships) → `mockGraphQL()`
- Any third-party CDN (fonts, analytics) → no-op route or stubbed response

A spec that hits a real external service is rejected at review. The `e2e-spec-author` agent refuses to scaffold one.

## Reduced-motion-default policy

Framer Motion + GSAP entrances are non-deterministic under headless CI. The default `page` fixture emulates `prefers-reduced-motion: reduce` so animated content settles instantly and assertions are stable.

The `motion-on` project is the only place where motion runs un-emulated, and only `motion.spec.ts` targets it (file-scoped via `testMatch: /motion\.spec\.ts$/` in `playwright.config.ts`). No other spec disables reduced-motion.

---

## Page Object placement

| POM | Path | Use |
|---|---|---|
| `HomePage` | `e2e/pages/home-page.ts` | Selectors for the 8 anchored sections (`#home`, `#technologies`, `#portfolio`, `#experience`, `#testimonials`, `#workflow`, `#blog`, `#faq`) + `scrollToSection(id)` helper |
| `ArticlesPage` | `e2e/pages/articles-page.ts` | Listing locator + `goToArticle(slug)` helper |

Single-purpose specs (i18n, seo, theme) skip POM and inline their selectors — POM overhead isn't worth it for one-shot DOM probes.

---

## Locale-aware specs

Sapan ships 16 locales. The canonical list lives in [`src/i18n/routing.ts`](../../../src/i18n/routing.ts) — never hardcode it in a spec. For PR-scope coverage, parameterize over a representative sample:

```ts
const SAMPLE_LOCALES = ['en', 'fr', 'de', 'es', 'ja', 'zh-CN', 'ar'] as const;
```

For each locale, `i18n.spec.ts` asserts `<html lang>` matches, `<html dir>` is `'rtl'` only for `ar`, URL prefix correctness (`/` for `en`, `/<locale>` otherwise), and that nav translations differ from `en`. The full 16-locale matrix is intentionally NOT exercised — anchored to [`architecture/routing.md`](../architecture/routing.md).

## Redux dispatch in specs

Sapan's contact-modal open state lives in `uiSlice.isContactModalOpen`. The spec opens it by dispatching directly when the dev build exposes the store on `window.__store__`, falling back to a DOM click on the Connect CTA otherwise. Anchored to [`architecture/state.md`](../architecture/state.md):

```ts
const opened = await page.evaluate(() => {
  const store = (window as unknown as { __store__?: { dispatch: (action: { type: string }) => void } }).__store__;
  if (!store) return false;
  store.dispatch({ type: 'ui/openContactModal' });
  return true;
});
if (!opened) await page.getByRole('button', { name: /connect/i }).click();
```

## Source-of-truth for asserted copy

Read all expected copy from source files; never hardcode strings:

- Translation keys → `src/i18n/locales/<locale>/<namespace>.json` (4 namespaces: `common`, `navigation`, `home`, `blog`)
- Static content → `src/data/content/*`
- Locale list, `localePrefix`, RTL set → `src/i18n/routing.ts`
- Section anchor IDs → derive from `e2e/pages/home-page.ts`, never inline

A spec that asserts `'Get in touch'` literally is rejected at review — assert against the imported translation value.

---

## Slash commands & agent

| Tool | Purpose | Example |
|---|---|---|
| [`/e2e-add-spec [feature]`](../../commands/e2e-add-spec.md) | Scaffold a new e2e spec via the `e2e-spec-author` agent — runs the resulting spec on `chromium-desktop` and reports surface | `/e2e-add-spec Test that the FAQ accordion expands on click and persists open state` |
| [`/lhci`](../../commands/lhci.md) | Run Lighthouse CI locally against `/` and `/articles`, report budget verdict + score deltas vs the previous run | `/lhci` |
| [`e2e-spec-author`](../../agents/e2e-spec-author.md) | Agent that designs and scaffolds Playwright specs from a feature description; reads this skill + sapan architecture skills + the two external testing skills before writing | Spawn via Agent tool with `subagent_type: 'e2e-spec-author'`, or use `/e2e-add-spec` |

**When to use the agent vs hand-write:**
- **Use the agent (`/e2e-add-spec`)** for fresh feature surfaces — new flows, new components, anything that warrants its own spec file. The agent picks the right project matrix, mock surface, and POM use.
- **Hand-write** when extending an existing spec (e.g. adding a locale row to `i18n.spec.ts`, a new test block to `theme.spec.ts`), or when the assertion shape is non-obvious and you need close control over the selectors.

The user always reviews the agent's output before commit — flag any structural selector or `test.skip` gate explicitly in the report.

---

## See also

- [`external/testing/playwright-best-practices/SKILL.md`](../external/testing/playwright-best-practices/SKILL.md) — comprehensive Playwright reference (POM, mocking, axe-core, visual regression, console-error monitoring)
- [`external/testing/e2e-testing-patterns/SKILL.md`](../external/testing/e2e-testing-patterns/SKILL.md) — patterns reference (selectors, fixture composition, parallelism, flake mitigation)
- [`workflow/testing.md`](./testing.md) — Vitest unit + component conventions; unit-vs-e2e boundary
- [`workflow/no-use-effect.md`](./no-use-effect.md) — effects discipline (specs assert observable outcomes)

---

## Anti-rule reminder

This skill **extends** sapan conventions; it must not duplicate them. If component-pattern, state, routing, or design-system rules are restated here, that's a smell — collapse the duplication and link to the source. The bridge skill is a thin layer **on top of** sapan conventions, never a parallel one.
