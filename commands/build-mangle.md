---
description: Run a mangled production build and report class statistics, sample mappings, and a sanity check that known project classes survived.
allowed-tools: Read, Bash(pnpm build:mangled*), Bash(pnpm mangle*), Bash(node*), Bash(grep*), Bash(wc*), Bash(ls*), Bash(cat .tw-patch*)
---

# Build Mangle

Runs `pnpm build:mangled` end-to-end and reports a one-screen summary. Use before tagging a release, after a large `cn()`-touching refactor, or when verifying that a new `classList.*` call was correctly auto-reserved.

## Skills to load FIRST

Invoke via the **Skill** tool:

- `tailwind-mangle` (project) — the mangling pipeline + reserve list semantics + reverse-lookup procedure.

## Steps

1. **Run the full pipeline.** `pnpm build:mangled`. Wait for completion (Turbopack build ~10–20s, mangle pass ~3–5s).
2. **Verify the mapping file.** Confirm `.tw-patch/class-list.json` exists and is non-empty. If missing, the mangle pass failed — surface the script output.
3. **Count + sample.** Read `.tw-patch/class-list.json`, report total entries and 5 representative mappings. Pick the samples to span project's surface area:
   - one base utility (`flex`, `block`, `grid`, …)
   - one design-token utility (e.g. `text-primary`, `bg-surface`)
   - one variant (e.g. `dark:bg-slate-900`, `sm:flex-row`)
   - one custom `@utility` (e.g. `font-display`, `text-heading-xl`)
   - one arbitrary value (e.g. `tracking-[0.3em]`, `dark:bg-black/40`)
4. **Sanity check rendered output.** Sample `.next/server/app/_not-found.html` (always prerendered) — every Tailwind class should appear as `tw-X`. If any unmangled Tailwind class survives, the rewrite missed a context — flag it.
5. **CSS bundle delta.** Read the Tailwind CSS chunk size (largest `.next/static/chunks/*.css` containing `@layer`). Compare to the pre-mangle baseline if known. The expected order of magnitude is 5–15% reduction on the Tailwind chunk specifically.
6. **Reserve list audit.** Print the reserve list (parse `[mangle] reserved: …` line from script output). If any reserved class is unexpected (e.g., a developer accidentally added `classList.add('p-4')` — which would un-mangle every `p-4`), flag it.

## Output format

```
✅ Mangled build complete
- Total classes mangled: N
- Tailwind CSS chunk: A KB → B KB (-Δ%)
- Reserved (auto-detected): list
- Sample mappings:
  • flex → tw-X
  • text-primary → tw-Y
  • dark:bg-slate-900 → tw-Z
  • font-display → tw-W
  • tracking-[0.3em] → tw-V
- Sanity: every Tailwind class in _not-found.html is mangled ✓
- Mapping file: .tw-patch/class-list.json (committable as CI artifact)
```

## Failure modes

- **`.tw-patch/` missing after build** — `scripts/mangle.mjs` crashed silently. Re-run `pnpm mangle` standalone with stderr captured to surface the error.
- **Unmangled Tailwind classes in `_not-found.html`** — a className context the regex didn't match. Likely a Next.js or React format change. Check `scripts/mangle.mjs`'s `CLASS_CONTEXT_PATTERNS` against the actual emitted code.
- **Reserve list contains a Tailwind utility you DON'T expect** — someone added a `classList.add("p-4")`-style call. Locate it (`grep -rE 'classList\.(add|remove|toggle|replace).*"<class>"' src/`) and decide: legitimate runtime swap (keep, accept the un-mangled cost) or refactor to React state + `cn()` (preferred).
- **Pre-mangle CSS chunk size unknown** — run `pnpm build` (without mangle) once to capture baseline, then compare.
