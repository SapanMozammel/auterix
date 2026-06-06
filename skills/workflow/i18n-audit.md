# Workflow — i18n Audit

## Purpose

Guide for running translation-coverage audits. Used by `/review-i18n` and referenced whenever the codebase grows new user-facing strings.

## Stack + layout

- `next-intl` v3+ with server (`getTranslations`) and client (`useTranslations`) APIs.
- 16 locales: `en` (default, no URL prefix), `fr`, `de`, `es`, `ar`, `zh-CN`, `pt-BR`, `ja`, `nl`, `it`, `ru`, `hi`, `no`, `tr`, `ko`, `bn`.
- `ar` is RTL; `HtmlLocaleSync` client component mirrors locale → `<html lang/dir>` + body font class.
- 4 namespaces: `common`, `navigation`, `home`, `blog`. Files at `src/i18n/locales/[locale]/[namespace].json`.
- Root layout (`src/app/layout.tsx`) sets initial `<html lang/dir>` from SSR locale; `[locale]/layout.tsx` wires `NextIntlClientProvider` + `HtmlLocaleSync`.

## What is translatable

**Translate anything user-facing in `src/app/` and `src/components/`:**

- JSX text content (excluding data props)
- `aria-label`, `alt`, `title`, `placeholder` attributes with static strings
- Form labels, error messages, validation copy
- Dialog / modal titles + descriptions
- Button text, link labels (except brand wordmarks)
- Loading / empty / error state copy
- Section titles and subtitles (`<SectionTitle title subtitle>`)
- Nav link labels

## What is NOT translatable

**Data files are never translated — they are the content itself:**

- Everything under `src/data/content/` (blog posts, portfolio, experience, faq, testimonials, workflow, admin-dashboard)
- `src/data/config/*` (languages — native names stay native; technologies — tech names stay English)

**Intentional English-only values** (do not flag as missing translations):

- `<SectionTitle watermark>` prop — decorative background English text ("Technologies", "Portfolio", "Experience", etc.)
- `blog-card` date format (`toLocaleDateString('en-US', ...)`)
- `blog-card` / blog detail reading time `{x} min` suffix
- ThemeSwitcher option labels showing raw theme tokens `light` / `dark` / `system`
- Brand wordmark "sapan.dev" in `HeaderLogo`
- Social link `label` props in `CtaConnect` (GitHub, LinkedIn, WordPress — brand names)
- Personal name "Sapan Mozammel" / "SapanMozammel"
- Tech names inside translated strings: `React`, `Redux`, `GraphQL`, `Next.js`, `Three.js`, `Node.js`, `JavaScript`, `TypeScript`
- Dev-only UX strings (e.g. `Error details (dev only)` summary)
- `src/app/not-found.tsx` (root-level fallback outside `[locale]` — no resolved locale available)

## Namespace conventions

When adding new keys, prefer these namespaces:

| Namespace | Content |
|-----------|---------|
| `common` | Buttons, errors, labels, loading, footer, theme, contact form, error/notFound pages |
| `navigation` | Nav link labels, menu aria-labels |
| `home` | Section-specific copy (hero, technologies, portfolio, experience, testimonials, workflow, faq, blog, cta) |
| `blog` | Blog-listing / detail copy (pagination, readingTime, noPosts, publishedOn, backToList, moreIn) |

**Reuse before create** — `common.buttons.learnMore`, `common.buttons.readMore`, `common.buttons.getInTouch`, `common.loading`, and nav keys in `navigation.*` are already defined; don't duplicate.

## ICU interpolation

Use `{placeholder}` for runtime values (next-intl parses ICU). Known placeholders in current codebase:

- `{name}` — `common.footer.designedBy`
- `{minutes}` — `blog.readingTime`, `blog.readingTimeShort`
- `{date}` — `blog.publishedOn`

**Every new locale must preserve placeholder syntax verbatim.** Translators sometimes change curly braces to localized quotation marks — this breaks interpolation.

## Translator-hook naming

Per project convention, hook variables use descriptive `translate*` names — never short `t`:

```ts
const translate = useTranslations('home.hero');
const translateNav = useTranslations('navigation');
const translateButtons = useTranslations('common.buttons');
const translateLabels = useTranslations('common.labels');
```

## Server vs client decision for translated components

- If component already has `'use client'` → use `useTranslations(namespace)` directly in the function body.
- If server component → `getTranslations(namespace)` is async; make the component `async` and `await` the call.
- If the component is used inside both server and client contexts (e.g. `blog-card` rendered by both `Blog/index.tsx` server section AND `articles/page.tsx` client page) → it MUST be client-side with `useTranslations`. Async children can't be rendered from client parents.
- Tests for async server components: `render(await Component())`.

## Verification commands

### Key parity (all 16 locales must match English)

```bash
node -e "
const fs=require('fs');const p=require('path');
const root='src/i18n/locales';
const NS=['common','navigation','home','blog'];
const en={};for(const ns of NS)en[ns]=JSON.parse(fs.readFileSync(p.join(root,'en',ns+'.json'),'utf8'));
const flat=(o,pth='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v!==null?flat(v,pth+k+'.'):[pth+k]);
const enKeys=Object.fromEntries(Object.entries(en).map(([k,v])=>[k,flat(v).sort()]));
let issues=0;
for(const loc of fs.readdirSync(root).filter(d=>d!=='en')){
  for(const ns of NS){
    const pp=p.join(root,loc,ns+'.json');
    if(!fs.existsSync(pp)){console.log('MISSING',loc,ns);issues++;continue;}
    const k=flat(JSON.parse(fs.readFileSync(pp,'utf8'))).sort();
    const miss=enKeys[ns].filter(x=>!k.includes(x));
    const extra=k.filter(x=>!enKeys[ns].includes(x));
    if(miss.length||extra.length){console.log('MISMATCH',loc,ns,'missing:',miss,'extra:',extra);issues++;}
  }
}
console.log(issues===0?'ALL LOCALES MATCH EN':'ISSUES: '+issues);
"
```

### Placeholder integrity

```bash
node -e "
const fs=require('fs'),p=require('path'),root='src/i18n/locales';
const NS=['common','navigation','home','blog'];
const load=loc=>JSON.stringify(NS.map(ns=>JSON.parse(fs.readFileSync(p.join(root,loc,ns+'.json'),'utf8'))));
const enAll=load('en');
const placeholders=[...new Set(enAll.match(/\\\\{[a-zA-Z]+\\\\}/g)||[])];
for(const loc of fs.readdirSync(root).filter(l=>l!=='en')){
  const all=load(loc);
  for(const ph of placeholders){
    const re=new RegExp(ph.replace(/[{}]/g,'\\\\\\\\\$&'),'g');
    const have=(all.match(re)||[]).length,want=(enAll.match(re)||[]).length;
    if(have!==want)console.log('MISMATCH',loc,ph,'got',have,'want',want);
  }
}
console.log('placeholder audit done');
"
```

### Orphan-key detection

Find translation keys that exist in `src/i18n/locales/en/*.json` but are never referenced from any `useTranslations` / `getTranslations` call-site in `src/`. Run this after every audit round — orphans accumulate silently when components get rewritten.

```bash
node -e "
const fs=require('fs'),p=require('path'),root='src/i18n/locales';
const NS=['common','navigation','home','blog'];
const srcRoots=['src/app','src/components','src/hooks'];

const flat=(o,pth='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v!==null?flat(v,pth+k+'.'):[pth+k]);
const paths=NS.flatMap(ns=>flat(JSON.parse(fs.readFileSync(p.join(root,'en',ns+'.json'),'utf8')),ns+'.'));

const walk=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const full=p.join(dir,e.name);
  return e.isDirectory()?walk(full):(/\\.(tsx?|jsx?)\$/.test(e.name)?[full]:[]);
}):[];
const files=srcRoots.flatMap(walk);
const sources=files.map(f=>({file:f,content:fs.readFileSync(f,'utf8')})).filter(s=>/useTranslations|getTranslations/.test(s.content));

const esc=s=>s.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\\$&');
const orphans=[];
for(const path of paths){
  const parts=path.split('.');
  let found=false;
  for(let i=1;i<parts.length;i++){
    const ns=parts.slice(0,i).join('.');
    const key=parts.slice(i).join('.');
    const nsRe=new RegExp('(useTranslations|getTranslations)\\\\s*\\\\(\\\\s*[\\'\"]'+esc(ns)+'[\\'\"]');
    const keyRe=new RegExp('[\\'\"]'+esc(key)+'[\\'\"]');
    if(sources.some(s=>nsRe.test(s.content)&&keyRe.test(s.content))){found=true;break;}
  }
  if(!found)orphans.push(path);
}

if(orphans.length===0)console.log('no orphan keys — all translation keys are referenced in src/');
else{console.log('ORPHAN KEYS ('+orphans.length+' found — review carefully, dynamic keys may be false positives):');for(const o of orphans)console.log('  '+o);}
"
```

**How it works:** For every leaf path like `blog.readingTime`, tries every possible `(namespace, key)` split. An orphan is flagged only when no file contains `useTranslations('ns')` / `getTranslations('ns')` AND the key literal together for *any* valid split.

**False positives to watch for:**
- Dynamic key lookups: `t(item.key)` where `item.key` comes from data. If the literal value (e.g. `'home'`) appears anywhere in source, detection works. If values are composed at runtime (e.g. `\`home.\${section}\``), keys may be mis-flagged.
- Keys referenced only from test files — the script excludes `tests/` by design.

**Remediation:** once confirmed unused, remove the key from all 16 locale files via a Node one-liner. Then re-run the parity check to confirm nothing broke.

### Tech-name preservation

```bash
for tech in React Redux GraphQL "Next.js" "Three.js" "Node.js" JavaScript; do
  for loc in $(ls src/i18n/locales); do
    grep -q "$tech" "src/i18n/locales/$loc/home.json" || echo "MISSING: $loc lacks $tech in home.json"
  done
done
```

## Batch-translate new keys

When extending the English JSON, propagate across 15 locales via **5 parallel subagents × 3 locales each** (groups by script family for consistency):

- Agent 1: `fr`, `de`, `es` (Latin — Romance/Germanic)
- Agent 2: `it`, `nl`, `pt-BR` (Latin — Romance/Germanic)
- Agent 3: `ar`, `hi`, `bn` (Arabic script / Devanagari / Bengali script — formal MSA for ar)
- Agent 4: `zh-CN`, `ja`, `ko` (CJK — polite forms)
- Agent 5: `ru`, `tr`, `no` (Cyrillic / Turkish / Norwegian Bokmål)

Each agent receives: full English source for the namespaces touched, instruction to preserve proper nouns + placeholders, and the write target path per locale.

**For short generic labels** (e.g. 2-3 words like "Role" / "Technologies"), skip agents — use a Node one-liner with hand-curated translations. Faster and fewer round-trips.

## Output artifacts

Audits always produce PRDs — never apply fixes directly:

- `.claude/plans/missing-translations-audit/prd.md` — hardcoded strings that should be translated
- `.claude/plans/over-translation-audit/prd.md` — violations (or clean-audit record if none)
- `.claude/plans/orphan-translation-keys-audit/prd.md` — keys present in locale JSON but never referenced in `src/` (delete tasks), or clean-audit record if none

Each PRD follows the workflow convention:
- Scope + Date header
- Summary with finding counts
- Numbered violations with `[🔄]` markers
- Affected files section
- Verification section
- Final "`/implement [audit-name]`" command reference

## Related commands

- `/review-i18n` — this audit
- `/translate [locale?]` — propagate English changes to other locales
- `/implement missing-translations-audit` — apply PRD 1 fixes
- `/review [file?]` — generic design system / architecture review (not i18n)

---

## See also (external reference)

Sapan rules in this file are authoritative; external references are framework-level guidance — load when sapan rules don't cover the case.

- [`external/testing/playwright-best-practices/`](../external/testing/playwright-best-practices/) — i18n + locale testing patterns (browser-level Playwright tests). Sapan's `/review-i18n` runs translation-parity audits via Vitest + Node scripts; Playwright `e2e/i18n.spec.ts` adds the runtime-rendered locale verification.
