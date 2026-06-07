# Workflow — i18n Audit

## Purpose

Guide for running translation-coverage audits. Used by `/review-i18n` and referenced whenever the codebase grows new user-facing strings.

## Stack + layout

Fill in project-specific details here (see `architecture/routing.md`):

- **i18n library**: e.g. `next-intl`, `react-i18next`, `lingui`, `i18next`
- **Locale list**: document all supported locales and which are RTL
- **Namespace layout**: document your namespace names and file paths (e.g. `src/i18n/locales/[locale]/[namespace].json`)
- **Server vs client API**: document how translations are fetched in RSC vs client components
- **Layout wiring**: document where the locale provider is mounted and how `<html lang/dir>` is set

## What is translatable

**Translate anything user-facing in `src/app/` and `src/components/`:**

- JSX text content (excluding data props)
- `aria-label`, `alt`, `title`, `placeholder` attributes with static strings
- Form labels, error messages, validation copy
- Dialog / modal titles + descriptions
- Button text, link labels (except brand wordmarks)
- Loading / empty / error state copy
- Section titles and subtitles
- Nav link labels

## What is NOT translatable

**Data files are never translated — they are the content itself:**

- Everything under the project's static data directories (see `architecture/data.md`)
- Config files where values are used as identifiers (tech names, language native names, etc.)

**Intentional English-only values** (do not flag as missing translations) — document project-specific exceptions here:

- Decorative / watermark text (background display text)
- Date and time formats that are locale-controlled at render time
- Brand wordmarks and product names
- Social link labels for brand names (GitHub, LinkedIn, etc.)
- Tech names inside translated strings (React, Node.js, etc.)
- Dev-only error strings
- Root-level fallback pages outside the locale segment (no resolved locale available)

## Namespace conventions

Document your project's namespace structure here:

| Namespace | Content |
|-----------|---------|
| (fill in) | (fill in) |

**Reuse before create** — before adding a new key, grep for existing keys that express the same string. Shared labels (e.g. "Learn more", "Loading…") should live in a `common` namespace.

## ICU interpolation

Use `{placeholder}` for runtime values (standard ICU format). Document known placeholders in your project here:

- `{name}` — e.g. footer attribution
- `{count}` — e.g. pagination labels

**Every new locale must preserve placeholder syntax verbatim.** Translators sometimes change curly braces to localized quotation marks — this breaks interpolation.

## Translator-hook naming

Document the project's translator-hook naming convention here (e.g. descriptive `translate*` variables vs short `t`).

## Server vs client decision for translated components

- If component already has `'use client'` → use the client hook (e.g. `useTranslations`) directly in the function body.
- If server component → use the async server API (e.g. `getTranslations`); make the component `async` and `await` the call.
- If the component is used in both server and client contexts → it MUST use the client hook. Async children can't be rendered from client parents.
- Tests for async server components: `render(await Component())`.

## Verification commands

Update the config variables at the top of each script to match your project's locale root and namespace list.

### Key parity (all locales must match baseline)

```bash
node -e "
const fs=require('fs');const p=require('path');
// ── CONFIG: update these for your project ──────────────────────────────────
const root='src/i18n/locales';   // locale root
const baseline='en';             // baseline locale directory name
const NS=['common','navigation']; // your namespace names
// ───────────────────────────────────────────────────────────────────────────
const en={};for(const ns of NS)en[ns]=JSON.parse(fs.readFileSync(p.join(root,baseline,ns+'.json'),'utf8'));
const flat=(o,pth='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v!==null?flat(v,pth+k+'.'):[pth+k]);
const enKeys=Object.fromEntries(Object.entries(en).map(([k,v])=>[k,flat(v).sort()]));
let issues=0;
for(const loc of fs.readdirSync(root).filter(d=>d!==baseline)){
  for(const ns of NS){
    const pp=p.join(root,loc,ns+'.json');
    if(!fs.existsSync(pp)){console.log('MISSING',loc,ns);issues++;continue;}
    const k=flat(JSON.parse(fs.readFileSync(pp,'utf8'))).sort();
    const miss=enKeys[ns].filter(x=>!k.includes(x));
    const extra=k.filter(x=>!enKeys[ns].includes(x));
    if(miss.length||extra.length){console.log('MISMATCH',loc,ns,'missing:',miss,'extra:',extra);issues++;}
  }
}
console.log(issues===0?'ALL LOCALES MATCH BASELINE':'ISSUES: '+issues);
"
```

### Placeholder integrity

```bash
node -e "
const fs=require('fs'),p=require('path');
// ── CONFIG ──────────────────────────────────────────────────────────────────
const root='src/i18n/locales';
const baseline='en';
const NS=['common','navigation'];
// ───────────────────────────────────────────────────────────────────────────
const load=loc=>JSON.stringify(NS.map(ns=>JSON.parse(fs.readFileSync(p.join(root,loc,ns+'.json'),'utf8'))));
const enAll=load(baseline);
const placeholders=[...new Set(enAll.match(/\\{[a-zA-Z]+\\}/g)||[])];
for(const loc of fs.readdirSync(root).filter(l=>l!==baseline)){
  const all=load(loc);
  for(const ph of placeholders){
    const re=new RegExp(ph.replace(/[{}]/g,'\\\\$&'),'g');
    const have=(all.match(re)||[]).length,want=(enAll.match(re)||[]).length;
    if(have!==want)console.log('MISMATCH',loc,ph,'got',have,'want',want);
  }
}
console.log('placeholder audit done');
"
```

### Orphan-key detection

Find translation keys that exist in the baseline locale files but are never referenced from any translation call-site in `src/`. Run this after every audit round — orphans accumulate silently when components get rewritten.

```bash
node -e "
const fs=require('fs'),p=require('path');
// ── CONFIG ──────────────────────────────────────────────────────────────────
const root='src/i18n/locales';
const baseline='en';
const NS=['common','navigation'];
const srcRoots=['src/app','src/components','src/hooks'];
const translateHooks=['useTranslations','getTranslations']; // update for your i18n library
// ───────────────────────────────────────────────────────────────────────────
const flat=(o,pth='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v!==null?flat(v,pth+k+'.'):[pth+k]);
const paths=NS.flatMap(ns=>flat(JSON.parse(fs.readFileSync(p.join(root,baseline,ns+'.json'),'utf8')),ns+'.'));

const walk=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const full=p.join(dir,e.name);
  return e.isDirectory()?walk(full):(/\\.(tsx?|jsx?)\$/.test(e.name)?[full]:[]);
}):[];
const files=srcRoots.flatMap(walk);
const hookPattern=new RegExp(translateHooks.join('|'));
const sources=files.map(f=>({file:f,content:fs.readFileSync(f,'utf8')})).filter(s=>hookPattern.test(s.content));

const esc=s=>s.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&');
const orphans=[];
for(const path of paths){
  const parts=path.split('.');
  let found=false;
  for(let i=1;i<parts.length;i++){
    const ns=parts.slice(0,i).join('.');
    const key=parts.slice(i).join('.');
    const nsRe=new RegExp('('+translateHooks.join('|')+')\\\\s*\\\\(\\\\s*[\\'\"]'+esc(ns)+'[\\'\"]');
    const keyRe=new RegExp('[\\'\"]'+esc(key)+'[\\'\"]');
    if(sources.some(s=>nsRe.test(s.content)&&keyRe.test(s.content))){found=true;break;}
  }
  if(!found)orphans.push(path);
}

if(orphans.length===0)console.log('no orphan keys — all translation keys are referenced in src/');
else{console.log('ORPHAN KEYS ('+orphans.length+' found — review carefully, dynamic keys may be false positives):');for(const o of orphans)console.log('  '+o);}
"
```

**How it works:** For every leaf path like `blog.readingTime`, tries every possible `(namespace, key)` split. An orphan is flagged only when no file contains the translate hook with the namespace AND the key literal together for any valid split.

**False positives to watch for:**
- Dynamic key lookups: `t(item.key)` where `item.key` comes from data. If the literal value appears anywhere in source, detection works. If values are composed at runtime (e.g. `` `home.${section}` ``), keys may be mis-flagged.
- Keys referenced only from test files — the script excludes `tests/` by design.

**Remediation:** once confirmed unused, remove the key from all locale files. Then re-run the parity check to confirm nothing broke.

### Tech-name preservation

```bash
# Update the tech list and locale root for your project
for tech in React Redux GraphQL "Next.js" "Node.js" JavaScript; do
  for loc in $(ls src/i18n/locales); do
    grep -rq "$tech" "src/i18n/locales/$loc/" || echo "MISSING: $loc lacks $tech"
  done
done
```

## Batch-translate new keys

When extending the baseline locale JSON, propagate across target locales via **parallel subagents**, grouped by script family for translation consistency:

- Group by script: Latin (Romance), Latin (Germanic), Arabic/Devanagari/Bengali, CJK, Cyrillic/other
- Each agent receives: full baseline source for the namespaces touched, instruction to preserve proper nouns + placeholders, and the write target path per locale

**For short generic labels** (2-3 words), skip agents — use a Node one-liner with hand-curated translations. Faster and fewer round-trips.

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
- `/translate [locale?]` — propagate baseline changes to other locales
- `/implement missing-translations-audit` — apply PRD 1 fixes
- `/review [file?]` — generic design system / architecture review (not i18n)

---

## See also (external reference)

Project rules in this file are authoritative; external references are framework-level guidance — load when project rules don't cover the case.

- [`external/testing/playwright-best-practices/`](../external/testing/playwright-best-practices/) — i18n + locale testing patterns (browser-level Playwright tests). Project's `/review-i18n` runs translation-parity audits via Node scripts; Playwright `e2e/i18n.spec.ts` adds the runtime-rendered locale verification.
