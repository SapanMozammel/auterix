# Architecture — State Management

## Redux Store (`src/store/`)

### Slices

**`localeSlice`** — `src/store/slices/locale-slice.ts`
- State: `currentLocale`, `isRTL`
- Persists to `localStorage` key `preferred-language`
- Updated when user switches language via `LanguageSwitcher`

**`uiSlice`** — `src/store/slices/ui-slice.ts`
- State: `isContactModalOpen`
- Controls the contact modal open/close state

### Typed Hooks (always use these — never raw Redux)

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const dispatch = useAppDispatch()
const isOpen = useAppSelector((state) => state.ui.isContactModalOpen)
```

**Never** use `useDispatch()` or `useSelector()` directly.

### State Ownership Rules

| State | Owner |
|---|---|
| Contact modal open/close | Redux (`uiSlice`) |
| Current locale + RTL flag | Redux (`localeSlice`) |
| Color theme (light/dark) | `next-themes` — NOT Redux |
| Form field state | local `useState` inside component |
| Animation state | local `useState` or Framer Motion |

---

## Theme — next-themes

```tsx
// Provider configured in src/providers/index.tsx
<ThemeProvider defaultTheme="system" attribute="class">
```

- Adds `.dark` class to `<html>` when dark mode is active
- Access theme: `const { theme, setTheme } = useTheme()` from `next-themes`
- Do not store theme in Redux

---

## Custom Hooks (`src/hooks/`)

**`useContactForm`** — `src/hooks/use-contact-form.ts`
- Form state, validation, and submission
- Dispatches to Redux for modal state

**`useStackingCards`** — `src/hooks/use-stacking-cards.ts`
- GSAP ScrollTrigger stacking animation for Portfolio section
- Returns ref to attach to card container

---

## See also

For the Redux/Apollo state boundary (UI vs remote data), see [`data-graphql.md`](./data-graphql.md).

For Redux dispatch patterns in e2e (opening ContactModal via `window.__store__.dispatch`, asserting locale persistence after reload), see [`../workflow/e2e.md`](../workflow/e2e.md).

### External reference

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/react/react-best-practices/`](../external/react/react-best-practices/) — hook usage, state colocation, derived-state patterns
- [`external/data/apollo-client/`](../external/data/apollo-client/) — Apollo state management (`InMemoryCache`, reactive variables — sapan does NOT use reactive variables). **Load only when Apollo is in use** to understand the Redux/Apollo boundary documented above (Redux for UI state; Apollo for remote data + cache).
