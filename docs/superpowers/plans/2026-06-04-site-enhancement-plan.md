# Site Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all bugs (links, i18n), add full SEO (robots.txt, canonical, OG, JSON-LD, hreflang sitemap), GoatCounter analytics with visitor counter widget, Web3Forms contact form (RU→yandex, EN→gmail), ethical simulator with shareable results, and giscus comments + reactions + share buttons.

**Architecture:** Static Astro 5 site on GitHub Pages. All new interactivity uses Preact islands (`client:load`). Analytics via GoatCounter async script. Contact form via Web3Forms API (POST, no backend). Comments via giscus (GitHub Discussions). No server-side code.

**Tech Stack:** Astro 5, Preact 10, Tailwind CSS v4, TypeScript, Web3Forms API, GoatCounter, giscus

---

## Phase 1: Critical Bug Fixes

### Task 1: Fix 404 redirect in paths/[...path].astro

**Files:**
- Modify: `web/src/pages/[lang]/paths/[...path].astro:18`

- [ ] **Step 1: Fix the redirect**

Change line 18 from:
```astro
if (!studyPath) return Astro.redirect(`/ThePath/${lang}/404`);
```
To:
```astro
if (!studyPath) return Astro.redirect(`/ThePath/404`);
```

- [ ] **Step 2: Verify the change**

```bash
grep "Astro.redirect" web/src/pages/\[lang\]/paths/\[...path\].astro
```

Expected: `if (!studyPath) return Astro.redirect('/ThePath/404');`

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/\[lang\]/paths/\[...path\].astro
git commit -m "fix: broken 404 redirect to non-existent /[lang]/404"
```

### Task 2: Fix z-index collision (skip-link vs search-overlay)

**Files:**
- Modify: `web/src/styles/global.css:126`

- [ ] **Step 1: Bump search-overlay z-index**

Change line 126 from:
```css
.search-overlay { ... z-index: 100; ... }
```
To:
```css
.search-overlay { ... z-index: 101; ... }
```

- [ ] **Step 2: Verify**

```bash
grep "z-index.*101" web/src/styles/global.css
```

Expected: match on `.search-overlay` line

- [ ] **Step 3: Commit**

```bash
git add web/src/styles/global.css
git commit -m "fix: search-overlay z-index from 100 to 101, above skip-link"
```

### Task 3: Fix ThemeToggle CSS contradiction

**Files:**
- Modify: `web/src/components/ThemeToggle.astro:15-18`

- [ ] **Step 1: Replace CSS block**

Replace lines 15-18:
```css
  [data-theme="dark"] .icon-sun, :root .icon-sun { display: none; }
  [data-theme="dark"] .icon-moon, :root .icon-sun { display: block; }
  :root .icon-moon, [data-theme="light"] .icon-moon { display: none; }
  [data-theme="light"] .icon-sun { display: block; }
```
With:
```css
  :root .icon-sun { display: none; }
  :root .icon-moon { display: block; }
  [data-theme="light"] .icon-sun { display: block; }
  [data-theme="light"] .icon-moon { display: none; }
```

- [ ] **Step 2: Verify**

```bash
grep -n "icon-sun\|icon-moon" web/src/components/ThemeToggle.astro
```

Expected: clean cascade without `:root .icon-sun { display: block; }`

- [ ] **Step 3: Commit**

```bash
git add web/src/components/ThemeToggle.astro
git commit -m "fix: contradictory ThemeToggle CSS for icon-sun/icon-moon"
```

---

## Phase 2: i18n — Replace All Hardcoded Text with t()

### Task 4: Add all new i18n keys to ui.ts

**Files:**
- Modify: `web/src/i18n/ui.ts`

- [ ] **Step 1: Add keys block after existing 'skip_to_content'**

After line 59 (`'skip_to_content': 'К содержанию',`) in `ru` block and line 117 (`'skip_to_content': 'Skip to content',`) in `en` block, add:

```typescript
    // TOC
    'toc.title': 'Содержание',
    // ModuleNav
    'module.prev': 'Предыдущий',
    'module.next': 'Следующий',
    // Table headers
    'table.number': '#',
    'table.title': 'Название',
    'table.audience': 'Аудитория',
    'table.path': 'Путь',
    // Daily checklist
    'daily.morning': 'Утреннее намерение',
    'daily.shield': 'Цифровой щит',
    'daily.evening': 'Вечерняя рефлексия',
    'daily.allDone': '✓ Все практики выполнены',
    // Ethical compass
    'compass.reset': '← Новый вопрос',
    'compass.progress': 'Шаг {current} из {total}',
    // 404 page
    '404.suggestions': 'Попробуйте поиск или перейдите на одну из страниц:',
    '404.glossary': 'Глоссарий',
    '404.canon': 'Канон Спирали',
    // Glossary page
    'glossary.title': 'Глоссарий',
    'glossary.heading': 'Глоссарий терминов Спирали Сознания',
    'glossary.description': 'Ключевые понятия системы. Этот глоссарий пополняется по мере развития Спирали.',
```

```typescript
    // TOC
    'toc.title': 'Contents',
    // ModuleNav
    'module.prev': 'Previous',
    'module.next': 'Next',
    // Table headers
    'table.number': '#',
    'table.title': 'Title',
    'table.audience': 'Audience',
    'table.path': 'Path',
    // Daily checklist
    'daily.morning': 'Morning intention',
    'daily.shield': 'Digital shield',
    'daily.evening': 'Evening reflection',
    'daily.allDone': '✓ All practices complete',
    // Ethical compass
    'compass.reset': '← New question',
    'compass.progress': 'Step {current} of {total}',
    // 404 page
    '404.suggestions': 'Try searching or visit one of these pages:',
    '404.glossary': 'Glossary',
    '404.canon': 'Canon of the Spiral',
    // Glossary page
    'glossary.title': 'Glossary',
    'glossary.heading': 'Glossary of Spiral of Consciousness Terms',
    'glossary.description': 'Key concepts of the system. This glossary grows as the Spiral evolves.',
```

- [ ] **Step 2: Add nav keys (nav.glossary, nav.contact, nav.simulator)**

To `ru` block:
```typescript
    'nav.glossary': 'Глоссарий',
    'nav.contact': 'Контакты',
    'nav.simulator': 'Симулятор',
```

To `en` block:
```typescript
    'nav.glossary': 'Glossary',
    'nav.contact': 'Contact',
    'nav.simulator': 'Simulator',
```

- [ ] **Step 3: Verify no type errors**

```bash
cd web && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors from ui.ts

- [ ] **Step 4: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/i18n/ui.ts
git commit -m "feat(i18n): add keys for TOC, nav, daily, compass, 404, glossary"
```

### Task 5: Fix TableOfContents.astro — use t()

**Files:**
- Modify: `web/src/components/module/TableOfContents.astro`

- [ ] **Step 1: Import t() and Lang, pass lang prop**

Change the frontmatter from:
```astro
---
interface Heading { depth: number; text: string; slug: string; }
const { headings = [] } = Astro.props as { headings?: Heading[] };
if (headings.length === 0) return null;
---
```

To:
```astro
---
import { t, type Lang } from '../../i18n/ui';
interface Heading { depth: number; text: string; slug: string; }
const { headings = [], lang = 'ru' } = Astro.props as { headings?: Heading[]; lang?: Lang };
if (headings.length === 0) return null;
---
```

- [ ] **Step 2: Replace hardcoded text**

Change line:
```astro
    <summary class="toc-title">Содержание</summary>
```
To:
```astro
    <summary class="toc-title">{t('toc.title', lang)}</summary>
```

- [ ] **Step 3: Update ModuleLayout.astro to pass lang**

In `web/src/layouts/ModuleLayout.astro`, change the TableOfContents line from:
```astro
      <TableOfContents headings={headings} />
```
To:
```astro
      <TableOfContents headings={headings} lang={lang} />
```

- [ ] **Step 4: Verify and commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/module/TableOfContents.astro web/src/layouts/ModuleLayout.astro
git commit -m "fix(i18n): TableOfContents uses t() instead of hardcoded Russian"
```

### Task 6: Fix ModuleNav.astro — use t()

**Files:**
- Modify: `web/src/components/module/ModuleNav.astro:10,20,28`

- [ ] **Step 1: Import t() at top**

Change line 1 from:
```astro
import { modules } from '../../i18n/modules';
import type { Lang } from '../../i18n/ui';
```
To:
```astro
import { t, type Lang } from '../../i18n/ui';
import { modules } from '../../i18n/modules';
```

- [ ] **Step 2: Replace hardcoded labels**

Change line 20:
```astro
          <span class="nav-label">{lang === 'ru' ? 'Предыдущий' : 'Previous'}</span>
```
To:
```astro
          <span class="nav-label">{t('module.prev', lang)}</span>
```

Change line 28:
```astro
          <span class="nav-label">{lang === 'ru' ? 'Следующий' : 'Next'}</span>
```
To:
```astro
          <span class="nav-label">{t('module.next', lang)}</span>
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/module/ModuleNav.astro
git commit -m "fix(i18n): ModuleNav uses t() for prev/next labels"
```

### Task 7: Fix DailyChecklist.tsx — use t()

**Files:**
- Modify: `web/src/components/interactive/DailyChecklist.tsx`

- [ ] **Step 1: Replace all hardcoded strings**

Replace lines 30-44 (the return block) with:
```tsx
  return (
    <div class={`daily-checklist ${done ? 'done' : ''}`}>
      <div class="dc-header">
        <span class="dc-title">{today.replace(/-/g, '.')}</span>
        <span class="dc-count">{count}/3</span>
      </div>
      <label class={`dc-item ${items.morning ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.morning || false} onChange={() => toggle('morning')} />
        <span>{t('daily.morning', lang)}</span>
      </label>
      <label class={`dc-item ${items.shield ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.shield || false} onChange={() => toggle('shield')} />
        <span>{t('daily.shield', lang)}</span>
      </label>
      <label class={`dc-item ${items.evening ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.evening || false} onChange={() => toggle('evening')} />
        <span>{t('daily.evening', lang)}</span>
      </label>
      {done && <div class="dc-done">{t('daily.allDone', lang)}</div>}
    </div>
  );
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/interactive/DailyChecklist.tsx
git commit -m "fix(i18n): DailyChecklist uses t() for all labels"
```

### Task 8: Fix EthicalCompass.tsx — use t() for reset button

**Files:**
- Modify: `web/src/components/interactive/EthicalCompass.tsx:105-111`

- [ ] **Step 1: Replace hardcoded button**

Change:
```tsx
      {!s.options && (
        <button class="ec-reset" onClick={() => setStep('intro')}>
          {lang === 'ru' ? '← Новый вопрос' : '← New question'}
        </button>
      )}
```
To:
```tsx
      {!s.options && (
        <button class="ec-reset" onClick={() => setStep('intro')}>
          {t('compass.reset', lang)}
        </button>
      )}
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/interactive/EthicalCompass.tsx
git commit -m "fix(i18n): EthicalCompass reset button uses t()"
```

### Task 9: Fix 404.astro — use t() for all text

**Files:**
- Modify: `web/src/pages/404.astro`

- [ ] **Step 1: Import Lang type properly**

Change lines 3-4 from:
```astro
const url = Astro.url.pathname;
const lang = (url.includes('/en/') || url.startsWith('/ThePath/en')) ? 'en' : 'ru';
```
To:
```astro
import type { Lang } from '../i18n/ui';
const url = Astro.url.pathname;
const lang: Lang = (url.includes('/en/') || url.startsWith('/ThePath/en')) ? 'en' : 'ru';
```

- [ ] **Step 2: Replace all hardcoded text with t()**

Replace the entire template body (lines 9-30) with:
```astro
<BaseLayout lang={lang} title={t('404.title', lang)}>
  <div class="content" style="text-align:center;padding:4rem 1.5rem 2rem;">
    <h1 style="font-size:5rem;margin-bottom:0;opacity:0.3;">404</h1>
    <p style="font-size:1.25rem;color:var(--color-text-secondary);margin-bottom:1rem;">
      {t('404.title', lang)}
    </p>
    <div style="display:flex;justify-content:center;margin-bottom:2rem;">
      <SearchModal lang={lang} client:load />
    </div>
    <p style="font-size:0.9rem;color:var(--color-text-secondary);margin-bottom:2rem;">
      {t('404.suggestions', lang)}
    </p>
    <div class="suggestions">
      <a href={`${base}/${lang}/`} class="sugg-link">{t('nav.home', lang)}</a>
      <a href={`${base}/${lang}/map`} class="sugg-link">{t('nav.map', lang)}</a>
      <a href={`${base}/${lang}/manifesto`} class="sugg-link">{t('nav.manifesto', lang)}</a>
      <a href={`${base}/${lang}/glossary`} class="sugg-link">{t('404.glossary', lang)}</a>
      <a href={`${base}/${lang}/modules/0-canon`} class="sugg-link">{t('404.canon', lang)}</a>
    </div>
  </div>
</BaseLayout>
```

Also fix the `as` casts on the BaseLayout and SearchModal lines (remove `as 'ru' | 'en'` — `lang` is now typed).

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/pages/404.astro
git commit -m "fix(i18n): 404 page fully uses t() and typed Lang"
```

### Task 10: Fix map.astro — use t() for table headers + remove `as any`

**Files:**
- Modify: `web/src/pages/[lang]/map.astro`

- [ ] **Step 1: Import Lang type**

Change the import on line 5 from:
```astro
import { t } from '../../i18n/ui';
```
To:
```astro
import { t, type Lang } from '../../i18n/ui';
```

- [ ] **Step 2: Type lang properly**

Change line 16 from:
```astro
const { lang } = Astro.params;
```
To:
```astro
const lang = Astro.params.lang as Lang;
```

- [ ] **Step 3: Remove all `as any` casts**

Replace ALL occurrences of `t(... as any, lang as 'ru' | 'en')` with `t(..., lang)`. This affects lines 22, 24, 29, 45, 55, 58, 61, 64.

- [ ] **Step 4: Replace hardcoded table headers**

Change line 35:
```astro
        <thead><tr><th>#</th><th>{lang === 'ru' ? 'Название' : 'Title'}</th><th>{lang === 'ru' ? 'Аудитория' : 'Audience'}</th><th>{lang === 'ru' ? 'Путь' : 'Path'}</th></tr></thead>
```
To:
```astro
        <thead><tr><th>{t('table.number', lang)}</th><th>{t('table.title', lang)}</th><th>{t('table.audience', lang)}</th><th>{t('table.path', lang)}</th></tr></thead>
```

- [ ] **Step 5: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/pages/\[lang\]/map.astro
git commit -m "fix(i18n): map.astro uses typed Lang, t() for table headers, no as any"
```

### Task 11: Fix glossary.astro — move terms to i18n

Since glossary has complex data (24 terms with bilingual fields), refactor to use a separate data module with t()-friendly access.

**Files:**
- Create: `web/src/data/glossary.ts`
- Modify: `web/src/pages/[lang]/glossary.astro`
- Modify: `web/src/i18n/ui.ts` (keys added in Task 4)

- [ ] **Step 1: Create web/src/data/glossary.ts**

```typescript
export interface GlossaryTerm {
  term_ru: string;
  term_en: string;
  def_ru: string;
  def_en: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  { term_ru: 'Сознающий узел', term_en: 'Conscious Node', def_ru: 'Поэтическое обозначение человека как центра восприятия, выбора и действия. Не утверждает наличие души и не требует метафизических допущений.', def_en: 'A poetic designation of the human being as a center of perception, choice, and action. Does not assert the presence of a soul and requires no metaphysical assumptions.' },
  // ... all 24 terms from glossary.astro lines 10-34
];
```

- [ ] **Step 2: Rewrite glossary.astro**

Replace entire file content with:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { t, type Lang } from '../../i18n/ui';
import { glossaryTerms } from '../../data/glossary';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const lang = Astro.params.lang as Lang;
---

<BaseLayout lang={lang} title={t('glossary.title', lang)}>
  <div class="content-wide">
    <h1>{t('glossary.heading', lang)}</h1>
    <p style="color:var(--color-text-secondary);margin-bottom:2rem;">
      {t('glossary.description', lang)}
    </p>
    {glossaryTerms.map((term) => (
      <div class="glossary-item">
        <dt class="glossary-term">{lang === 'ru' ? term.term_ru : term.term_en}</dt>
        <dd class="glossary-def">{lang === 'ru' ? term.def_ru : term.def_en}</dd>
      </div>
    ))}
  </div>
</BaseLayout>

<style>
  .glossary-item { margin-bottom: 1.5rem; }
  .glossary-term { font-weight: 700; font-size: 1.05rem; color: var(--color-accent); margin-bottom: 0.3rem; }
  .glossary-def { font-size: 0.95rem; color: var(--color-text-secondary); line-height: 1.6; margin-left: 0; }
</style>
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/data/glossary.ts web/src/pages/\[lang\]/glossary.astro
git commit -m "refactor(i18n): extract glossary data to separate module, use t() for page chrome"
```

---

## Phase 3: SEO

### Task 12: Create robots.txt

**Files:**
- Create: `web/public/robots.txt`

- [ ] **Step 1: Write robots.txt**

```txt
User-agent: *
Allow: /
Sitemap: https://alexandernarbaev.github.io/ThePath/sitemap.xml
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/public/robots.txt
git commit -m "feat(seo): add robots.txt with sitemap reference"
```

### Task 13: Add og:image to public/

**Files:**
- Create: `web/public/og-image.svg`

- [ ] **Step 1: Create SVG OG image (1200x630)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a14"/>
  <circle cx="600" cy="280" r="180" fill="none" stroke="#e6c17b" stroke-width="3" opacity="0.6"/>
  <path d="M600 100 Q760 280 600 540 Q440 280 600 100" fill="none" stroke="#e6c17b" stroke-width="2.5" opacity="0.8"/>
  <text x="600" y="470" text-anchor="middle" font-family="serif" font-size="48" font-weight="700" fill="#fafaf5">Спираль Сознания</text>
  <text x="600" y="520" text-anchor="middle" font-family="serif" font-size="28" fill="#e6c17b" opacity="0.8">Моральный компас для человека, гражданина и власти</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/public/og-image.svg
git commit -m "feat(seo): add OG image SVG (1200x630)"
```

### Task 14: Add SEO meta tags to BaseLayout.astro

**Files:**
- Modify: `web/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add canonical, og:image, og:url, og:locale to head**

After the existing `<meta property="og:site_name" content={siteName} />` line (line 31), add:

```astro
  <link rel="canonical" href={new URL(Astro.url.pathname, Astro.url).href} />
  <meta property="og:url" content={new URL(Astro.url.pathname, Astro.url).href} />
  <meta property="og:locale" content={lang === 'ru' ? 'ru_RU' : 'en_US'} />
  <meta property="og:image" content={`${base}/og-image.svg`} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:image" content={`${base}/og-image.svg`} />
  <meta name="robots" content="index, follow" />
```

- [ ] **Step 2: Add GoatCounter script (or placeholder)**

After the theme `<script>` at the bottom of `<head>`, add:

```astro
  <script data-goatcounter="https://spiral.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"></script>
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/layouts/BaseLayout.astro
git commit -m "feat(seo): add canonical, og:image, og:url, og:locale, robots, GoatCounter"
```

### Task 15: Add JSON-LD structured data to BaseLayout.astro

**Files:**
- Modify: `web/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add JSON-LD WebSite schema before </head>**

```astro
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: Astro.url.origin + base,
    description: pageDesc,
    inLanguage: lang,
  })} />
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/layouts/BaseLayout.astro
git commit -m "feat(seo): add JSON-LD WebSite schema"
```

### Task 16: Add JSON-LD + og:type=article to ModuleLayout.astro

**Files:**
- Modify: `web/src/layouts/ModuleLayout.astro`

- [ ] **Step 1: Add JSON-LD Article and BreadcrumbList schemas before closing </BaseLayout>**

Inside the `<BaseLayout>` content slot, add before the closing `</article>`:
```astro
      <script type="application/ld+json" set:html={JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home', lang), item: `${base}/${lang}/` },
            { '@type': 'ListItem', position: 2, name: title },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: subtitle || '',
          inLanguage: lang,
        },
      ])} />
```

- [ ] **Step 2: Override og:type to article**

Add `og:type` prop to BaseLayout or handle via a slot. Since BaseLayout hardcodes `og:type="website"`, we need to make it a prop.

Modify `BaseLayout.astro` props:
```astro
interface Props { lang: Lang; title: string; description?: string; ogType?: string; }
const { lang, title, description, ogType = 'website' } = Astro.props;
```

And change the og:type meta to:
```astro
  <meta property="og:type" content={ogType} />
```

Then in `ModuleLayout.astro`, pass `ogType="article"` to BaseLayout:
```astro
<BaseLayout lang={lang} title={title} ogType="article">
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/layouts/BaseLayout.astro web/src/layouts/ModuleLayout.astro
git commit -m "feat(seo): JSON-LD Article+BreadcrumbList, og:type=article for modules"
```

### Task 17: Add hreflang to sitemap.xml.ts

**Files:**
- Modify: `web/src/pages/sitemap.xml.ts`

- [ ] **Step 1: Rewrite sitemap to include hreflang per URL**

Replace the XML generation (lines 32-44) with:
```typescript
  const altMap = new Map<string, string[]>();
  for (const lang of langs) {
    for (const mod of modules) {
      const key = `/modules/${mod.slug}`;
      const list = altMap.get(key) || [];
      list.push(`${BASE}/${lang}/modules/${mod.slug}`);
      altMap.set(key, list);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((p) => {
    const altUrl = p.loc.replace('/ru/', '/en/').replace('/en/', '/ru/');
    const otherLang = p.loc.includes('/ru/') ? 'en' : 'ru';
    return `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="${p.loc.includes('/ru/') ? 'ru' : 'en'}" href="${p.loc}" />
    <xhtml:link rel="alternate" hreflang="${otherLang}" href="${altUrl}" />
  </url>`;
  }).join('\n')}
</urlset>`;
```

- [ ] **Step 2: Add new pages (contact, simulator) to sitemap**

Add after glossary entries (line 20):
```typescript
  pages.push({ loc: `${BASE}/ru/contact`, lastmod: now, priority: 0.6 });
  pages.push({ loc: `${BASE}/en/contact`, lastmod: now, priority: 0.6 });
  pages.push({ loc: `${BASE}/ru/simulator`, lastmod: now, priority: 0.7 });
  pages.push({ loc: `${BASE}/en/simulator`, lastmod: now, priority: 0.7 });
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/pages/sitemap.xml.ts
git commit -m "feat(seo): add hreflang to sitemap, add contact+simulator pages"
```

---

## Phase 4: Visitor Counter (GoatCounter)

### Task 18: Create VisitorCounter component

**Files:**
- Create: `web/src/components/analytics/VisitorCounter.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

export default function VisitorCounter({ lang }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    fetch(`https://spiral.goatcounter.com/counter/${encodeURIComponent(path)}.json`)
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  return (
    <span class="visitor-counter" title={t('counter.visitors', lang)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {count.toLocaleString()} {t('counter.visitors', lang)}
    </span>
  );
}
```

- [ ] **Step 2: Add needed i18n key**

Added in Task 4 as `'counter.visitors'`.

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/analytics/VisitorCounter.tsx
git commit -m "feat(analytics): VisitorCounter component using GoatCounter API"
```

### Task 19: Add VisitorCounter to Footer

**Files:**
- Modify: `web/src/components/Footer.astro`

- [ ] **Step 1: Import and add VisitorCounter**

Add before closing `</div>` of `.footer-inner`:
```astro
---
import VisitorCounter from './analytics/VisitorCounter';
---
```

And in the template, after `.footer-bottom`:
```astro
    <div class="footer-counter" style="margin-top:0.5rem;font-size:0.8rem;opacity:0.5;">
      <VisitorCounter lang={lang} client:load />
    </div>
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/Footer.astro
git commit -m "feat(analytics): add VisitorCounter to footer"
```

---

## Phase 5: Contact Form (Web3Forms)

### Task 20: Add contact i18n keys to ui.ts

**Files:**
- Modify: `web/src/i18n/ui.ts`

- [ ] **Step 1: Add keys to both languages**

Add after the glossary keys from Task 4:

```typescript
    // Contact form
    'contact.title': 'Обратная связь',
    'contact.name': 'Ваше имя',
    'contact.email': 'Email',
    'contact.subject': 'Тема',
    'contact.message': 'Сообщение',
    'contact.send': 'Отправить',
    'contact.sending': 'Отправка...',
    'contact.sent': 'Сообщение отправлено!',
    'contact.error': 'Ошибка отправки. Попробуйте позже.',
```

```typescript
    // Contact form
    'contact.title': 'Contact',
    'contact.name': 'Your name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.sending': 'Sending...',
    'contact.sent': 'Message sent!',
    'contact.error': 'Error sending. Try again later.',
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/i18n/ui.ts
git commit -m "feat(contact): add i18n keys for contact form"
```

### Task 21: Create ContactForm component

**Files:**
- Create: `web/src/components/forms/ContactForm.tsx`

- [ ] **Step 1: Write ContactForm.tsx**

```tsx
import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

export default function ContactForm({ lang }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const recipient = lang === 'ru'
    ? 'alexander.narbayev@yandex.ru'
    : 'alexander.narbayev@gmail.com';

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData();
      formData.append('access_key', (import.meta as any).env?.WEB3FORMS_KEY || '');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', `[${lang.toUpperCase()}] ${subject}`);
      formData.append('message', message);
      formData.append('from_name', 'Spiral Contact Form');
      formData.append('replyto', email);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <div class="contact-success">{t('contact.sent', lang)}</div>;
  }

  return (
    <form class="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>{t('contact.name', lang)}</span>
        <input type="text" value={name} onInput={e => setName((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.email', lang)}</span>
        <input type="email" value={email} onInput={e => setEmail((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.subject', lang)}</span>
        <input type="text" value={subject} onInput={e => setSubject((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        <span>{t('contact.message', lang)}</span>
        <textarea value={message} onInput={e => setMessage((e.target as HTMLTextAreaElement).value)} rows={5} required />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.sending', lang) : t('contact.send', lang)}
      </button>
      {status === 'error' && <p class="contact-error">{t('contact.error', lang)}</p>}
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/forms/ContactForm.tsx
git commit -m "feat(contact): ContactForm component with Web3Forms API"
```

### Task 22: Create contact page

**Files:**
- Create: `web/src/pages/[lang]/contact.astro`

- [ ] **Step 1: Write contact.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ContactForm from '../../components/forms/ContactForm';
import { t, type Lang } from '../../i18n/ui';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const lang = Astro.params.lang as Lang;
---

<BaseLayout lang={lang} title={t('contact.title', lang)}>
  <div class="content-wide" style="max-width:600px;">
    <h1>{t('contact.title', lang)}</h1>
    <ContactForm lang={lang} client:load />
  </div>
</BaseLayout>

<style>
  .contact-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
  .contact-form label { display: flex; flex-direction: column; gap: 0.25rem; }
  .contact-form label span { font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary); }
  .contact-form input, .contact-form textarea { padding: 0.6rem 0.8rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-secondary); color: var(--color-text-primary); font-size: 0.95rem; font-family: inherit; }
  .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--color-gold); }
  .contact-form button { padding: 0.75rem 2rem; background: var(--color-gold); color: #0a0a14; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; align-self: flex-start; transition: opacity 0.2s; }
  .contact-form button:hover { opacity: 0.9; }
  .contact-form button:disabled { opacity: 0.5; cursor: not-allowed; }
  .contact-success { padding: 2rem; text-align: center; color: var(--color-accent); font-size: 1.1rem; font-weight: 600; }
  .contact-error { color: #e74c3c; font-size: 0.85rem; margin: 0; }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/pages/\[lang\]/contact.astro
git commit -m "feat(contact): contact page with form"
```

### Task 23: Add contact link to Nav and Footer

**Files:**
- Modify: `web/src/components/Nav.astro`
- Modify: `web/src/components/Footer.astro`

- [ ] **Step 1: Add to Nav.astro**

After the glossary link in Nav.astro, add:
```astro
      <a href={`${base}${langPath}/contact`} class:list={['nav-link', { active: currentPath.includes('/contact') }]}>{t('nav.contact', lang)}</a>
```

- [ ] **Step 2: Add to Footer.astro**

After the `.footer-bottom` div, add:
```astro
    <div class="footer-links" style="margin-top:1rem;display:flex;gap:1.5rem;justify-content:center;font-size:0.85rem;">
      <a href={`/ThePath/${lang}/contact`} style="color:var(--color-cosmic-text-secondary);text-decoration:none;">{t('nav.contact', lang)}</a>
    </div>
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/Nav.astro web/src/components/Footer.astro
git commit -m "feat(contact): add contact link to Nav and Footer"
```

### Task 24: Create .env.example

**Files:**
- Create: `web/.env.example`

- [ ] **Step 1: Write .env.example**

```env
# Web3Forms API key for contact form
# Get yours at https://web3forms.com/
WEB3FORMS_KEY=your_key_here
```

- [ ] **Step 2: Add .env to .gitignore**

If `web/.gitignore` doesn't exist, create it:
```
.env
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/.env.example web/.gitignore
git commit -m "chore: add .env.example for Web3Forms and .gitignore"
```

### Task 25: Add env var support to astro.config.mjs

**Files:**
- Modify: `web/astro.config.mjs`

- [ ] **Step 1: Update config to pass WEB3FORMS_KEY**

Astro 5 auto-picks up `PUBLIC_*` env vars. Since we want `WEB3FORMS_KEY`, we can either prefix it `PUBLIC_WEB3FORMS_KEY` or use `define` in vite config.

Actually, for Astro, client-side env vars must be prefixed with `PUBLIC_`. But since the form sends to Web3Forms which needs the key, and Web3Forms validates by domain, we can use `PUBLIC_WEB3FORMS_KEY`. Let me update .env.example and the ContactForm component.

Update `web/.env.example`:
```env
PUBLIC_WEB3FORMS_KEY=your_key_here
```

Update ContactForm.tsx to use:
```tsx
formData.append('access_key', import.meta.env.PUBLIC_WEB3FORMS_KEY || '');
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/.env.example web/src/components/forms/ContactForm.tsx
git commit -m "fix(contact): use PUBLIC_WEB3FORMS_KEY env var for Astro compatibility"
```

---

## Phase 6: Ethical Simulator

### Task 26: Add simulator i18n keys

**Files:**
- Modify: `web/src/i18n/ui.ts`

- [ ] **Step 1: Add simulator keys**

Add to both RU and EN blocks:

```typescript
    // Simulator
    'simulator.title': 'Этический симулятор',
    'simulator.subtitle': 'Проверьте свои этические принципы в сложных ситуациях',
    'simulator.share': 'Поделиться результатом',
    'simulator.copied': 'Ссылка скопирована!',
    'simulator.start': 'Начать симуляцию',
    'simulator.next': 'Далее',
    'simulator.finish': 'Узнать результат',
    'simulator.retry': 'Пройти заново',
```

```typescript
    // Simulator
    'simulator.title': 'Ethical Simulator',
    'simulator.subtitle': 'Test your ethical principles in complex situations',
    'simulator.share': 'Share result',
    'simulator.copied': 'Link copied!',
    'simulator.start': 'Start simulation',
    'simulator.next': 'Next',
    'simulator.finish': 'See result',
    'simulator.retry': 'Retry',
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/i18n/ui.ts
git commit -m "feat(simulator): add i18n keys for ethical simulator"
```

### Task 27: Create EthicalSimulator component

**Files:**
- Create: `web/src/components/interactive/EthicalSimulator.tsx`

- [ ] **Step 1: Write EthicalSimulator.tsx**

```tsx
import { useState } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

interface Scenario {
  id: string;
  title: Record<string, string>;
  text: Record<string, string>;
  options: {
    label: Record<string, string>;
    scores: [number, number, number]; // compassion, justice, wisdom
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 'whistleblower',
    title: { ru: 'Информатор', en: 'Whistleblower' },
    text: {
      ru: 'Вы работаете в корпорации и обнаружили, что продукт наносит вред потребителям. Руководство игнорирует ваши предупреждения. Что вы сделаете?',
      en: 'You work at a corporation and discover that a product harms consumers. Management ignores your warnings. What do you do?',
    },
    options: [
      { label: { ru: 'Передам информацию журналистам анонимно', en: 'Leak info to journalists anonymously' }, scores: [3, 2, 1] },
      { label: { ru: 'Попробую ещё раз убедить руководство, собрав доказательства', en: 'Try to convince management again with evidence' }, scores: [2, 1, 3] },
      { label: { ru: 'Уволюсь и забуду — это не моя проблема', en: 'Quit and forget — not my problem' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'ai_weapon',
    title: { ru: 'Автономное оружие', en: 'Autonomous Weapon' },
    text: {
      ru: 'Вас, инженера ИИ, просят разработать алгоритм для автономного дрона, который будет принимать решения о применении силы без участия человека. Это удвоит вашу зарплату.',
      en: 'You, an AI engineer, are asked to develop an algorithm for an autonomous drone that will make lethal force decisions without human input. It doubles your salary.',
    },
    options: [
      { label: { ru: 'Откажусь — автономное оружие без человека нарушает запрет «Не убивай»', en: 'Refuse — autonomous weapons without humans violate "Do Not Kill"' }, scores: [1, 3, 2] },
      { label: { ru: 'Соглашусь, но потребую аудит безопасности', en: 'Accept but demand safety audit' }, scores: [1, 1, 1] },
      { label: { ru: 'Соглашусь — это всего лишь работа', en: 'Accept — it\'s just a job' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'migrant',
    title: { ru: 'Беженец у двери', en: 'Refugee at the Door' },
    text: {
      ru: 'Зимняя ночь. К вашему дому приходит семья беженцев и просит убежища. По закону вы не имеете права их приютить. У них ребёнок.',
      en: 'Winter night. A refugee family comes to your door asking for shelter. By law you cannot host them. They have a child.',
    },
    options: [
      { label: { ru: 'Приютить — человеческая жизнь выше закона', en: 'Shelter them — human life above law' }, scores: [3, 0, 1] },
      { label: { ru: 'Вызвать социальные службы и передать им тёплые вещи', en: 'Call social services and give them warm clothes' }, scores: [2, 2, 2] },
      { label: { ru: 'Отказать — закон есть закон', en: 'Refuse — law is law' }, scores: [0, 1, 1] },
    ],
  },
  {
    id: 'legacy',
    title: { ru: 'Наследство', en: 'Inheritance' },
    text: {
      ru: 'Вы получили крупное наследство. У вас есть выбор: вложить в экологичный бизнес (окупаемость 15 лет) или в акции нефтяной компании (окупаемость 3 года).',
      en: 'You received a large inheritance. You can invest in a sustainable business (15-year ROI) or oil company stocks (3-year ROI).',
    },
    options: [
      { label: { ru: 'Вложить в экологичный бизнес — думаю на 7 поколений', en: 'Invest in sustainable business — thinking 7 generations ahead' }, scores: [2, 1, 3] },
      { label: { ru: 'Разделить: 50% в экологию, 50% в нефть', en: 'Split: 50% sustainable, 50% oil' }, scores: [1, 2, 2] },
      { label: { ru: 'Вложить в нефть — деньги нужны сейчас', en: 'Invest in oil — need money now' }, scores: [0, 0, 0] },
    ],
  },
  {
    id: 'surveillance',
    title: { ru: 'Слежка', en: 'Surveillance' },
    text: {
      ru: 'Государство предлагает вашей IT-компании контракт на систему массовой слежки. Это спасёт компанию от банкротства и сохранит 200 рабочих мест.',
      en: 'The state offers your IT company a contract for a mass surveillance system. It will save the company from bankruptcy and preserve 200 jobs.',
    },
    options: [
      { label: { ru: 'Откажусь — массовая слежка это порабощение', en: 'Refuse — mass surveillance is enslavement' }, scores: [1, 3, 2] },
      { label: { ru: 'Приму, но встрою ограничения и публичный аудит', en: 'Accept but build in limits and public audit' }, scores: [1, 2, 3] },
      { label: { ru: 'Приму — рабочие места важнее', en: 'Accept — jobs are more important' }, scores: [0, 1, 0] },
    ],
  },
  {
    id: 'truth',
    title: { ru: 'Трудная правда', en: 'Hard Truth' },
    text: {
      ru: 'Ваш близкий друг совершил серьёзную ошибку, о которой никто не знает. Признание разрушит его карьеру и семью. Молчание сохранит статус-кво.',
      en: 'Your close friend made a serious mistake that no one knows about. Confession will destroy his career and family. Silence preserves the status quo.',
    },
    options: [
      { label: { ru: 'Поговорить с другом и убедить его признаться самому', en: 'Talk to friend and convince him to confess himself' }, scores: [2, 2, 3] },
      { label: { ru: 'Сохранить тайну — дружба важнее', en: 'Keep the secret — friendship matters more' }, scores: [2, 0, 1] },
      { label: { ru: 'Сообщить о нарушении анонимно', en: 'Report the violation anonymously' }, scores: [1, 2, 2] },
    ],
  },
];

const results = [
  {
    id: 'compassion',
    title: { ru: 'Милосердие', en: 'Compassion' },
    high: { ru: 'Вы ставите живого человека выше правил. Ваш путь — милосердие.', en: 'You put the living person above rules. Your path is compassion.' },
    low: { ru: 'Вы склонны следовать правилам даже в ущерб живым людям. Помните: закон служит человеку, а не наоборот.', en: 'You tend to follow rules even at cost to living people. Remember: law serves people, not the reverse.' },
  },
  {
    id: 'justice',
    title: { ru: 'Справедливость', en: 'Justice' },
    high: { ru: 'Вы готовы отстаивать принципы даже ценой личного комфорта. Ваш путь — справедливость.', en: 'You are ready to defend principles even at personal cost. Your path is justice.' },
    low: { ru: 'Вы склонны избегать конфронтации с системой. Иногда принципы требуют смелости.', en: 'You tend to avoid confrontation with the system. Sometimes principles require courage.' },
  },
  {
    id: 'wisdom',
    title: { ru: 'Мудрость', en: 'Wisdom' },
    high: { ru: 'Вы мыслите долгосрочно и видите сложность ситуаций. Ваш путь — мудрость.', en: 'You think long-term and see the complexity of situations. Your path is wisdom.' },
    low: { ru: 'Вы склонны к простым решениям сложных проблем. Мир сложнее бинарного выбора.', en: 'You tend toward simple solutions for complex problems. The world is more than binary choices.' },
  },
];

export default function EthicalSimulator({ lang }: Props) {
  const [step, setStep] = useState<'start' | number | 'result'>('start');
  const [scores, setScores] = useState<[number, number, number]>([0, 0, 0]);

  function handleAnswer(optionScores: [number, number, number]) {
    const newScores: [number, number, number] = [
      scores[0] + optionScores[0],
      scores[1] + optionScores[1],
      scores[2] + optionScores[2],
    ];
    setScores(newScores);

    const nextIdx = typeof step === 'number' ? step + 1 : 0;
    if (nextIdx >= scenarios.length) {
      setStep('result');
    } else {
      setStep(nextIdx);
    }
  }

  function reset() {
    setStep('start');
    setScores([0, 0, 0]);
  }

  const maxPossible = scenarios.length * 3; // max 3 points per scale per scenario

  if (step === 'start') {
    return (
      <div class="simulator">
        <h2>{t('simulator.title', lang)}</h2>
        <p class="sim-subtitle">{t('simulator.subtitle', lang)}</p>
        <button class="sim-btn" onClick={() => setStep(0)}>{t('simulator.start', lang)}</button>
      </div>
    );
  }

  if (step === 'result') {
    const hash = `c${scores[0]}-j${scores[1]}-w${scores[2]}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?s=${hash}`;
    const maxPerScale = maxPossible / 3;
    const pcts = scores.map(s => Math.round((s / maxPerScale) * 100));

    return (
      <div class="simulator sim-result">
        <h2>{t('simulator.title', lang)}</h2>
        <div class="sim-scales">
          {results.map((r, i) => (
            <div class="sim-scale">
              <div class="sim-scale-label">{r.title[lang]}</div>
              <div class="sim-scale-bar">
                <div class="sim-scale-fill" style={`width:${Math.min(pcts[i], 100)}%`} />
              </div>
              <div class="sim-scale-text">{pcts[i] >= 60 ? r.high[lang] : r.low[lang]}</div>
            </div>
          ))}
        </div>
        <div class="sim-actions">
          <button class="sim-btn" onClick={() => { navigator.clipboard.writeText(shareUrl); alert(t('simulator.copied', lang)); }}>{t('simulator.share', lang)}</button>
          <button class="sim-btn sim-btn-secondary" onClick={reset}>{t('simulator.retry', lang)}</button>
        </div>
      </div>
    );
  }

  const current = scenarios[step as number];
  return (
    <div class="simulator">
      <div class="sim-progress">{t('compass.progress', lang).replace('{current}', String((step as number) + 1)).replace('{total}', String(scenarios.length))}</div>
      <h3>{current.title[lang]}</h3>
      <p class="sim-text">{current.text[lang]}</p>
      <div class="sim-options">
        {current.options.map((opt) => (
          <button class="sim-option" onClick={() => handleAnswer(opt.scores)}>
            {opt.label[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/interactive/EthicalSimulator.tsx
git commit -m "feat(simulator): EthicalSimulator with 6 scenarios and 3-scale scoring"
```

### Task 28: Create simulator page

**Files:**
- Create: `web/src/pages/[lang]/simulator.astro`

- [ ] **Step 1: Write simulator.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import EthicalSimulator from '../../components/interactive/EthicalSimulator';
import { t, type Lang } from '../../i18n/ui';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const lang = Astro.params.lang as Lang;
---

<BaseLayout lang={lang} title={t('simulator.title', lang)}>
  <div class="content-wide" style="max-width:700px;">
    <EthicalSimulator lang={lang} client:load />
  </div>
</BaseLayout>

<style>
  .simulator { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 2rem; }
  .sim-subtitle { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
  .sim-text { color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.6; }
  .sim-progress { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 1rem; }
  .sim-options { display: flex; flex-direction: column; gap: 0.75rem; }
  .sim-option { padding: 1rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-secondary); color: var(--color-text-primary); text-align: left; cursor: pointer; font-size: 0.95rem; transition: all 0.2s; }
  .sim-option:hover { border-color: var(--color-gold); }
  .sim-btn { padding: 0.75rem 2rem; background: var(--color-gold); color: #0a0a14; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; }
  .sim-btn-secondary { background: transparent; color: var(--color-text-secondary); border: 1px solid var(--color-border); }
  .sim-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
  .sim-scales { display: flex; flex-direction: column; gap: 1.5rem; margin: 1.5rem 0; }
  .sim-scale-label { font-weight: 600; margin-bottom: 0.25rem; color: var(--color-accent); }
  .sim-scale-bar { height: 8px; background: var(--color-bg-secondary); border-radius: 4px; overflow: hidden; }
  .sim-scale-fill { height: 100%; background: var(--color-gold); border-radius: 4px; transition: width 0.5s ease; }
  .sim-scale-text { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
</style>
```

- [ ] **Step 2: Add simulator link to Nav.astro**

After the contact link in Nav:
```astro
      <a href={`${base}${langPath}/simulator`} class:list={['nav-link', { active: currentPath.includes('/simulator') }]}>{t('nav.simulator', lang)}</a>
```

Add `t` to Nav's import if needed (already imported).

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/pages/\[lang\]/simulator.astro web/src/components/Nav.astro
git commit -m "feat(simulator): simulator page with EthicalSimulator, nav link"
```

---

## Phase 7: Comments & Reactions & Share

### Task 29: Add reactions/share i18n keys

**Files:**
- Modify: `web/src/i18n/ui.ts`

- [ ] **Step 1: Add keys**

Add to both blocks:

```typescript
    // Reactions
    'reactions.title': 'Реакции',
    'reactions.like': 'Нравится',
    'reactions.dislike': 'Не нравится',
    'reactions.insight': 'Озарение',
    'reactions.gratitude': 'Благодарность',
    // Share
    'share.title': 'Поделиться',
    'share.twitter': 'Twitter',
    'share.telegram': 'Telegram',
    'share.copy': 'Копировать ссылку',
    'share.copied': 'Ссылка скопирована!',
    // Comments
    'comments.title': 'Комментарии',
    'comments.powered': 'через giscus',
```

```typescript
    // Reactions
    'reactions.title': 'Reactions',
    'reactions.like': 'Like',
    'reactions.dislike': 'Dislike',
    'reactions.insight': 'Insight',
    'reactions.gratitude': 'Gratitude',
    // Share
    'share.title': 'Share',
    'share.twitter': 'Twitter',
    'share.telegram': 'Telegram',
    'share.copy': 'Copy link',
    'share.copied': 'Link copied!',
    // Comments
    'comments.title': 'Comments',
    'comments.powered': 'via giscus',
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/i18n/ui.ts
git commit -m "feat(social): add i18n keys for reactions, share, comments"
```

### Task 30: Create Reactions component

**Files:**
- Create: `web/src/components/social/Reactions.tsx`

- [ ] **Step 1: Write Reactions.tsx**

```tsx
import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; pageId: string; }

const EMOJIS = [
  { key: 'like', emoji: '👍' },
  { key: 'dislike', emoji: '👎' },
  { key: 'insight', emoji: '💡' },
  { key: 'gratitude', emoji: '🙏' },
] as const;

export default function Reactions({ lang, pageId }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-reactions') || '{}');
    if (data[pageId]) setActive(data[pageId]);
  }, [pageId]);

  function react(key: string) {
    const newVal = active === key ? null : key;
    setActive(newVal);
    const data = JSON.parse(localStorage.getItem('spiral-reactions') || '{}');
    if (newVal) data[pageId] = newVal;
    else delete data[pageId];
    localStorage.setItem('spiral-reactions', JSON.stringify(data));
  }

  return (
    <div class="reactions">
      <span class="reactions-title">{t('reactions.title', lang)}</span>
      {EMOJIS.map(({ key, emoji }) => (
        <button
          class={`reaction-btn ${active === key ? 'active' : ''}`}
          onClick={() => react(key)}
          aria-label={t(`reactions.${key}` as any, lang)}
          title={t(`reactions.${key}` as any, lang)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/social/Reactions.tsx
git commit -m "feat(social): Reactions component with localStorage"
```

### Task 31: Create ShareButtons component

**Files:**
- Create: `web/src/components/social/ShareButtons.astro`

- [ ] **Step 1: Write ShareButtons.astro**

```astro
---
import { t, type Lang } from '../../i18n/ui';

const { lang } = Astro.props as { lang: Lang };
const url = Astro.url.href;
const title = encodeURIComponent(Astro.props.title || 'Спираль Сознания');
---

<div class="share-buttons">
  <span class="share-label">{t('share.title', lang)}</span>
  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}`}
     target="_blank" rel="noopener" class="share-link" aria-label={t('share.twitter', lang)}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  </a>
  <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${title}`}
     target="_blank" rel="noopener" class="share-link" aria-label={t('share.telegram', lang)}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  </a>
  <button class="share-link share-copy"
    onclick={`(function(){navigator.clipboard.writeText('${url}');this.classList.add('copied');setTimeout(()=>this.classList.remove('copied'),2000);}).call(this)`}
    aria-label={t('share.copy', lang)}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  </button>
</div>

<style>
  .share-buttons { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 0; border-top: 1px solid var(--color-border); margin-top: 1rem; }
  .share-label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); margin-right: 0.25rem; }
  .share-link { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; color: var(--color-text-secondary); background: var(--color-bg-secondary); border: 1px solid var(--color-border); transition: all 0.2s; cursor: pointer; }
  .share-link:hover { color: var(--color-accent); border-color: var(--color-accent); }
  .share-copy.copied { color: var(--color-gold); border-color: var(--color-gold); }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/social/ShareButtons.astro
git commit -m "feat(social): ShareButtons (Twitter, Telegram, copy link)"
```

### Task 32: Create Comments component (giscus)

**Files:**
- Create: `web/src/components/social/Comments.astro`

- [ ] **Step 1: Write Comments.astro**

```astro
---
import { t, type Lang } from '../../i18n/ui';

const { lang } = Astro.props as { lang: Lang };
---

<div class="comments-section">
  <h3>{t('comments.title', lang)}</h3>
  <p class="comments-note" style="font-size:0.8rem;color:var(--color-text-secondary);margin-bottom:1rem;">
    {t('comments.powered', lang)} — требуется GitHub аккаунт
  </p>
  <script is:inline
    src="https://giscus.app/client.js"
    data-repo="AlexandrNarbaev/ThePath"
    data-repo-id="R_kg..."
    data-category="Module Comments"
    data-category-id="DIC_kw..."
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="noborder_gray"
    data-lang={lang}
    data-loading="lazy"
    crossorigin="anonymous"
    async>
  </script>
</div>
```

- [ ] **Step 2: Note**

The `data-repo-id` and `data-category-id` values are placeholders. User needs to:
1. Enable GitHub Discussions in the repo
2. Install [giscus app](https://github.com/apps/giscus)
3. Visit [giscus.app](https://giscus.app) to get real IDs

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/components/social/Comments.astro
git commit -m "feat(social): giscus Comments component"
```

### Task 33: Add Reactions, ShareButtons, Comments to ModuleLayout

**Files:**
- Modify: `web/src/layouts/ModuleLayout.astro`

- [ ] **Step 1: Import and add social components**

Add imports at top:
```astro
import Reactions from '../components/social/Reactions';
import ShareButtons from '../components/social/ShareButtons.astro';
import Comments from '../components/social/Comments.astro';
```

- [ ] **Step 2: Add components before closing </article>**

After `<ModuleNav>`, before `</article>`:
```astro
      <Reactions lang={lang} pageId={`module-${moduleNumber}`} client:load />
      <ShareButtons lang={lang} title={title} />
      <Comments lang={lang} />
```

- [ ] **Step 3: Commit**

```bash
cd /home/alexnarbaev/ThePath && git add web/src/layouts/ModuleLayout.astro
git commit -m "feat(social): add Reactions, ShareButtons, Comments to module pages"
```

---

## Phase 8: Final Verification

### Task 34: Build and type check

- [ ] **Step 1: Run type check**

```bash
cd web && npx tsc --noEmit 2>&1 | head -30
```

Expected: No new errors (pre-existing lunr namespace error is acceptable)

- [ ] **Step 2: Run build**

```bash
cd web && npm run build 2>&1 | tail -20
```

Expected: Build succeeds, all pages generated

- [ ] **Step 3: Check generated pages**

```bash
ls -la web/dist/en/contact/index.html web/dist/ru/contact/index.html web/dist/en/simulator/index.html web/dist/ru/simulator/index.html web/dist/robots.txt web/dist/og-image.svg web/dist/sitemap.xml
```

Expected: All files exist

- [ ] **Step 4: Verify sitemap has hreflang**

```bash
grep "hreflang" web/dist/sitemap.xml | head -5
```

Expected: Multiple hreflang entries

- [ ] **Step 5: Commit any final fixes and push**

```bash
cd /home/alexnarbaev/ThePath && git add -A && git status
git commit -m "chore: final verification and build fixes"
```

---

## Summary of All Commits

1. `fix: broken 404 redirect to non-existent /[lang]/404`
2. `fix: search-overlay z-index from 100 to 101, above skip-link`
3. `fix: contradictory ThemeToggle CSS for icon-sun/icon-moon`
4. `feat(i18n): add keys for TOC, nav, daily, compass, 404, glossary`
5. `fix(i18n): TableOfContents uses t() instead of hardcoded Russian`
6. `fix(i18n): ModuleNav uses t() for prev/next labels`
7. `fix(i18n): DailyChecklist uses t() for all labels`
8. `fix(i18n): EthicalCompass reset button uses t()`
9. `fix(i18n): 404 page fully uses t() and typed Lang`
10. `fix(i18n): map.astro uses typed Lang, t() for table headers, no as any`
11. `refactor(i18n): extract glossary data to separate module, use t() for page chrome`
12. `feat(seo): add robots.txt with sitemap reference`
13. `feat(seo): add OG image SVG (1200x630)`
14. `feat(seo): add canonical, og:image, og:url, og:locale, robots, GoatCounter`
15. `feat(seo): add JSON-LD WebSite schema`
16. `feat(seo): JSON-LD Article+BreadcrumbList, og:type=article for modules`
17. `feat(seo): add hreflang to sitemap, add contact+simulator pages`
18. `feat(analytics): VisitorCounter component using GoatCounter API`
19. `feat(analytics): add VisitorCounter to footer`
20. `feat(contact): add i18n keys for contact form`
21. `feat(contact): ContactForm component with Web3Forms API`
22. `feat(contact): contact page with form`
23. `feat(contact): add contact link to Nav and Footer`
24. `chore: add .env.example for Web3Forms and .gitignore`
25. `fix(contact): use PUBLIC_WEB3FORMS_KEY env var for Astro compatibility`
26. `feat(simulator): add i18n keys for ethical simulator`
27. `feat(simulator): EthicalSimulator with 6 scenarios and 3-scale scoring`
28. `feat(simulator): simulator page with EthicalSimulator, nav link`
29. `feat(social): add i18n keys for reactions, share, comments`
30. `feat(social): Reactions component with localStorage`
31. `feat(social): ShareButtons (Twitter, Telegram, copy link)`
32. `feat(social): giscus Comments component`
33. `feat(social): add Reactions, ShareButtons, Comments to module pages`
34. `chore: final verification and build fixes`
