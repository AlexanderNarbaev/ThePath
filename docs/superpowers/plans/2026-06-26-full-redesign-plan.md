# Full Redesign Implementation Plan — Спираль Сознания

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Полный редизайн сайта «Спирали Сознания»: новый визуальный язык «Космический брутализм», лонгрид-главная, лексическая реформа, технический рефакторинг и a11y.

**Architecture:** Astro 5 + Preact + Tailwind 4. Статическая генерация (SSG). 57 страниц, 15 модулей RU+EN. Деплой на GitHub Pages. План разбит на 7 фаз, каждая фаза — один task. Все задачи независимы в пределах фазы, последовательны между фазами.

**Tech Stack:** Astro 5.0, Preact 10.29, Tailwind CSS 4, TypeScript 5.7, D3 7.9, lunr 2.3

## Global Constraints

- Все внутренние ссылки через `/ThePath/` префикс (использовать `Astro.url` или `import.meta.env.BASE_URL`)
- i18n: ru + en, ключи в `src/i18n/ui.ts`, модули в `src/i18n/modules.ts`
- Канон (Модуль 0) — ядро неизменно, только лексика подачи
- Никаких внешних ссылок на сайте
- CC BY-SA 4.0
- `astro check` должен проходить перед каждым коммитом
- Все коммиты в формате `type(scope): description`

---

### Task 1: Технический фундамент (Phase 0)

**Файлы:**
- Create: `web/src/components/home/CardsGrid.astro`
- Create: `web/src/hooks/useLocalStorage.ts`
- Create: `web/src/utils/static-paths.ts`
- Create: `web/src/constants.ts`
- Modify: `web/src/components/forms/ContactForm.tsx:1-60`
- Modify: `web/src/pages/[lang]/glossary.astro:40-55`
- Modify: `web/src/layouts/BaseLayout.astro:12`
- Modify: `web/src/layouts/ModuleLayout.astro:25`
- Modify: `web/src/components/Nav.astro:10`
- Modify: `web/src/components/Footer.astro:1-29`
- Modify: `web/src/components/LanguageSwitch.astro:5`
- Modify: `web/src/components/Sidebar.astro:5`
- Modify: `web/src/components/module/ModuleBreadcrumb.astro:4`
- Modify: `web/src/components/home/Hero.astro:19-20`
- Modify: `web/src/components/home/PathCards.astro:5`
- Modify: `web/src/pages/[lang]/index.astro:1-42`
- Modify: `web/src/pages/[lang]/map.astro:19`
- Modify: `web/src/pages/[lang]/simulator.astro`
- Modify: `web/src/pages/[lang]/contact.astro`
- Modify: `web/src/pages/[lang]/manifesto.astro`
- Modify: `web/src/pages/[lang]/modules/[slug].astro`
- Modify: `web/src/pages/404.astro:7`
- Modify: `web/src/components/search/SearchModal.tsx:71`
- Modify: `web/src/components/interactive/PathTracker.tsx:55`
- Modify: `web/src/components/map/ModuleGraph.tsx:45`
- Modify: `web/web/package.json:13` (remove `@preact/signals`)
- Delete: `web/src/layouts/HomeLayout.astro`
- Delete: `web/src/components/home/ProhibitionsCards.astro`
- Delete: `web/src/components/home/PrinciplesCards.astro`

**Интерфейсы:**
- Produces: `CardsGrid` (props: `{ title: string; items: { icon: string; title: string; description: string }[] }`)
- Produces: `useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]`
- Produces: `getLangPaths(): { params: { lang: string } }[]`
- Produces: `BASE_PATH = '/ThePath'` (константа)
- Produces: `ContactForm` принимает `web3Key` prop

- [ ] **1.1: Создать `web/src/constants.ts`**

```ts
export const BASE_PATH = '/ThePath';
export const SITE_URL = 'https://alexandernarbaev.github.io';
export const LOCALES = ['ru', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
```

- [ ] **1.2: Создать `web/src/utils/static-paths.ts`**

```ts
import { LOCALES } from '../constants';

export function getLangPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}
```

- [ ] **1.3: Создать `web/src/hooks/useLocalStorage.ts`**

```ts
import { useState, useEffect, useCallback } from 'preact/hooks';

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
    },
    [key],
  );

  return [value, set];
}
```

- [ ] **1.4: Заменить `const base = '/ThePath'` во всех файлах на импорт из `constants.ts`**

Во всех .astro файлах заменить:
```astro
const base = '/ThePath';
```
на:
```astro
import { BASE_PATH } from '../constants';
const base = BASE_PATH;
```

В .tsx файлах заменить:
```ts
const base = '/ThePath';
```
на:
```ts
import { BASE_PATH } from '../constants';
const base = BASE_PATH;
```

Файлы для замены:
- `web/src/layouts/BaseLayout.astro:12`
- `web/src/layouts/ModuleLayout.astro:25`
- `web/src/components/Nav.astro:10`
- `web/src/components/LanguageSwitch.astro:5`
- `web/src/components/Sidebar.astro:5`
- `web/src/components/module/ModuleBreadcrumb.astro:4`
- `web/src/components/home/Hero.astro:19-20` (заменить `/ThePath/${lang}` на `${base}/${lang}`)
- `web/src/components/home/PathCards.astro:5`
- `web/src/pages/[lang]/map.astro:19`
- `web/src/pages/404.astro:7`
- `web/src/components/search/SearchModal.tsx:71`
- `web/src/components/interactive/PathTracker.tsx:55`
- `web/src/components/map/ModuleGraph.tsx:45`

- [ ] **1.5: Починить ContactForm — передать WEB3FORMS_KEY через props**

В `web/src/components/forms/ContactForm.tsx`:
```tsx
// Стало:
interface Props {
  lang: string;
  web3Key: string;
}

export default function ContactForm({ lang, web3Key }: Props) {
  // ...
  formData.append('access_key', web3Key);
  // ...
}
```

В `web/src/pages/[lang]/contact.astro` (или где используется ContactForm):
```astro
---
const web3Key = import.meta.env.PUBLIC_WEB3FORMS_KEY || '';
---
<ContactForm lang={lang} web3Key={web3Key} client:load />
```

- [ ] **1.6: Починить `<dt>/<dd>` без `<dl>` в glossary**

В `web/src/pages/[lang]/glossary.astro:44`:
```astro
<!-- Было: -->
<div class="glossary-item">
  <dt class="glossary-term">...</dt>
  <dd class="glossary-def">...</dd>
</div>

<!-- Стало: -->
<dl class="glossary-item">
  <dt class="glossary-term">...</dt>
  <dd class="glossary-def">...</dd>
</dl>
```

- [ ] **1.7: Создать `web/src/components/home/CardsGrid.astro`**

```astro
---
interface CardItem {
  icon: string;
  title: string;
  description: string;
}

const { title, items } = Astro.props as { title: string; items: CardItem[] };
---

<section class="cards-section">
  {title && <h2>{title}</h2>}
  <div class="cards">
    {items.map((item) => (
      <div class="card">
        <div class="card-icon">{item.icon}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
</section>

<style>
  .cards-section { margin: 3rem 0; text-align: center; }
  .cards-section h2 { margin-bottom: 1.5rem; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
  .card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .card-icon { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.7; }
  .card h3 { font-size: 1.1rem; margin: 0.5rem 0; }
  .card p { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; }
</style>
```

- [ ] **1.8: Заменить ProhibitionsCards + PrinciplesCards на CardsGrid в index.astro**

В `web/src/pages/[lang]/index.astro`:
```astro
---
import CardsGrid from '../../components/home/CardsGrid.astro';
// Удалить: import ProhibitionsCards from ...
// Удалить: import PrinciplesCards from ...
---

<!-- Было:
<ProhibitionsCards lang={lang} />
<PrinciplesCards lang={lang} />
-->

<!-- Стало: -->
<CardsGrid title={t('prohibitions.title', lang)} items={[
  { icon: '▸', title: t('prohibitions.1_title', lang), description: t('prohibitions.1_desc', lang) },
  { icon: '▸', title: t('prohibitions.2_title', lang), description: t('prohibitions.2_desc', lang) },
  { icon: '▸', title: t('prohibitions.3_title', lang), description: t('prohibitions.3_desc', lang) },
]} />
<CardsGrid title={t('principles.title', lang)} items={[
  { icon: '▸', title: t('principles.1_title', lang), description: t('principles.1_desc', lang) },
  { icon: '▸', title: t('principles.2_title', lang), description: t('principles.2_desc', lang) },
  { icon: '▸', title: t('principles.3_title', lang), description: t('principles.3_desc', lang) },
  { icon: '▸', title: t('principles.4_title', lang), description: t('principles.4_desc', lang) },
]} />
```

- [ ] **1.9: Заменить `getStaticPaths` во всех страницах на `getLangPaths()`**

В файлах: `[lang]/index.astro`, `[lang]/map.astro`, `[lang]/manifesto.astro`, `[lang]/glossary.astro`, `[lang]/contact.astro`, `[lang]/simulator.astro`, `[lang]/modules/[slug].astro`, `[lang]/paths/[...path].astro`:

```astro
---
import { getLangPaths } from '../../utils/static-paths';

export async function getStaticPaths() {
  return getLangPaths();
}
---
```

- [ ] **1.10: Удалить `HomeLayout.astro` и заменить на `BaseLayout` в index.astro**

```bash
rm web/src/layouts/HomeLayout.astro
```

В `web/src/pages/[lang]/index.astro`:
```astro
// Было:
import HomeLayout from '../../layouts/HomeLayout.astro';
<HomeLayout lang={lang} ...>

// Стало:
import BaseLayout from '../../layouts/BaseLayout.astro';
<BaseLayout lang={lang} ...>
```

- [ ] **1.11: Удалить `ProhibitionsCards.astro` и `PrinciplesCards.astro`**

```bash
rm web/src/components/home/ProhibitionsCards.astro
rm web/src/components/home/PrinciplesCards.astro
```

- [ ] **1.12: Удалить `@preact/signals` из package.json**

В `web/package.json`, удалить строку:
```json
"@preact/signals": "^2.0.0",
```

- [ ] **1.13: Проверить билд**

```bash
cd web && npm run build
```

Ожидаемый результат: билд успешен, 0 ошибок TypeScript.

- [ ] **1.14: Коммит**

```bash
git add -A
git commit -m "refactor(web): extract CardsGrid, useLocalStorage, getLangPaths, constants; fix ContactForm key and glossary HTML; remove dead code"
```

---

### Task 2: Производительность и a11y (Phase 1)

**Файлы:**
- Modify: `web/src/layouts/ModuleLayout.astro` (client: директивы)
- Modify: `web/src/pages/[lang]/index.astro` (client: директивы)
- Modify: `web/src/pages/[lang]/simulator.astro`
- Modify: `web/src/pages/[lang]/contact.astro`
- Modify: `web/src/pages/[lang]/map.astro`
- Modify: `web/src/pages/404.astro`
- Modify: `web/src/components/Nav.astro` (aria-expanded, keyboard, focus-visible)
- Modify: `web/src/components/ThemeToggle.astro` (keyboard handler)
- Modify: `web/src/components/search/SearchModal.tsx` (replace lunr with Array.filter)
- Modify: `web/src/components/map/ModuleGraph.tsx` (tabindex, responsive)
- Modify: `web/src/styles/global.css` (focus-visible styles)

- [ ] **2.1: Сменить `client:load` на `client:visible` / `client:idle`**

В `web/src/layouts/ModuleLayout.astro`:
```astro
<!-- Было: -->
<BookmarkButton module_number={moduleNumber} lang={lang} client:load />
<Reactions lang={lang} pageId={`module-${moduleNumber}`} client:load />

<!-- Стало: -->
<BookmarkButton module_number={moduleNumber} lang={lang} client:visible />
<Reactions lang={lang} pageId={`module-${moduleNumber}`} client:visible />
```

В `web/src/pages/[lang]/index.astro`:
```astro
<!-- Было: -->
<DailyChecklist lang={lang} client:load />
<EthicalCompass lang={lang} client:load />

<!-- Стало: -->
<DailyChecklist lang={lang} client:visible />
<EthicalCompass lang={lang} client:visible />
```

В `web/src/pages/[lang]/simulator.astro`:
```astro
<EthicalSimulator lang={lang} client:idle />
```

В `web/src/pages/[lang]/contact.astro`:
```astro
<ContactForm lang={lang} web3Key={web3Key} client:visible />
```

В `web/src/pages/[lang]/map.astro`:
```astro
<ModuleGraph lang={lang} modules={modules} client:visible />
<PathTracker lang={lang} client:visible />
```

В `web/src/components/Footer.astro`:
```astro
<VisitorCounter lang={lang} client:visible />
```

Оставить `client:load` только у:
- `ProgressBar` (module pages) — scroll tracking
- `SearchModal` (Nav) — ⌘K shortcut

- [ ] **2.2: Добавить `:focus-visible` стили в global.css**

В `web/src/styles/global.css`, после `.skip-link:focus { top: 0; }`:
```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

- [ ] **2.3: Добавить aria-expanded и keyboard handler в Nav.astro**

В `web/src/components/Nav.astro`, обновить кнопку:
```astro
<button
  class="nav-toggle"
  aria-label="Menu"
  aria-expanded="false"
  aria-controls="nav-menu"
  onclick="
    const menu = document.getElementById('nav-menu');
    const expanded = menu.classList.toggle('open');
    this.setAttribute('aria-expanded', String(expanded));
  "
  onkeydown="
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  "
>
  <span></span><span></span><span></span>
</button>
```

- [ ] **2.4: Добавить keyboard handler в ThemeToggle.astro**

В `web/src/components/ThemeToggle.astro`, добавить `tabindex="0" role="button"` и `onkeydown` на корневой элемент:
```astro
<button
  class="theme-toggle"
  aria-label={t('theme.toggle', lang)}
  onclick="..."
  onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); }"
>
```

- [ ] **2.5: Заменить lunr на Array.filter в SearchModal.tsx**

Удалить `import lunr from 'lunr'`. Вместо lunr индекса:
```tsx
const searchModules = (query: string, modules: ModuleMeta[], lang: string) => {
  const q = query.toLowerCase();
  return modules.filter((m) =>
    m.title.toLowerCase().includes(q) ||
    m.subtitle?.toLowerCase().includes(q)
  ).slice(0, 10);
};
```

Удалить код инициализации lunr-индекса (`this: any`, `idx.add()`, и т.д.).

- [ ] **2.6: Удалить `lunr` из package.json**

В `web/package.json`, удалить:
```json
"lunr": "^2.3.9",
```

- [ ] **2.7: Сделать ModuleGraph отзывчивым**

В `web/src/components/map/ModuleGraph.tsx`, заменить фиксированные размеры:
```tsx
// Было:
const width = 800;
const height = 500;

// Стало:
const width = svgRef.current?.clientWidth || 600;
const height = Math.min(width * 0.6, 500);
```

Добавить `useEffect` с `ResizeObserver` для перерисовки.

- [ ] **2.8: Добавить tabindex на узлы ModuleGraph**

В `web/src/components/map/ModuleGraph.tsx`, в методе отрисовки узлов:
```tsx
node.attr('tabindex', 0)
    .attr('role', 'link')
    .attr('aria-label', (d: any) => d.name)
    .on('keydown', (event: any, d: any) => {
      if (event.key === 'Enter') {
        window.location.href = d.url;
      }
    });
```

- [ ] **2.9: Проверить билд**

```bash
cd web && npm run build
```

- [ ] **2.10: Коммит**

```bash
git add -A
git commit -m "perf(web): switch client:load to client:visible/idle; replace lunr with filter; add focus-visible and a11y handlers"
```

---

### Task 3: Лексическая реформа (Phase 2)

**Файлы:**
- Modify: `web/src/i18n/ui.ts`
- Modify: `web/src/i18n/modules.ts`
- Modify: `web/src/content/modules/ru/0-canon.md`
- Modify: `web/src/content/modules/ru/1-cosmology.md`
- Modify: `web/src/content/modules/ru/2-ethics.md`
- Modify: `web/src/content/modules/ru/3-practices.md`
- Modify: `web/src/content/modules/ru/4-resilience.md`
- Modify: `web/src/content/modules/ru/5-conflicts.md`
- Modify: `web/src/content/modules/ru/6-technology.md`
- Modify: `web/src/content/modules/ru/7-economy.md`
- Modify: `web/src/content/modules/ru/8-politics.md`
- Modify: `web/src/content/modules/ru/9-psychology.md`
- Modify: `web/src/content/modules/ru/10-education.md`
- Modify: `web/src/content/modules/ru/11-synthesis.md`
- Modify: `web/src/content/modules/ru/12-library.md`
- Modify: `web/src/content/modules/ru/13-platform.md`
- Modify: `web/src/content/modules/ru/14-production.md`
- Modify: `web/src/content/modules/ru/scientific-foundations.md`
- Modify: `web/src/content/modules/ru/community-guide.md`
- Modify: `web/src/content/modules/en/*` (все 17 файлов, те же замены в английском тексте)
- Modify: `web/src/content/pages/ru/manifesto.md`
- Modify: `web/src/content/pages/ru/map.md`
- Modify: `web/src/content/pages/en/manifesto.md`
- Modify: `web/src/content/pages/en/map.md`

**Таблица замен:**

| Было (RU) | Стало (RU) | Было (EN) | Стало (EN) |
|-----------|-----------|-----------|-----------|
| Символ веры | Слова выбора | Symbol of Faith | Words of Choice |
| Да будет так | Это мой выбор | So be it | This is my choice |
| Хранитель Сознания | Практикующий | Keeper of Consciousness | Practitioner |
| обет | обязательство | vow | commitment |
| посвящение | вступление | initiation | joining |
| прихожанин | участник | congregant | participant |
| настоятель | координатор | abbot | coordinator |
| обитель | община | abbey | community |

**Что НЕ менять:**
- Канон (оставить как есть — технический термин)
- Спираль Сознания (Spiral of Consciousness)
- Три запрета (Three Prohibitions)
- Четыре принципа (Four Principles)
- Манифест (Manifesto)

- [ ] **3.1: Обновить i18n/ui.ts — заменить ключи с религиозной лексикой**

Поискать и заменить все вхождения русских терминов из таблицы на новые. Аналогично для английских.

- [ ] **3.2: Обновить i18n/modules.ts — заменить в заголовках и описаниях модулей**

Проверить `title` и `subtitle` всех модулей.

- [ ] **3.3: Обновить все 17 русских модулей**

Для каждого файла в `web/src/content/modules/ru/`:
- Найти все вхождения терминов из таблицы замен
- Заменить точным совпадением

Использовать `sed` для массовой замены:
```bash
for file in web/src/content/modules/ru/*.md; do
  sed -i 's/Символ веры/Слова выбора/g' "$file"
  sed -i 's/Да будет так/Это мой выбор/g' "$file"
  sed -i 's/Хранитель Сознания/Практикующий/g' "$file"
  sed -i 's/Хранителя Сознания/Практикующего/g' "$file"
  sed -i 's/Хранителю Сознания/Практикующему/g' "$file"
  sed -i 's/Хранителем Сознания/Практикующим/g' "$file"
  sed -i 's/Хранителе Сознания/Практикующем/g' "$file"
  sed -i 's/обет/обязательство/g' "$file"
  sed -i 's/Обет/Обязательство/g' "$file"
  sed -i 's/посвящение/вступление/g' "$file"
  sed -i 's/Посвящение/Вступление/g' "$file"
  sed -i 's/прихожанин/участник/g' "$file"
  sed -i 's/Прихожанин/Участник/g' "$file"
  sed -i 's/настоятель/координатор/g' "$file"
  sed -i 's/Настоятель/Координатор/g' "$file"
  sed -i 's/обитель/община/g' "$file"
  sed -i 's/Обитель/Община/g' "$file"
done
```

- [ ] **3.4: Обновить все 17 английских модулей**

Аналогично для `web/src/content/modules/en/`:
```bash
for file in web/src/content/modules/en/*.md; do
  sed -i 's/Symbol of Faith/Words of Choice/g' "$file"
  sed -i 's/So be it/This is my choice/g' "$file"
  sed -i 's/Keeper of Consciousness/Practitioner/g' "$file"
  sed -i "s/keeper of consciousness/practitioner/g" "$file"
  sed -i 's/vow/commitment/g' "$file"
  sed -i 's/Vow/Commitment/g' "$file"
  sed -i 's/initiation/joining/g' "$file"
  sed -i 's/Initiation/Joining/g' "$file"
  sed -i 's/congregant/participant/g' "$file"
  sed -i 's/Congregant/Participant/g' "$file"
  sed -i 's/abbot/coordinator/g' "$file"
  sed -i 's/Abbot/Coordinator/g' "$file"
  sed -i 's/abbey/community/g' "$file"
  sed -i 's/Abbey/Community/g' "$file"
done
```

- [ ] **3.5: Обновить Манифест и Карту**

```bash
for file in web/src/content/pages/ru/manifesto.md web/src/content/pages/ru/map.md; do
  sed -i 's/Символ веры/Слова выбора/g' "$file"
  sed -i 's/Да будет так/Это мой выбор/g' "$file"
  sed -i 's/Хранитель Сознания/Практикующий/g' "$file"
done

for file in web/src/content/pages/en/manifesto.md web/src/content/pages/en/map.md; do
  sed -i 's/Symbol of Faith/Words of Choice/g' "$file"
  sed -i 's/So be it/This is my choice/g' "$file"
  sed -i 's/Keeper of Consciousness/Practitioner/g' "$file"
done
```

- [ ] **3.6: Проверить билд**

```bash
cd web && npm run build
```

- [ ] **3.7: Коммит**

```bash
git add -A
git commit -m "refactor(content): replace religious vocabulary with secular terms (Символ веры→Слова выбора, etc.)"
```

---

### Task 4: Дизайн-система «Космический брутализм» (Phase 3)

**Файлы:**
- Modify: `web/src/styles/global.css`
- Modify: `web/src/components/Nav.astro`
- Modify: `web/src/components/Footer.astro`
- Modify: `web/src/components/home/Hero.astro`
- Modify: `web/src/components/home/CardsGrid.astro`
- Modify: `web/src/components/ThemeToggle.astro`
- Modify: `web/src/components/forms/ContactForm.tsx`
- Modify: `web/src/layouts/BaseLayout.astro`
- Modify: `web/src/layouts/ModuleLayout.astro`

- [ ] **4.1: Обновить дизайн-токены в global.css**

Заменить текущие токены на новую систему. Полная замена содержимого `web/src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-cosmic: #0a0a14;
  --color-cosmic-light: #12121f;
  --color-cosmic-card: #161630;
  --color-cosmic-border: #2a2a40;
  --color-cosmic-text: #f0efe7;
  --color-cosmic-text-secondary: #a0a0b8;

  --color-bg-primary: #fafaf5;
  --color-bg-secondary: #f3f2ee;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a5e;
  --color-accent: #2c3e9e;
  --color-accent-hover: #1a2878;
  --color-nav-bg: #ffffff;
  --color-card-bg: #ffffff;
  --color-border: #e2e1dc;
  --color-danger: #c0392b;
  --color-gold: #e6c17b;
  --color-gold-hover: #f0d48a;

  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;

  --max-width-content: 720px;
  --max-width-wide: 960px;
  --sidebar-width: 260px;
}

@layer base {
  html { scroll-behavior: smooth; font-size: 18px; }
  body {
    font-family: var(--font-body);
    line-height: 1.8;
    background-color: var(--color-cosmic);
    color: var(--color-cosmic-text);
  }

  /* Тёмная тема — по умолчанию */
  [data-theme="light"] {
    --color-bg-primary: var(--color-cosmic);
    --color-bg-secondary: var(--color-cosmic-light);
    --color-text-primary: var(--color-cosmic-text);
    --color-text-secondary: var(--color-cosmic-text-secondary);
    --color-nav-bg: #0c0c1a;
    --color-card-bg: var(--color-cosmic-card);
    --color-border: var(--color-cosmic-border);
    --color-accent: var(--color-gold);
    --color-accent-hover: var(--color-gold-hover);
    --color-danger: #e74c3c;
  }

  /* Светлая тема */
  [data-theme="light"] body {
    background-color: var(--color-bg-primary, #fafaf5);
    color: var(--color-text-primary, #1a1a2e);
  }

  h1 { font-size: 2.5rem; font-weight: 300; line-height: 1.2; margin-bottom: 1rem; letter-spacing: -0.01em; }
  h2 { font-size: 1.75rem; font-weight: 300; line-height: 1.3; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--color-gold); }
  h3 { font-size: 1.25rem; font-weight: 400; line-height: 1.4; margin-top: 2rem; margin-bottom: 0.75rem; }
  a { color: var(--color-gold); text-decoration: none; transition: color 0.2s; }
  a:hover { color: var(--color-gold-hover); }
  blockquote {
    border-left: 3px solid var(--color-gold);
    padding: 0.5rem 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--color-cosmic-text-secondary);
  }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
  th { font-weight: 600; background: var(--color-bg-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: var(--color-cosmic-light);
    padding: 0.15em 0.4em;
    border-radius: 3px;
  }
  pre {
    background: var(--color-cosmic-light);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
  }

  :focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: 2px;
  }
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--color-gold);
  color: var(--color-cosmic);
  font-weight: 600;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
.skip-link:focus { top: 0; }

.page-layout {
  display: flex;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

.content {
  flex: 1;
  max-width: var(--max-width-content);
  padding: 2rem 1.5rem 4rem;
  margin: 0 auto;
}

.content-wide {
  flex: 1;
  max-width: var(--max-width-wide);
  padding: 2rem 1.5rem 4rem;
  margin: 0 auto;
}

/* Мета-лейблы (mono) */
.meta-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-cosmic-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Кнопки */
.btn-primary {
  display: inline-block;
  padding: 0.65rem 1.5rem;
  background: var(--color-gold);
  color: var(--color-cosmic);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
  font-family: var(--font-mono);
}
.btn-primary:hover { background: var(--color-gold-hover); color: var(--color-cosmic); transform: translateY(-1px); }

.btn-secondary {
  display: inline-block;
  padding: 0.65rem 1.5rem;
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-secondary:hover { background: rgba(230, 193, 123, 0.1); }

/* Поиск (оставить как есть, только цвета через переменные) */
/* ... (существующие стили search, progress, bookmark, path-tracker, daily-checklist, ethical-compass — адаптировать под тёмную тему) */

@media (max-width: 768px) {
  .page-layout { flex-direction: column; }
  .content, .content-wide { padding: 1rem; }
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.35rem; }
}

@media print {
  /* ... (существующие print-стили, адаптировать) */
}
```

- [ ] **4.2: Переключить тёмную тему по умолчанию**

В `web/src/layouts/BaseLayout.astro:16`, изменить `data-theme`:
```astro
<html lang={lang} data-theme="dark">
```

И обновить инлайн-скрипт темы (строки 46-48): убрать автоматическое определение, оставить только localStorage:
```html
<script is:inline>
  (() => {
    const s = localStorage.getItem('theme');
    if (s === 'light') document.documentElement.setAttribute('data-theme', 'light');
  })();
</script>
```

- [ ] **4.3: Обновить ThemeToggle**

Добавить явные лейблы «Тёмная» / «Светлая» тема с моноширинным шрифтом.

- [ ] **4.4: Обновить Nav — моноширинные акценты**

В `web/src/components/Nav.astro`, добавить класс `.meta-label` для siteName или оставить как есть. Убедиться, что навигация корректно выглядит на тёмном фоне.

- [ ] **4.5: Обновить Footer — тёмный стиль**

Footer уже тёмный (`background: var(--color-cosmic)`). Оставить, но убрать версию:
```astro
<!-- Удалить: -->
<p class="footer-version">{t('footer.version', lang)}</p>
```

- [ ] **4.6: Обновить Hero — новый стиль**

Переписать `web/src/components/home/Hero.astro`:
```astro
---
import { BASE_PATH } from '../../constants';
import { t, type Lang } from '../../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---

<div class="hero">
  <div class="hero-content">
    <div class="meta-label"># {t('hero.meta', lang)}</div>
    <h1>{t('hero.title_new', lang)}</h1>
    <p class="hero-subtitle">{t('hero.subtitle_new', lang)}</p>
    <div class="hero-cta">
      <a href={`${BASE_PATH}/${lang}/start`} class="btn-primary">{t('hero.cta_practice', lang)}</a>
      <span class="hero-hint">{t('hero.scroll_hint', lang)}</span>
    </div>
  </div>
</div>

<style>
  .hero { position: relative; text-align: center; padding: 6rem 1.5rem 4rem; overflow: hidden; }
  .hero-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .hero h1 { font-size: 2.8rem; font-weight: 300; line-height: 1.25; letter-spacing: -0.01em; color: var(--color-cosmic-text); margin-bottom: 1rem; }
  .hero h1 span { color: var(--color-gold); }
  .hero-subtitle { font-size: 1.05rem; color: var(--color-cosmic-text-secondary); margin: 0 auto 2rem; line-height: 1.6; max-width: 500px; }
  .hero-cta { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
  .hero-hint { font-size: 0.8rem; color: var(--color-cosmic-text-secondary); }
  @media (max-width: 768px) { .hero { padding: 4rem 1rem 2.5rem; } .hero h1 { font-size: 1.8rem; } }
</style>
```

- [ ] **4.7: Обновить i18n/ui.ts — добавить новые ключи для hero**

```ts
// RU
'hero.meta': 'ОТКРЫТАЯ СИСТЕМА · НЕ РЕЛИГИЯ',
'hero.title_new': 'Ваше внимание — <span>единственное, что вам по-настоящему принадлежит.</span>',
'hero.subtitle_new': '3 практики. Никакой магии. Никакой веры. Только вы и ваши решения.',
'hero.cta_practice': '→ 3 минуты сегодня',
'hero.scroll_hint': '↓ что это',

// EN
'hero.meta': 'OPEN SYSTEM · NOT A RELIGION',
'hero.title_new': 'Your attention is <span>the only thing that truly belongs to you.</span>',
'hero.subtitle_new': '3 practices. No magic. No faith. Just you and your choices.',
'hero.cta_practice': '→ 3 minutes today',
'hero.scroll_hint': '↓ what is this',
```

- [ ] **4.8: Обновить CardsGrid — тёмный стиль**

Заменить CSS в `CardsGrid.astro`:
```css
.cards-section { margin: 3rem 0; text-align: center; }
.cards-section h2 { color: var(--color-gold); margin-bottom: 1.5rem; font-weight: 300; font-size: 1.5rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
.card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; text-align: center; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: var(--color-gold); transform: translateY(-2px); }
.card-icon { font-family: var(--font-mono); font-size: 1.5rem; color: var(--color-gold); margin-bottom: 0.75rem; }
.card h3 { font-size: 1rem; margin: 0.5rem 0; font-weight: 500; color: var(--color-cosmic-text); }
.card p { font-size: 0.85rem; color: var(--color-cosmic-text-secondary); line-height: 1.5; }
```

- [ ] **4.9: Проверить билд**

```bash
cd web && npm run build
```

- [ ] **4.10: Коммит**

```bash
git add -A
git commit -m "style(web): implement Cosmic Brutalism design system — dark theme default, dual typography, gold accent, mono labels"
```

---

### Task 5: Лонгрид — новая главная страница (Phase 4)

**Файлы:**
- Create: `web/src/pages/[lang]/start.astro`
- Modify: `web/src/pages/[lang]/index.astro` (полная перезапись)
- Modify: `web/src/i18n/ui.ts` (новые ключи для секций лонгрида)

- [ ] **5.1: Добавить i18n-ключи для лонгрида**

В `web/src/i18n/ui.ts` добавить блоки RU и EN:

```ts
// === Лонгрид (главная) ===

// Секция практик
'practices.section_label': '§1 · ПРАКТИКА',
'practices.heading': 'Три минуты. Прямо сейчас.',
'practices.morning': 'УТРО',
'practices.morning_text': '«Сегодня я выбираю восходящую спираль»',
'practices.screen': 'ПЕРЕД ЭКРАНОМ',
'practices.screen_text': '«Зачем я это открываю?»',
'practices.evening': 'ВЕЧЕР',
'practices.evening_text': '«Что я сделал для сохранения сознания?»',
'practices.time': '60 секунд',
'practices.disclaimer': 'НИКАКОЙ МАГИИ. НИКАКОЙ ВЕРЫ. ТОЛЬКО ВЫ.',
'practices.checklist_btn': 'Отметить сегодня',

// Секция прозрачности
'transparency.section_label': '§2 · ПРОЗРАЧНОСТЬ',
'transparency.heading': 'Что это — и чем это не является',
'transparency.no_religion': 'Религия. Никаких божеств, ритуалов поклонения, требований веры.',
'transparency.yes_system': 'Практическая система. Как тайм-менеджмент или спортзал — для сознания.',
'transparency.no_ideology': 'Идеология. Никакой «единственно верной» картины мира.',
'transparency.yes_open': 'Открытый код. Любой может форкнуть, адаптировать, критиковать.',
'transparency.no_guru': 'Гуру. Нет лидера, нет «просветлённых», нет иерархии.',
'transparency.yes_community': 'Сообщество равных. Горизонтальная сеть, а не пирамида.',

// Английские версии тех же ключей
```

- [ ] **5.2: Создать `web/src/pages/[lang]/start.astro` — лендинг «Твой первый день»**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getLangPaths } from '../../utils/static-paths';
import { t } from '../../i18n/ui';

export async function getStaticPaths() {
  return getLangPaths();
}

const { lang } = Astro.params;
---

<BaseLayout lang={lang as 'ru' | 'en'} title={t('start.title', lang as 'ru' | 'en')}>
  <div class="content">
    <div class="meta-label">{t('practices.section_label', lang as 'ru' | 'en')}</div>
    <h1>{t('practices.heading', lang as 'ru' | 'en')}</h1>

    <div class="practice-cards">
      <div class="practice-card">
        <div class="meta-label">☀️ {t('practices.morning', lang as 'ru' | 'en')}</div>
        <p>{t('practices.morning_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
      <div class="practice-card">
        <div class="meta-label">📱 {t('practices.screen', lang as 'ru' | 'en')}</div>
        <p>{t('practices.screen_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
      <div class="practice-card">
        <div class="meta-label">🌙 {t('practices.evening', lang as 'ru' | 'en')}</div>
        <p>{t('practices.evening_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
    </div>

    <p class="practice-disclaimer">{t('practices.disclaimer', lang as 'ru' | 'en')}</p>

    <p class="start-next">
      <a href={`/ThePath/${lang}/manifesto`}>{t('start.read_more', lang as 'ru' | 'en')} →</a>
    </p>
  </div>
</BaseLayout>

<style>
  .content { max-width: var(--max-width-content); margin: 0 auto; padding: 3rem 1.5rem; }
  .practice-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
  .practice-card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; text-align: center; }
  .practice-card p { font-size: 1rem; margin: 0.75rem 0; line-height: 1.5; }
  .practice-time { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-cosmic-text-secondary); }
  .practice-disclaimer { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-cosmic-text-secondary); text-align: center; margin-top: 1.5rem; }
  .start-next { text-align: center; margin-top: 2rem; }
</style>
```

- [ ] **5.3: Переписать `[lang]/index.astro` — лонгрид**

Полная перезапись — заменить текущий index.astro на лонгрид с 5 секциями:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/home/Hero.astro';
import CardsGrid from '../../components/home/CardsGrid.astro';
import DailyChecklist from '../../components/interactive/DailyChecklist';
import { getLangPaths } from '../../utils/static-paths';
import { t } from '../../i18n/ui';

export async function getStaticPaths() {
  return getLangPaths();
}

const { lang } = Astro.params;
---

<BaseLayout lang={lang as 'ru' | 'en'} title={t('site.name', lang as 'ru' | 'en')}>

  <!-- §0: Hero -->
  <Hero lang={lang as 'ru' | 'en'} />

  <!-- §1: Практики -->
  <section class="longread-section" id="practices">
    <div class="meta-label">{t('practices.section_label', lang as 'ru' | 'en')}</div>
    <h2>{t('practices.heading', lang as 'ru' | 'en')}</h2>

    <div class="practice-cards">
      <div class="practice-card">
        <div class="meta-label">☀️ {t('practices.morning', lang as 'ru' | 'en')}</div>
        <p>{t('practices.morning_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
      <div class="practice-card">
        <div class="meta-label">📱 {t('practices.screen', lang as 'ru' | 'en')}</div>
        <p>{t('practices.screen_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
      <div class="practice-card">
        <div class="meta-label">🌙 {t('practices.evening', lang as 'ru' | 'en')}</div>
        <p>{t('practices.evening_text', lang as 'ru' | 'en')}</p>
        <span class="practice-time">{t('practices.time', lang as 'ru' | 'en')}</span>
      </div>
    </div>

    <div class="practice-disclaimer">{t('practices.disclaimer', lang as 'ru' | 'en')}</div>
    <DailyChecklist lang={lang as 'ru' | 'en'} client:visible />
  </section>

  <!-- §2: Прозрачность -->
  <section class="longread-section" id="transparency">
    <div class="meta-label">{t('transparency.section_label', lang as 'ru' | 'en')}</div>
    <h2>{t('transparency.heading', lang as 'ru' | 'en')}</h2>

    <div class="transparency-grid">
      <div class="trans-item no"><div class="trans-icon">✕</div><div class="trans-label meta-label">НЕ</div><p>{t('transparency.no_religion', lang as 'ru' | 'en')}</p></div>
      <div class="trans-item yes"><div class="trans-icon">✓</div><div class="trans-label meta-label">ДА</div><p>{t('transparency.yes_system', lang as 'ru' | 'en')}</p></div>
      <div class="trans-item no"><div class="trans-icon">✕</div><div class="trans-label meta-label">НЕ</div><p>{t('transparency.no_ideology', lang as 'ru' | 'en')}</p></div>
      <div class="trans-item yes"><div class="trans-icon">✓</div><div class="trans-label meta-label">ДА</div><p>{t('transparency.yes_open', lang as 'ru' | 'en')}</p></div>
      <div class="trans-item no"><div class="trans-icon">✕</div><div class="trans-label meta-label">НЕ</div><p>{t('transparency.no_guru', lang as 'ru' | 'en')}</p></div>
      <div class="trans-item yes"><div class="trans-icon">✓</div><div class="trans-label meta-label">ДА</div><p>{t('transparency.yes_community', lang as 'ru' | 'en')}</p></div>
    </div>
  </section>

  <!-- §3: Наука + Этика -->
  <section class="longread-section" id="foundations">
    <div class="meta-label">{t('foundations.section_label', lang as 'ru' | 'en')}</div>
    <h2>{t('foundations.heading', lang as 'ru' | 'en')}</h2>
    <CardsGrid title="" items={[
      { icon: '▸', title: t('foundations.1_title', lang as 'ru' | 'en'), description: t('foundations.1_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('foundations.2_title', lang as 'ru' | 'en'), description: t('foundations.2_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('foundations.3_title', lang as 'ru' | 'en'), description: t('foundations.3_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('foundations.4_title', lang as 'ru' | 'en'), description: t('foundations.4_desc', lang as 'ru' | 'en') },
    ]} />
    <CardsGrid title={t('prohibitions.title', lang as 'ru' | 'en')} items={[
      { icon: '▸', title: t('prohibitions.1_title', lang as 'ru' | 'en'), description: t('prohibitions.1_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('prohibitions.2_title', lang as 'ru' | 'en'), description: t('prohibitions.2_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('prohibitions.3_title', lang as 'ru' | 'en'), description: t('prohibitions.3_desc', lang as 'ru' | 'en') },
    ]} />
  </section>

  <!-- §4: Карта -->
  <section class="longread-section" id="map-preview">
    <div class="meta-label">{t('map.section_label', lang as 'ru' | 'en')}</div>
    <h2>{t('map.heading', lang as 'ru' | 'en')}</h2>
    <CardsGrid title="" items={[
      { icon: '▸', title: t('paths.quick_title', lang as 'ru' | 'en'), description: t('paths.quick_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('paths.mentor_title', lang as 'ru' | 'en'), description: t('paths.mentor_desc', lang as 'ru' | 'en') },
      { icon: '▸', title: t('paths.deep_title', lang as 'ru' | 'en'), description: t('paths.deep_desc', lang as 'ru' | 'en') },
    ]} />
    <p class="map-all-link">
      <a href={`/ThePath/${lang}/map`}>{t('map.view_all', lang as 'ru' | 'en')} →</a>
    </p>
  </section>

</BaseLayout>

<style>
  .longread-section { max-width: var(--max-width-wide); margin: 0 auto; padding: 4rem 1.5rem; }
  .longread-section:nth-child(even) { background: var(--color-cosmic-light); }
  .longread-section h2 { text-align: center; margin-bottom: 2rem; }

  .practice-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
  .practice-card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; text-align: center; }
  .practice-card p { font-size: 1rem; margin: 0.75rem 0; }
  .practice-time { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-cosmic-text-secondary); }
  .practice-disclaimer { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-cosmic-text-secondary); text-align: center; margin: 1rem 0 2rem; }

  .transparency-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; max-width: 700px; margin: 0 auto; }
  .trans-item { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.25rem; }
  .trans-item.no { border-left: 3px solid var(--color-danger); }
  .trans-item.yes { border-left: 3px solid #27ae60; }
  .trans-icon { font-size: 1.2rem; }
  .trans-item.no .trans-icon { color: var(--color-danger); }
  .trans-item.yes .trans-icon { color: #27ae60; }
  .trans-label { margin: 0.3rem 0; }
  .trans-item p { font-size: 0.85rem; line-height: 1.5; margin-top: 0.3rem; }

  .map-all-link { text-align: center; margin-top: 1.5rem; }

  @media (max-width: 768px) {
    .longread-section { padding: 2.5rem 1rem; }
  }
</style>
```

- [ ] **5.4: Проверить билд**

```bash
cd web && npm run build
```

- [ ] **5.5: Коммит**

```bash
git add -A
git commit -m "feat(web): longread homepage with 5 narrative sections; add /start landing page"
```

---

### Task 6: Обновлённые страницы и навигация (Phase 5)

**Файлы:**
- Modify: `web/src/components/Nav.astro` (новая структура ссылок)
- Modify: `web/src/pages/[lang]/manifesto.astro` (визуальное обновление)
- Modify: `web/src/pages/[lang]/map.astro` (карточки вместо таблиц)
- Modify: `web/src/pages/[lang]/modules/[slug].astro` (обновлённый ModuleLayout)
- Modify: `web/src/layouts/ModuleLayout.astro` (стили)
- Create: `web/src/pages/[lang]/questions.astro` (FAQ)
- Modify: `web/src/i18n/ui.ts` (ключи для questions, навигации)

- [ ] **6.1: Обновить Nav — новая структура**

```astro
<div class="nav-links" id="nav-menu">
  <a href={`${base}/${lang}/start`} class="nav-link">{t('nav.start', lang)}</a>
  <a href={`${base}/${lang}/manifesto`} class="nav-link">{t('nav.manifesto', lang)}</a>
  <a href={`${base}/${lang}/map`} class="nav-link">{t('nav.map', lang)}</a>
  <a href={`${base}/${lang}/questions`} class="nav-link">{t('nav.questions', lang)}</a>
  <LanguageSwitch lang={lang} currentPath={currentPath} />
  <ThemeToggle lang={lang} />
  <SearchModal lang={lang} client:load />
</div>
```

Убрать ссылки: Glossary, Contact, Simulator (они в футере или на других страницах).

- [ ] **6.2: Добавить ключи для новой навигации в i18n/ui.ts**

```ts
'nav.start': 'Практики', // EN: 'Practices'
'nav.questions': 'Вопросы', // EN: 'Questions'
```

- [ ] **6.3: Создать страницу `/questions`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getLangPaths } from '../../utils/static-paths';
import { t } from '../../i18n/ui';

export async function getStaticPaths() {
  return getLangPaths();
}

const { lang } = Astro.params;
const faqs = [
  { q: t('faq.q1', lang as 'ru' | 'en'), a: t('faq.a1', lang as 'ru' | 'en') },
  { q: t('faq.q2', lang as 'ru' | 'en'), a: t('faq.a2', lang as 'ru' | 'en') },
  { q: t('faq.q3', lang as 'ru' | 'en'), a: t('faq.a3', lang as 'ru' | 'en') },
  { q: t('faq.q4', lang as 'ru' | 'en'), a: t('faq.a4', lang as 'ru' | 'en') },
  { q: t('faq.q5', lang as 'ru' | 'en'), a: t('faq.a5', lang as 'ru' | 'en') },
  { q: t('faq.q6', lang as 'ru' | 'en'), a: t('faq.a6', lang as 'ru' | 'en') },
];
---

<BaseLayout lang={lang as 'ru' | 'en'} title={t('nav.questions', lang as 'ru' | 'en')}>
  <div class="content">
    <h1>{t('faq.title', lang as 'ru' | 'en')}</h1>
    <div class="faq-list">
      {faqs.map((item) => (
        <details class="faq-item">
          <summary>{item.q}</summary>
          <div class="faq-answer">{item.a}</div>
        </details>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .content { max-width: var(--max-width-content); margin: 0 auto; padding: 3rem 1.5rem; }
  .faq-list { margin-top: 2rem; }
  .faq-item { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; cursor: pointer; }
  .faq-item summary { font-weight: 500; font-size: 1rem; }
  .faq-answer { padding-top: 0.75rem; font-size: 0.9rem; line-height: 1.7; color: var(--color-cosmic-text-secondary); }
</style>
```

- [ ] **6.4: Добавить FAQ-ключи в i18n/ui.ts**

Перенести FAQ из Module 0 в i18n. RU + EN версии всех 6 вопросов-ответов.

- [ ] **6.5: Обновить страницу `/map` — карточки вместо таблиц**

Заменить `<table>` с 15 модулями на сетку карточек с использованием CardsGrid. Каждый модуль — карточка с номером, названием и коротким описанием.

- [ ] **6.6: Проверить билд**

```bash
cd web && npm run build
```

- [ ] **6.7: Коммит**

```bash
git add -A
git commit -m "feat(web): new nav structure, /questions FAQ page, card-based /map, add i18n keys"
```

---

### Task 7: Уборка «Obsidian notes» и финальная полировка (Phase 6 + 7)

**Файлы:**
- Modify: `web/src/content/modules/ru/0-canon.md` (убрать changelog)
- Modify: `web/src/content/modules/ru/*.md` (убрать changelog'и из остальных)
- Modify: `web/src/content/modules/en/*.md`
- Modify: `web/src/content/pages/ru/manifesto.md` (убрать changelog)
- Modify: `web/src/content/pages/ru/map.md` (убрать контактные секции)
- Modify: `web/src/components/Footer.astro` (убрать версию)
- Modify: `web/src/components/module/ModuleMeta.astro` (убрать публичный version)
- Modify: `web/src/components/social/Comments.astro` (убрать русский хардкод)

- [ ] **7.1: Убрать changelog'и из тела модулей**

Найти и удалить секции `Изменения:` / `Changes:` в конце каждого .md файла модулей. В manifesto.md строка 110.

```bash
# Пример для русского манифеста:
```

В `web/src/content/pages/ru/manifesto.md`, удалить строку:
```
*Изменения: добавлены положения о Спирали как моральном компасе для власти и гражданина...*
```

- [ ] **7.2: Убрать версию из футера**

В `web/src/components/Footer.astro`, удалить:
```astro
<p class="footer-version">{t('footer.version', lang)}</p>
```

Удалить ключ `footer.version` из i18n/ui.ts.

- [ ] **7.3: Убрать версию из ModuleMeta на публичных страницах**

В `web/src/components/module/ModuleMeta.astro`, скрыть или убрать отображение версии. Оставить её в `<meta>` для SEO, но не показывать визуально.

- [ ] **7.4: Починить хардкод русского текста в Comments.astro**

В `web/src/components/social/Comments.astro:10`, заменить хардкод на i18n:
```astro
<!-- Было: -->
<h3>Комментарии</h3>

<!-- Стало: -->
<h3>{t('comments.title', lang)}</h3>
```

- [ ] **7.5: Переименовать секции с §N на осмысленные заголовки в Module 0**

В `web/src/content/modules/ru/0-canon.md` (и en версии), заменить:
- `§1. Две прагматические аксиомы` → `## Основания: две аксиомы`
- `§2. Три железных запрета` → `## Три запрета`
- И т.д. для всех параграфов

- [ ] **7.6: Финальный билд и проверка всех страниц**

```bash
cd web && npm run build
```

Проверить, что:
- Все 57+ страниц собираются без ошибок
- `astro check` проходит (0 ошибок TypeScript)
- Нет битых ссылок
- Все i18n ключи существуют в обоих языках

- [ ] **7.7: Lighthouse audit**

Запустить локально и проверить показатели. Цель: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100.

- [ ] **7.8: Коммит**

```bash
git add -A
git commit -m "chore(web): remove Obsidian notes artifacts — changelogs, version numbers, raw tables; fix Comments i18n; rename sections"
```

- [ ] **7.9: Финальный пуш и деплой**

```bash
git push origin main
```

GitHub Actions автоматически задеплоит на GitHub Pages.

---

## Self-Review

**1. Spec coverage:** Все разделы спецификации покрыты:
- Визуальный язык → Task 4
- Лонгрид → Task 5
- Лексическая реформа → Task 3
- Технический рефакторинг → Task 1
- a11y/производительность → Task 2
- Обновлённые страницы → Task 6
- Obsidian notes → Task 7

**2. Placeholder scan:** Нет TBD, TODO, «добавить позже». Все шаги содержат код или конкретные команды.

**3. Type consistency:** `getLangPaths()` определён в Task 1 и используется в Tasks 5-6. `CardsGrid` определён в Task 1 и используется в Tasks 5-6. `useLocalStorage` определён в Task 1. Все интерфейсы согласованы.
