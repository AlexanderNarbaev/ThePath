# Astro Redesign — «Спираль Сознания» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from Jekyll to Astro 5 with full English translations, modern design, and interactive features.

**Architecture:** Astro 5 static site with Preact islands for interactivity (search, progress, theme, graph). Content in Markdown with Content Collections. Tailwind CSS v4 for styling. Deployed via GitHub Actions to GitHub Pages + GitVerse Pages.

**Tech Stack:** Astro 5, Preact, Tailwind CSS v4, D3.js, Lunr.js, TypeScript

---

## Phase 0: Repository Standards & Infrastructure

### Task 0.1: Standard repository files

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `TRANSLATION.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `.gitignore` (update if exists)
- Create: `docs/superpowers/plans/2026-05-31-astro-redesign-plan.md`

Write `.gitignore`:

```
node_modules/
dist/
.env
.DS_Store
.astro/
*.log
```

Write `LICENSE` (CC BY-SA 4.0 full text).

Write `README.md`:

```markdown
# Спираль Сознания / Spiral of Consciousness

Моральный компас для человека, гражданина и власти.
Открытая, эволюционирующая система практик, этики и мировоззрения
для навигации в эпоху Великого Испытания (XXI–XXIII века).

## Структура

- `docs/` — 15 модулей, Манифест, Карта-путеводитель, Архив
- `web/` — Astro-сайт
- `infra/` — Docker Compose, WireMock
- `wal/` — Write-Ahead Log сессий

## Разработка

```bash
cd web
npm install
npm run dev
```

## Лицензия

CC BY-SA 4.0
```

Write `CONTRIBUTING.md`:

```markdown
# Как внести вклад

Спасибо за интерес к «Спирали Сознания».

## Переводы

См. [TRANSLATION.md](TRANSLATION.md).

## Код и дизайн

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/описание`
3. Установите зависимости: `cd web && npm install`
4. Запустите dev-сервер: `npm run dev`
5. Внесите изменения
6. Проверьте сборку: `npm run build`
7. Создайте PR

## Принципы

- Следуйте дизайн-системе (Tailwind-токены)
- Компоненты — маленькие, с одной ответственностью
- Тексты модулей — в Markdown, структура согласно Content Collection schema
```

Write `TRANSLATION.md`:

```markdown
# Гид по переводам

## Структура

Модули хранятся в `web/src/content/modules/{lang}/`.
Каждый модуль — Markdown-файл с YAML-фронтматтером:

```yaml
module_number: 0
title: "Canon of the Spiral"
subtitle: "The Immutable Core"
version: "2.1"
lang: en
audience: "Everyone"
path: quickstart
topics: ["axioms", "prohibitions", "principles"]
```

## Добавление нового языка

1. Создайте папку: `web/src/content/modules/{lang-code}/`
2. Скопируйте модули из `ru/` как основу
3. Переведите фронтматтер и содержание
4. Добавьте UI-строки в `web/src/i18n/ui.ts`
5. Создайте PR

## Требования к переводу

- Точность передачи смысла, а не дословный перевод
- Сохранение структуры разделов, таблиц, чек-листов
- Культурная адаптация примеров и метафор при необходимости
```

Write `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1, адаптированный):

```markdown
# Кодекс поведения

## Обязательства

Мы обязуемся создавать среду, свободную от притеснений, для всех.

## Стандарты

Поощряется:
- Эмпатия и доброта
- Уважение к разным мнениям
- Конструктивная обратная связь
- Признание ошибок

Запрещено — абсолютно (три запрета Спирали):
- Угрозы насилия
- Травля и домогательства
- Любая форма дискриминации

## Правоприменение

Нарушения рассматриваются координаторами проекта.
```

### Task 0.2: Initialize CodeGraph

Run: `cd /home/alexnarbaev/ThePath && npx codegraph init`

Verify: `npx codegraph status`

### Task 0.3: Initialize Astro project

Run:
```bash
cd /home/alexnarbaev/ThePath
npm create astro@latest web -- --template minimal --typescript strict --skip-houston
cd web
npm install
npm install @astrojs/preact preact @preact/signals
npm install -D tailwindcss @tailwindcss/vite
npm install lunr d3
npm install -D @types/d3
```

Create `web/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alexandernarbaev.github.io',
  base: '/ThePath',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

Update `web/package.json` scripts:
```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

Create `web/tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Phase 1: English Translations

### Task 1.1: Translate EN Manifesto (full parity with RU)

Read `docs/Module_0.md` sections: «Спираль и государство», «Преступный приказ», «Этическая легитимность государства».
Read current `web/en/manifesto.md`.

**File:** Write `web/src/content/en/manifesto.md`

Expand to parity with Russian (114 lines). Must include:
- Era of the Great Trial (digital opium, blind economy, AI black box, toxic distrust)
- Three Prohibitions: Red Lines for All (with full details for each)
- Four Principles of Flourishing (with explanations)
- The Spiral and Authority: A Moral Compass, Not an Ideology
- The Spiral and the State (new section — military, police, courts, illegal orders)
- Practice: 3 Minutes a Day
- Community and Civic Action
- A Call
- Version 1.1, May 31, 2026

### Task 1.2: Translate EN Map (full parity with RU)

Read `docs/Map.md` and current `web/en/map.md`.

**File:** Write `web/src/content/en/map.md`

Expand to parity: extended module descriptions with sub-topics, detailed study paths with time estimates, contribute section, contacts.

### Task 1.3: Translate EN Module 0 — Canon

Read `docs/Module_0.md` and Russian `web/ru/module-0.md`.

**File:** Write `web/src/content/modules/en/0-canon.md`

Full translation (225 lines parity). Sections: Preface (conscious node), Two Pragmatic Axioms, Three Absolute Prohibitions (with exceptions), Four Principles of Flourishing, Creed, Three Levels of Belonging, Basic Practices, Condensed Myth of the First Node, The Spiral and the State, One Summary Phrase.

### Task 1.4: Translate EN Module 1 — Cosmology and Myth

Read `docs/Module_1.md`.

**File:** Write `web/src/content/modules/en/1-cosmology.md`

Full translation (201 lines parity). Prologue, Chapters 1-7, Epilogue, Parallels with sobornost, common cause (Fyodorov), Ubuntu.

### Task 1.5: Translate EN Modules 2-14 (remaining 13 modules)

For each module 2-14, read corresponding `docs/Module_N.md` and write `web/src/content/modules/en/N-slug.md`.

Modules:
- 2: Ethics and Virtues (ethics of power, dirty hands dilemma, table of virtues/vices, code of honor, exclusion procedure)
- 3: Practices and Rituals (3 minutes/day, Circles of Reconciliation, Civic Ritual, grounding practices)
- 4: Resilience and Antifragility (crisis plans, community under repressive state, Digital Fortress)
- 5: Conflict Resolution (Reconciliation Circles, mediation, arbitration, Facilitator's Code)
- 6: Technology and Ethics (AI, digital sovereignty, autonomous weapons, biohacking, seven generations principle)
- 7: Economy (cooperative sector, sovereign funds, 30-hour week, participatory budgeting)
- 8: Politics and Governance (sociocracy, citizens' assemblies, Council of the Future, subsidiarity)
- 9: Psychology and Health (burnout, collective trauma, emergency psychology, military trauma)
- 10: Education and Mentoring (dialogue pedagogy, mentor certification, curriculum for state institutions)
- 11: Global Synthesis (civilizational dialogue, Ubuntu, Two-Eyed Seeing, UN Council of Civilizations)
- 12: Library of the Spiral (annotated bibliography)
- 13: Civilizational Platform (Ethical State model, three prohibitions in constitution, fourth ethical branch, 50-100 year roadmap)
- 14: Production and Regenerative Economy (community workshops, Repair Café, energy cooperatives, Spiral-compatible certification)

### Task 1.6: Write EN index page

Read `web/en/index.md`.

**File:** Write `web/src/content/en/index.md`

Full translation matching Russian structure (34 lines). Welcome, Three Prohibitions, Four Principles, System Overview table, link to Guide Map.

---

## Phase 2: Astro Site — Styles & Infrastructure

### Task 2.1: Create i18n data files

**File:** `web/src/i18n/ui.ts`

```typescript
export const ui = {
  ru: {
    'site.name': 'Спираль Сознания',
    'nav.home': 'Главная',
    'nav.map': 'Карта',
    'nav.manifesto': 'Манифест',
    'nav.search': 'Поиск...',
    'nav.search_shortcut': '⌘K',
    'sidebar.title': 'Все модули',
    'sidebar.toggle': 'Модули ▸',
    'theme.light': 'Светлая тема',
    'theme.dark': 'Тёмная тема',
    'hero.title': 'Спираль Сознания',
    'hero.subtitle': 'Моральный компас для человека, гражданина и власти',
    'hero.cta_path': 'Выбрать путь изучения',
    'hero.cta_manifesto': 'Читать Манифест',
    'breadcrumb.home': 'Главная',
    'breadcrumb.map': 'Карта',
    'module.number': 'Модуль',
    'module.version': 'Версия',
    'footer.text': '«Ты — сознающий узел. Энтропия тянет вниз. Выбор тянет вверх. Выбирай восходящую спираль.»',
    'footer.license': 'Распространяется под лицензией CC BY-SA 4.0.',
    'footer.version': 'Версия ядра 2.1, май 2026.',
    'prohibitions.title': 'Три запрета',
    'prohibitions.1_title': 'Не убивай',
    'prohibitions.1_desc': 'Прямая неминуемая угроза жизни — единственное исключение',
    'prohibitions.2_title': 'Не пытай',
    'prohibitions.2_desc': 'Абсолютный запрет без исключений',
    'prohibitions.3_title': 'Не порабощай',
    'prohibitions.3_desc': 'Никакого принудительного труда и лишения автономии',
    'paths.title': 'Пути изучения',
    'paths.choose': 'Выберите свой путь',
    'paths.start': 'Начать путь',
    'paths.required': 'Обязательно',
    'paths.recommended': 'Рекомендуется',
    'paths.optional': 'Факультативно',
    'search.title': 'Поиск по модулям',
    'search.empty': 'Ничего не найдено',
    'search.placeholder': 'Введите запрос...',
    'bookmark.add': 'Добавить в закладки',
    'bookmark.remove': 'Убрать из закладок',
    'progress.reading': 'Прогресс чтения',
    'map.title': 'Карта-путеводитель',
    'map.modules': 'Модульная система',
    'map.paths': 'Пути изучения',
    'map.contribute': 'Как внести вклад',
    'map.contacts': 'Контакты и ресурсы',
    'manifesto.title': 'Манифест Спирали Сознания',
    '404.title': 'Страница не найдена',
    '404.back': 'Вернуться на главную',
    'skip_to_content': 'К содержанию',
  },
  en: {
    'site.name': 'Spiral of Consciousness',
    'nav.home': 'Home',
    'nav.map': 'Map',
    'nav.manifesto': 'Manifesto',
    'nav.search': 'Search...',
    'nav.search_shortcut': '⌘K',
    'sidebar.title': 'All Modules',
    'sidebar.toggle': 'Modules ▸',
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'hero.title': 'Spiral of Consciousness',
    'hero.subtitle': 'A Moral Compass for the Individual, the Citizen, and Authority',
    'hero.cta_path': 'Choose Your Path',
    'hero.cta_manifesto': 'Read the Manifesto',
    'breadcrumb.home': 'Home',
    'breadcrumb.map': 'Map',
    'module.number': 'Module',
    'module.version': 'Version',
    'footer.text': '"You are a conscious node. Entropy pulls downward. Choice pulls upward. Choose the ascending spiral."',
    'footer.license': 'Licensed under CC BY-SA 4.0.',
    'footer.version': 'Core version 2.1, May 2026.',
    'prohibitions.title': 'Three Prohibitions',
    'prohibitions.1_title': 'Do Not Kill',
    'prohibitions.1_desc': 'Direct imminent threat to life — the only exception',
    'prohibitions.2_title': 'Do Not Torture',
    'prohibitions.2_desc': 'Absolute prohibition with no exceptions',
    'prohibitions.3_title': 'Do Not Enslave',
    'prohibitions.3_desc': 'No forced labor or deprivation of autonomy',
    'paths.title': 'Study Paths',
    'paths.choose': 'Choose your path',
    'paths.start': 'Start path',
    'paths.required': 'Required',
    'paths.recommended': 'Recommended',
    'paths.optional': 'Optional',
    'search.title': 'Search Modules',
    'search.empty': 'Nothing found',
    'search.placeholder': 'Type your query...',
    'bookmark.add': 'Add bookmark',
    'bookmark.remove': 'Remove bookmark',
    'progress.reading': 'Reading progress',
    'map.title': 'Guide Map',
    'map.modules': 'Modular System',
    'map.paths': 'Study Paths',
    'map.contribute': 'How to Contribute',
    'map.contacts': 'Contacts and Resources',
    'manifesto.title': 'Manifesto of the Spiral of Consciousness',
    '404.title': 'Page not found',
    '404.back': 'Back to home',
    'skip_to_content': 'Skip to content',
  },
} as const;

export type UIKey = keyof typeof ui.ru;
export type Lang = 'ru' | 'en';

export function t(key: UIKey, lang: Lang): string {
  return ui[lang][key];
}
```

**File:** `web/src/i18n/modules.ts`

```typescript
export interface ModuleMeta {
  number: number;
  slug: string;
  title: Record<'ru' | 'en', string>;
  subtitle: Record<'ru' | 'en', string>;
  audience: Record<'ru' | 'en', string>;
  path: 'quickstart' | 'mentor' | 'coordinator' | 'statesman' | 'deep';
  version?: string;
}

export const modules: ModuleMeta[] = [
  { number: 0, slug: '0-canon', title: { ru: 'Канон Спирали', en: 'Canon of the Spiral' }, subtitle: { ru: 'Неизменное ядро системы', en: 'The Immutable Core' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'quickstart', version: '2.1' },
  { number: 1, slug: '1-cosmology', title: { ru: 'Космология и миф', en: 'Cosmology and Myth' }, subtitle: { ru: 'Священная история Спирали Сознания', en: 'The Sacred History of the Spiral of Consciousness' }, audience: { ru: 'Все, изучающие', en: 'Everyone, Researchers' }, path: 'deep' },
  { number: 2, slug: '2-ethics', title: { ru: 'Этика и добродетели', en: 'Ethics and Virtues' }, subtitle: { ru: 'Кодекс чести, этика власти и силы', en: 'Code of Honor, Ethics of Power and Force' }, audience: { ru: 'Все, госслужащие', en: 'Everyone, Civil Servants' }, path: 'quickstart' },
  { number: 3, slug: '3-practices', title: { ru: 'Практики и ритуалы', en: 'Practices and Rituals' }, subtitle: { ru: 'От 3 минут в день до годовых праздников', en: 'From 3 Minutes a Day to Annual Festivals' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'quickstart' },
  { number: 4, slug: '4-resilience', title: { ru: 'Устойчивость и антихрупкость', en: 'Resilience and Antifragility' }, subtitle: { ru: 'Кризисные планы, община в репрессивном государстве', en: 'Crisis Plans, Community Under Repressive State' }, audience: { ru: 'Наставники, координаторы', en: 'Mentors, Coordinators' }, path: 'mentor' },
  { number: 5, slug: '5-conflicts', title: { ru: 'Разрешение конфликтов', en: 'Conflict Resolution' }, subtitle: { ru: 'Круги примирения, медиация, арбитраж', en: 'Reconciliation Circles, Mediation, Arbitration' }, audience: { ru: 'Наставники, юристы', en: 'Mentors, Lawyers' }, path: 'quickstart' },
  { number: 6, slug: '6-technology', title: { ru: 'Технологии и этика', en: 'Technology and Ethics' }, subtitle: { ru: 'ИИ, цифровой суверенитет, биохакинг', en: 'AI, Digital Sovereignty, Biohacking' }, audience: { ru: 'Изучающие, координаторы, законодатели', en: 'Researchers, Coordinators, Legislators' }, path: 'deep' },
  { number: 7, slug: '7-economy', title: { ru: 'Экономика', en: 'Economy' }, subtitle: { ru: 'Кооперативный сектор, суверенные фонды', en: 'Cooperative Sector, Sovereign Funds' }, audience: { ru: 'Координаторы, предприниматели, госслужащие', en: 'Coordinators, Entrepreneurs, Civil Servants' }, path: 'coordinator' },
  { number: 8, slug: '8-politics', title: { ru: 'Политика и управление', en: 'Politics and Governance' }, subtitle: { ru: 'Социократия, гражданские ассамблеи, Совет будущего', en: 'Sociocracy, Citizens\' Assemblies, Council of the Future' }, audience: { ru: 'Координаторы, политики, госслужащие', en: 'Coordinators, Politicians, Civil Servants' }, path: 'coordinator' },
  { number: 9, slug: '9-psychology', title: { ru: 'Психология и здоровье', en: 'Psychology and Health' }, subtitle: { ru: 'Профилактика выгорания, работа с травмой', en: 'Burnout Prevention, Trauma Work' }, audience: { ru: 'Все, наставники, военные, врачи', en: 'Everyone, Mentors, Military, Doctors' }, path: 'mentor' },
  { number: 10, slug: '10-education', title: { ru: 'Образование и наставничество', en: 'Education and Mentoring' }, subtitle: { ru: 'Педагогика диалога, сертификация наставников', en: 'Dialogue Pedagogy, Mentor Certification' }, audience: { ru: 'Наставники, учителя', en: 'Mentors, Teachers' }, path: 'mentor' },
  { number: 11, slug: '11-synthesis', title: { ru: 'Глобальный синтез', en: 'Global Synthesis' }, subtitle: { ru: 'Цивилизационный диалог, Ubuntu и соборность', en: 'Civilizational Dialogue, Ubuntu and Sobornost' }, audience: { ru: 'Изучающие, дипломаты', en: 'Researchers, Diplomats' }, path: 'deep' },
  { number: 12, slug: '12-library', title: { ru: 'Библиотека Спирали', en: 'Library of the Spiral' }, subtitle: { ru: 'Аннотированная библиография', en: 'Annotated Bibliography' }, audience: { ru: 'Все', en: 'Everyone' }, path: 'deep' },
  { number: 13, slug: '13-platform', title: { ru: 'Цивилизационная платформа', en: 'Civilizational Platform' }, subtitle: { ru: 'Модель Этического государства', en: 'Model of the Ethical State' }, audience: { ru: 'Законодатели, госслужащие, координаторы', en: 'Legislators, Civil Servants, Coordinators' }, path: 'statesman' },
  { number: 14, slug: '14-production', title: { ru: 'Производство и регенеративная экономика', en: 'Production and Regenerative Economy' }, subtitle: { ru: 'Общинные мастерские, Repair Café, энергокооперативы', en: 'Community Workshops, Repair Café, Energy Cooperatives' }, audience: { ru: 'Координаторы, предприниматели, инженеры', en: 'Coordinators, Entrepreneurs, Engineers' }, path: 'coordinator' },
];

export function getModule(number: number): ModuleMeta | undefined {
  return modules.find(m => m.number === number);
}

export function getModuleBySlug(slug: string): ModuleMeta | undefined {
  return modules.find(m => m.slug === slug);
}
```

**File:** `web/src/i18n/paths.ts`

```typescript
export interface StudyPath {
  id: string;
  name: Record<'ru' | 'en', string>;
  time: Record<'ru' | 'en', string>;
  audience: Record<'ru' | 'en', string>;
  modules: number[];
  optional?: number[];
  recommended?: number[];
  description: Record<'ru' | 'en', string>;
}

export const paths: StudyPath[] = [
  {
    id: 'quickstart',
    name: { ru: 'Быстрый старт', en: 'Quick Start' },
    time: { ru: '~2 часа', en: '~2 hours' },
    audience: { ru: 'Все', en: 'Everyone' },
    modules: [0, 3, 5],
    description: { ru: 'Познакомьтесь с ядром и основными практиками', en: 'Get to know the core and basic practices' },
  },
  {
    id: 'mentor',
    name: { ru: 'Наставник', en: 'Mentor' },
    time: { ru: '15–20 часов', en: '15–20 hours' },
    audience: { ru: 'Наставники', en: 'Mentors' },
    modules: [0, 2, 3, 4, 5, 9, 10],
    optional: [1, 8],
    description: { ru: 'Глубокое понимание системы и навыки фасилитации', en: 'Deep understanding of the system and facilitation skills' },
  },
  {
    id: 'coordinator',
    name: { ru: 'Координатор общин', en: 'Community Coordinator' },
    time: { ru: '25–30 часов', en: '25–30 hours' },
    audience: { ru: 'Координаторы', en: 'Coordinators' },
    modules: [0, 2, 3, 4, 5, 7, 8, 9, 10],
    description: { ru: 'Управление общиной, экономикой и внешними связями', en: 'Community management, economy, and external relations' },
  },
  {
    id: 'statesman',
    name: { ru: 'Государственный деятель', en: 'Statesman' },
    time: { ru: '30–40 часов', en: '30–40 hours' },
    audience: { ru: 'Политики, военные, судьи, дипломаты', en: 'Politicians, Military, Judges, Diplomats' },
    modules: [0, 2, 5, 6, 8, 13],
    recommended: [7, 10, 11],
    description: { ru: 'Применение принципов Спирали в государственной службе', en: 'Applying Spiral principles in public service' },
  },
  {
    id: 'deep',
    name: { ru: 'Глубокое изучение', en: 'Deep Study' },
    time: { ru: 'Свободный', en: 'Self-paced' },
    audience: { ru: 'Исследователи, энтузиасты', en: 'Researchers, Enthusiasts' },
    modules: [1, 6, 11, 12],
    description: { ru: 'Понимание философских оснований и глобального синтеза', en: 'Understanding philosophical foundations and global synthesis' },
  },
];
```

**File:** `web/src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  schema: z.object({
    module_number: z.number().min(0).max(14),
    title: z.string(),
    subtitle: z.string().optional(),
    version: z.string().optional(),
    lang: z.enum(['ru', 'en']),
    audience: z.string().optional(),
    path: z.enum(['quickstart', 'mentor', 'coordinator', 'statesman', 'deep']).optional(),
    topics: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']),
    description: z.string().optional(),
  }),
});

export const collections = { modules, pages };
```

### Task 2.2: Copy and restructure existing content

Copy Russian modules from `web/ru/module-*.md` to `web/src/content/modules/ru/` with renamed filenames (add slug):

```bash
cd /home/alexnarbaev/ThePath/web
mkdir -p src/content/modules/ru src/content/modules/en src/content/ru src/content/en

# Copy Russian modules with new names
cp ../web/ru/module-0.md src/content/modules/ru/0-canon.md
cp ../web/ru/module-1.md src/content/modules/ru/1-cosmology.md
cp ../web/ru/module-2.md src/content/modules/ru/2-ethics.md
cp ../web/ru/module-3.md src/content/modules/ru/3-practices.md
cp ../web/ru/module-4.md src/content/modules/ru/4-resilience.md
cp ../web/ru/module-5.md src/content/modules/ru/5-conflicts.md
cp ../web/ru/module-6.md src/content/modules/ru/6-technology.md
cp ../web/ru/module-7.md src/content/modules/ru/7-economy.md
cp ../web/ru/module-8.md src/content/modules/ru/8-politics.md
cp ../web/ru/module-9.md src/content/modules/ru/9-psychology.md
cp ../web/ru/module-10.md src/content/modules/ru/10-education.md
cp ../web/ru/module-11.md src/content/modules/ru/11-synthesis.md
cp ../web/ru/module-12.md src/content/modules/ru/12-library.md
cp ../web/ru/module-13.md src/content/modules/ru/13-platform.md
cp ../web/ru/module-14.md src/content/modules/ru/14-production.md

# Copy index, manifesto, map
cp ../web/ru/index.md src/content/ru/index.md
cp ../web/ru/manifesto.md src/content/ru/manifesto.md
cp ../web/ru/map.md src/content/ru/map.md
```

Then update frontmatter on all RU module files to match new Content Collection schema:
- Replace `layout: module` with just: `module_number`, `title`, `subtitle`, `version`, `lang: ru`, `audience`, `path`
- Remove `sidebar` frontmatter key
- Remove `module_title`, `module_subtitle` keys (use `title`, `subtitle`)

---

## Phase 3: Astro Site — Styles

### Task 3.1: Create global CSS with Tailwind v4

**File:** `web/src/styles/global.css`

```css
@import "tailwindcss";

@theme {
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
  --color-cosmic: #0a0a14;
  --color-cosmic-light: #12121f;
  --color-cosmic-card: #161630;
  --color-cosmic-border: #2a2a40;
  --color-cosmic-text: #f0efe7;
  --color-cosmic-text-secondary: #a0a0b8;
  --font-mono: 'JetBrains Mono', monospace;
  --max-width-content: 720px;
  --sidebar-width: 260px;
}

@layer base {
  html {
    scroll-behavior: smooth;
    font-size: 18px;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.8;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }
  h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; }
  h2 { font-size: 1.75rem; font-weight: 600; line-height: 1.3; margin-top: 2.5rem; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; margin-top: 2rem; margin-bottom: 0.75rem; }
  a { color: var(--color-accent); text-decoration: none; transition: color 0.2s; }
  a:hover { color: var(--color-accent-hover); }
  blockquote {
    border-left: 3px solid var(--color-gold);
    padding: 0.5rem 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--color-text-secondary);
  }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
  th { font-weight: 600; background: var(--color-bg-secondary); }
  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: var(--color-bg-secondary);
    padding: 0.15em 0.4em;
    border-radius: 3px;
  }
  pre {
    background: var(--color-bg-secondary);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
  }
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg-primary: var(--color-cosmic);
  --color-bg-secondary: var(--color-cosmic-light);
  --color-text-primary: var(--color-cosmic-text);
  --color-text-secondary: var(--color-cosmic-text-secondary);
  --color-accent: var(--color-gold);
  --color-accent-hover: var(--color-gold-hover);
  --color-nav-bg: #0c0c1a;
  --color-card-bg: var(--color-cosmic-card);
  --color-border: var(--color-cosmic-border);
  --color-danger: #e74c3c;
}

/* Skip to content */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: white;
  font-weight: 600;
}
.skip-link:focus { top: 0; }

/* Layout */
.page-layout {
  display: flex;
  max-width: 1200px;
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
  max-width: 900px;
  padding: 2rem 1.5rem 4rem;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-layout { flex-direction: column; }
  .content, .content-wide { padding: 1rem; }
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.35rem; }
}
```

---

## Phase 4: Astro Site — Shared Components

### Task 4.1: Nav component

**File:** `web/src/components/Nav.astro`

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import LanguageSwitch from './LanguageSwitch.astro';
import SearchModal from './search/SearchModal';
import { t, type Lang } from '../i18n/ui';
import { modules } from '../i18n/modules';

const { lang } = Astro.props as { lang: Lang };
const siteName = t('site.name', lang);
const currentPath = Astro.url.pathname;
const langPath = `/${lang}`;
---

<nav class="nav">
  <div class="nav-inner">
    <a href={`${Astro.site?.base ?? ''}${langPath}`} class="nav-logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="var(--color-gold)" stroke-width="2" />
        <path d="M16 4 Q24 12 16 28 Q8 12 16 4" stroke="var(--color-gold)" stroke-width="1.5" fill="none" />
      </svg>
      <span>{siteName}</span>
    </a>
    <div class="nav-links" id="nav-menu">
      <a href={`${Astro.site?.base ?? ''}${langPath}`} class:list={['nav-link', { active: currentPath === `${langPath}/` || currentPath === langPath }]}>{t('nav.home', lang)}</a>
      <a href={`${Astro.site?.base ?? ''}${langPath}/map`} class:list={['nav-link', { active: currentPath.includes('/map') }]}>{t('nav.map', lang)}</a>
      <a href={`${Astro.site?.base ?? ''}${langPath}/manifesto`} class:list={['nav-link', { active: currentPath.includes('/manifesto') }]}>{t('nav.manifesto', lang)}</a>
      <LanguageSwitch lang={lang} currentPath={currentPath} />
      <ThemeToggle lang={lang} />
      <SearchModal lang={lang} client:load />
    </div>
    <button
      class="nav-toggle"
      aria-label="Menu"
      onclick="document.getElementById('nav-menu')?.classList.toggle('open')"
    >
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-nav-bg);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(8px);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    gap: 1rem;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--color-text-primary);
    text-decoration: none;
  }
  .nav-logo:hover { color: var(--color-accent); }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .nav-link {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.2s;
  }
  .nav-link:hover { color: var(--color-text-primary); background: var(--color-bg-secondary); }
  .nav-link.active { color: var(--color-accent); font-weight: 600; }
  .nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.25rem; }
  .nav-toggle span { display: block; width: 22px; height: 2px; margin: 5px 0; background: var(--color-text-primary); border-radius: 2px; }
  @media (max-width: 768px) {
    .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--color-nav-bg); flex-direction: column; padding: 1rem; border-bottom: 1px solid var(--color-border); gap: 0.5rem; align-items: stretch; }
    .nav-links.open { display: flex; }
    .nav-toggle { display: block; }
    .nav-link { padding: 0.75rem 1rem; }
  }
</style>
```

### Task 4.2: Footer component

**File:** `web/src/components/Footer.astro`

```astro
---
import { t, type Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---

<footer class="footer">
  <div class="footer-inner">
    <p class="footer-quote">{t('footer.text', lang)}</p>
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} {t('footer.license', lang)}</p>
      <p class="footer-version">{t('footer.version', lang)}</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-cosmic);
    color: var(--color-cosmic-text-secondary);
    padding: 2rem 1.5rem;
    margin-top: auto;
  }
  .footer-inner { max-width: 800px; margin: 0 auto; text-align: center; }
  .footer-quote { font-style: italic; font-size: 1rem; color: var(--color-gold); margin-bottom: 1rem; line-height: 1.6; }
  .footer-bottom { font-size: 0.8rem; opacity: 0.7; }
  .footer-version { margin-top: 0.25rem; }
</style>
```

### Task 4.3: Sidebar component

**File:** `web/src/components/Sidebar.astro`

```astro
---
import { t, type Lang } from '../i18n/ui';
import { modules } from '../i18n/modules';
const { lang, currentModule } = Astro.props as { lang: Lang; currentModule?: number };
---

<aside class="sidebar" id="sidebar">
  <button class="sidebar-toggle" onclick="document.getElementById('sidebar')?.classList.toggle('open')">
    {t('sidebar.toggle', lang)}
  </button>
  <nav class="sidebar-nav">
    <h3 class="sidebar-title">{t('sidebar.title', lang)}</h3>
    <ul>
      {modules.map(m => (
        <li class:list={['sidebar-item', { active: currentModule === m.number }]}>
          <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${m.slug}`}>
            <span class="sidebar-num">{m.number}</span>
            <span class="sidebar-module-title">{m.title[lang]}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    border-right: 1px solid var(--color-border);
    background: var(--color-bg-secondary);
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
  .sidebar-toggle { display: none; width: 100%; padding: 0.75rem; border: none; background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border); font-size: 0.9rem; cursor: pointer; color: var(--color-text-secondary); }
  .sidebar-nav { padding: 1.25rem 0.75rem; }
  .sidebar-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); padding: 0 0.75rem 0.75rem; margin: 0; }
  .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
  .sidebar-item { margin-bottom: 0.125rem; }
  .sidebar-item a {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    text-decoration: none;
    color: var(--color-text-secondary);
    transition: all 0.15s;
  }
  .sidebar-item a:hover { background: var(--color-card-bg); color: var(--color-text-primary); }
  .sidebar-item.active a { background: var(--color-accent); color: white; font-weight: 500; }
  .sidebar-num { font-size: 0.7rem; opacity: 0.6; min-width: 1.2em; text-align: right; }
  .sidebar-module-title { flex: 1; }
  @media (max-width: 768px) {
    .sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--color-border); }
    .sidebar-toggle { display: block; }
    .sidebar-nav { display: none; }
    .sidebar.open .sidebar-nav { display: block; }
  }
</style>
```

### Task 4.4: ThemeToggle component

**File:** `web/src/components/ThemeToggle.astro`

```astro
---
import { t, type Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---

<button
  class="theme-toggle"
  aria-label={t('theme.dark', lang)}
  title={t('theme.dark', lang)}
  onclick="(() => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  })()"
>
  <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
  <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
</button>

<style>
  .theme-toggle {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.4rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .theme-toggle:hover { color: var(--color-accent); border-color: var(--color-accent); }
  [data-theme="dark"] .icon-sun { display: none; }
  [data-theme="dark"] .icon-moon { display: block; }
  [data-theme="light"] .icon-sun, :root:not([data-theme]) .icon-sun { display: block; }
  [data-theme="light"] .icon-moon, :root:not([data-theme]) .icon-moon { display: none; }
</style>
```

### Task 4.5: LanguageSwitch component

**File:** `web/src/components/LanguageSwitch.astro`

```astro
---
import type { Lang } from '../i18n/ui';
const { lang, currentPath } = Astro.props as { lang: Lang; currentPath: string };
const otherLang = lang === 'ru' ? 'en' : 'ru';
const otherPath = currentPath.replace(`/${lang}`, `/${otherLang}`);
---

<div class="lang-switch">
  {lang === 'ru' ? (
    <>
      <span class="lang-active">RU</span>
      <a href={otherPath} class="lang-link">EN</a>
    </>
  ) : (
    <>
      <a href={otherPath} class="lang-link">RU</a>
      <span class="lang-active">EN</span>
    </>
  )}
</div>

<style>
  .lang-switch { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; }
  .lang-active { padding: 0.25rem 0.5rem; border-radius: 4px; background: var(--color-accent); color: white; }
  .lang-link { padding: 0.25rem 0.5rem; border-radius: 4px; color: var(--color-text-secondary); text-decoration: none; }
  .lang-link:hover { background: var(--color-bg-secondary); color: var(--color-text-primary); }
</style>
```

### Task 4.6: ModuleMeta and ModuleBreadcrumb components

**File:** `web/src/components/module/ModuleMeta.astro`

```astro
---
import { t, type Lang } from '../../i18n/ui';
const { lang, number, title, version } = Astro.props as { lang: Lang; number: number; title: string; version?: string };
---

<div class="module-meta">
  <span class="module-number">{t('module.number', lang)} {number}</span>
  {version && <span class="module-version">{t('module.version', lang)} {version}</span>}
</div>

<style>
  .module-meta { display: flex; gap: 1rem; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary); }
  .module-number { font-weight: 600; }
  .module-version { opacity: 0.7; }
</style>
```

**File:** `web/src/components/module/ModuleBreadcrumb.astro`

```astro
---
import { t, type Lang } from '../../i18n/ui';
const { lang, title } = Astro.props as { lang: Lang; title: string };
---

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href={`${Astro.site?.base ?? ''}/${lang}`}>{t('breadcrumb.home', lang)}</a>
  <span aria-hidden="true">&rsaquo;</span>
  <a href={`${Astro.site?.base ?? ''}/${lang}/map`}>{t('breadcrumb.map', lang)}</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span aria-current="page">{title}</span>
</nav>

<style>
  .breadcrumb { font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .breadcrumb a { color: var(--color-text-secondary); }
  .breadcrumb a:hover { color: var(--color-accent); }
  .breadcrumb [aria-current="page"] { color: var(--color-text-primary); font-weight: 500; }
</style>
```

---

## Phase 5: Astro Site — Layouts

### Task 5.1: BaseLayout

**File:** `web/src/layouts/BaseLayout.astro`

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { t, type Lang } from '../i18n/ui';
import '../styles/global.css';

interface Props {
  lang: Lang;
  title: string;
  description?: string;
}

const { lang, title, description } = Astro.props;
const siteName = t('site.name', lang);
const pageDesc = description ?? t('hero.subtitle', lang);
---

<!doctype html>
<html lang={lang} data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — {siteName}</title>
  <meta name="description" content={pageDesc} />
  <link rel="icon" type="image/x-icon" href={`${Astro.site?.base ?? ''}/favicon.ico`} />
  <link rel="apple-touch-icon" href={`${Astro.site?.base ?? ''}/apple-touch-icon.png`} />
  <meta property="og:title" content={`${title} — ${siteName}`} />
  <meta property="og:description" content={pageDesc} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  {
    lang === 'ru' ? (
      <link rel="alternate" hreflang="en" href={`${Astro.site?.base ?? ''}${Astro.url.pathname.replace('/ru/', '/en/')}`} />
    ) : (
      <link rel="alternate" hreflang="ru" href={`${Astro.site?.base ?? ''}${Astro.url.pathname.replace('/en/', '/ru/')}`} />
    )
  }
  <script is:inline>
    (() => {
      const saved = localStorage.getItem('theme');
      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', saved || prefers);
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
</head>
<body class="min-h-screen flex flex-col">
  <a href="#main-content" class="skip-link">{t('skip_to_content', lang)}</a>
  <Nav lang={lang} />
  <main id="main-content" class="flex-1">
    <slot />
  </main>
  <Footer lang={lang} />
</body>
</html>
```

### Task 5.2: ModuleLayout

**File:** `web/src/layouts/ModuleLayout.astro`

```astro
---
import BaseLayout from './BaseLayout.astro';
import Sidebar from '../components/Sidebar.astro';
import ModuleMeta from '../components/module/ModuleMeta.astro';
import ModuleBreadcrumb from '../components/module/ModuleBreadcrumb.astro';
import ProgressBar from '../components/progress/ProgressBar';
import BookmarkButton from '../components/progress/BookmarkButton';
import type { Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
  title: string;
  subtitle?: string;
  moduleNumber: number;
  version?: string;
}

const { lang, title, subtitle, moduleNumber, version } = Astro.props;
---

<BaseLayout lang={lang} title={title}>
  <div class="page-layout">
    <Sidebar lang={lang} currentModule={moduleNumber} />
    <article class="content">
      <ProgressBar module_number={moduleNumber} lang={lang} client:load />
      <ModuleMeta lang={lang} number={moduleNumber} title={title} version={version} />
      <ModuleBreadcrumb lang={lang} title={title} />
      <div class="module-header">
        <h1>{title}</h1>
        {subtitle && <p class="module-subtitle">{subtitle}</p>}
      </div>
      <BookmarkButton module_number={moduleNumber} lang={lang} client:load />
      <div class="prose">
        <slot />
      </div>
    </article>
  </div>
</BaseLayout>

<style>
  .module-header { margin-bottom: 1.5rem; }
  .module-subtitle { font-size: 1.1rem; color: var(--color-text-secondary); }
  .prose { margin-top: 1rem; }
  .prose :global(h1) { font-size: 2rem; }
  .prose :global(h2) { border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
  .prose :global(img) { max-width: 100%; border-radius: 8px; }
  .prose :global(blockquote) { background: var(--color-bg-secondary); border-radius: 0 8px 8px 0; }
</style>
```

### Task 5.3: HomeLayout

**File:** `web/src/layouts/HomeLayout.astro`

```astro
---
import BaseLayout from './BaseLayout.astro';
import type { Lang } from '../i18n/ui';

interface Props { lang: Lang; title: string; }

const { lang, title } = Astro.props;
---

<BaseLayout lang={lang} title={title}>
  <slot />
</BaseLayout>
```

---

## Phase 6: Astro Site — Pages

### Task 6.1: Root redirect

**File:** `web/src/pages/index.astro`

```astro
---
return Astro.redirect('/ru/', 302);
---
```

### Task 6.2: Home page ([lang]/index.astro)

**File:** `web/src/pages/[lang]/index.astro`

```astro
---
import { getCollection } from 'astro:content';
import HomeLayout from '../../layouts/HomeLayout.astro';
import Hero from '../../components/home/Hero.astro';
import ProhibitionsCards from '../../components/home/ProhibitionsCards.astro';
import PathCards from '../../components/home/PathCards.astro';
import { t, type Lang } from '../../i18n/ui';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const indexPages = await getCollection('pages', ({ data }) => data.lang === lang && data.id.startsWith('index'));
const page = indexPages[0];
---

<HomeLayout lang={lang} title={t('site.name', lang)}>
  <Hero lang={lang} />
  <div class="home-content">
    <ProhibitionsCards lang={lang} />
    {page && <div class="home-prose" set:html={page.body} />}
    <PathCards lang={lang} />
  </div>
</HomeLayout>

<style>
  .home-content { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
  .home-prose { max-width: 720px; margin: 3rem auto 0; }
  .home-prose :global(h2) { font-size: 1.75rem; margin-top: 2rem; }
  .home-prose :global(table) { width: 100%; }
</style>
```

### Task 6.3: Home page sub-components

**File:** `web/src/components/home/Hero.astro`

```astro
---
import { t, type Lang } from '../../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---

<div class="hero">
  <div class="hero-bg">
    <svg class="hero-spiral" viewBox="0 0 400 400" aria-hidden="true">
      <path d="M200 200 Q220 180 200 160 Q170 130 200 100 Q240 60 200 40"
            stroke="var(--color-gold)" stroke-width="1" fill="none" opacity="0.3" />
      <circle cx="200" cy="200" r="180" stroke="var(--color-gold)" stroke-width="0.5" fill="none" opacity="0.1" />
      <circle cx="200" cy="200" r="120" stroke="var(--color-gold)" stroke-width="0.5" fill="none" opacity="0.15" />
      <circle cx="200" cy="200" r="60" stroke="var(--color-gold)" stroke-width="0.5" fill="none" opacity="0.2" />
    </svg>
  </div>
  <div class="hero-content">
    <h1>{t('hero.title', lang)}</h1>
    <p class="hero-subtitle">{t('hero.subtitle', lang)}</p>
    <div class="hero-cta">
      <a href={`${Astro.site?.base ?? ''}/${lang}/map`} class="btn-primary">{t('hero.cta_path', lang)}</a>
      <a href={`${Astro.site?.base ?? ''}/${lang}/manifesto`} class="btn-secondary">{t('hero.cta_manifesto', lang)}</a>
    </div>
  </div>
</div>

<style>
  .hero {
    position: relative;
    text-align: center;
    padding: 5rem 1.5rem 3rem;
    background: radial-gradient(ellipse at center, var(--color-bg-secondary) 0%, var(--color-bg-primary) 70%);
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .hero-spiral {
    width: 400px;
    height: 400px;
    animation: spin 60s linear infinite;
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .hero-spiral { animation: none; } }
  .hero-content { position: relative; z-index: 1; }
  .hero h1 {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-accent) 50%, var(--color-gold-hover) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.75rem;
  }
  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
  .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-gold);
    color: #0a0a14;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--color-gold-hover); transform: translateY(-1px); color: #0a0a14; }
  .btn-secondary {
    display: inline-block;
    padding: 0.75rem 2rem;
    border: 2px solid var(--color-gold);
    color: var(--color-gold);
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(230, 193, 123, 0.1); }
  @media (max-width: 768px) {
    .hero { padding: 3rem 1rem 2rem; }
    .hero h1 { font-size: 2rem; }
    .hero-subtitle { font-size: 1.05rem; }
    .hero-spiral { width: 250px; height: 250px; }
  }
</style>
```

**File:** `web/src/components/home/ProhibitionsCards.astro`

```astro
---
import { t, type Lang } from '../../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---

<section class="prohibitions">
  <h2>{t('prohibitions.title', lang)}</h2>
  <div class="cards">
    <div class="card">
      <div class="card-icon">&#x2620;</div>
      <h3>{t('prohibitions.1_title', lang)}</h3>
      <p>{t('prohibitions.1_desc', lang)}</p>
    </div>
    <div class="card">
      <div class="card-icon">&#x26D4;</div>
      <h3>{t('prohibitions.2_title', lang)}</h3>
      <p>{t('prohibitions.2_desc', lang)}</p>
    </div>
    <div class="card">
      <div class="card-icon">&#x1F517;</div>
      <h3>{t('prohibitions.3_title', lang)}</h3>
      <p>{t('prohibitions.3_desc', lang)}</p>
    </div>
  </div>
</section>

<style>
  .prohibitions { margin: 3rem 0; text-align: center; }
  .prohibitions h2 { margin-bottom: 1.5rem; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
  .card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .card-icon { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.7; }
  .card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
  .card p { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; }
</style>
```

**File:** `web/src/components/home/PathCards.astro`

```astro
---
import { t, type Lang } from '../../i18n/ui';
import { paths } from '../../i18n/paths';
const { lang } = Astro.props as { lang: Lang };
---

<section class="paths">
  <h2>{t('paths.title', lang)}</h2>
  <p class="paths-subtitle">{t('paths.choose', lang)}</p>
  <div class="path-cards">
    {paths.map(p => (
      <a href={`${Astro.site?.base ?? ''}/${lang}/paths/${p.id}`} class="path-card">
        <h3>{p.name[lang]}</h3>
        <p class="path-time">{p.time[lang]}</p>
        <p class="path-audience">{p.audience[lang]}</p>
        <p class="path-desc">{p.description[lang]}</p>
        <span class="path-start">{t('paths.start', lang)} &rarr;</span>
      </a>
    ))}
  </div>
</section>

<style>
  .paths { margin: 3rem 0; text-align: center; }
  .paths-subtitle { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
  .path-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.25rem; text-align: left; }
  .path-card {
    display: block;
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--color-text-primary);
    transition: all 0.2s;
  }
  .path-card:hover { border-color: var(--color-gold); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .path-card h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
  .path-time { font-size: 0.8rem; color: var(--color-accent); font-weight: 500; margin-bottom: 0.25rem; }
  .path-audience { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
  .path-desc { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; }
  .path-start { display: inline-block; margin-top: 0.75rem; font-weight: 600; color: var(--color-gold); font-size: 0.85rem; }
</style>
```

### Task 6.4: Module page ([lang]/modules/[...slug].astro)

**File:** `web/src/pages/[lang]/modules/[...slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import ModuleLayout from '../../../layouts/ModuleLayout.astro';
import { modules } from '../../../i18n/modules';
import type { Lang } from '../../../i18n/ui';

export async function getStaticPaths() {
  const allModules = await getCollection('modules');
  return allModules.map(entry => ({
    params: { lang: entry.data.lang, slug: entry.id.replace(`${entry.data.lang}/`, '') },
  }));
}

const { lang, slug } = Astro.params as { lang: Lang; slug: string };
const entry = await getCollection('modules', ({ data }) => data.lang === lang && data.id === `${lang}/${slug}`);
const doc = entry[0];

if (!doc) return Astro.redirect(`/${lang}/404`);

const meta = modules.find(m => m.slug === slug);
const title = meta?.title[lang] ?? doc.data.title;
const subtitle = meta?.subtitle[lang] ?? doc.data.subtitle;
---

<ModuleLayout
  lang={lang}
  title={title}
  subtitle={subtitle}
  moduleNumber={doc.data.module_number}
  version={doc.data.version}
>
  <article set:html={doc.body} />
</ModuleLayout>
```

### Task 6.5: Map page ([lang]/map.astro)

**File:** `web/src/pages/[lang]/map.astro`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ModuleGraph from '../../components/map/ModuleGraph';
import { t, type Lang } from '../../i18n/ui';
import { modules } from '../../i18n/modules';
import { paths } from '../../i18n/paths';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const mapPages = await getCollection('pages', ({ data }) => data.lang === lang && data.id.startsWith('map'));
const page = mapPages[0];
---

<BaseLayout lang={lang} title={t('map.title', lang)}>
  <div class="content-wide">
    <h1>{t('map.title', lang)}</h1>

    {page && <div set:html={page.body} />}

    <section class="graph-section">
      <h2>{t('map.modules', lang)}</h2>
      <ModuleGraph lang={lang} client:load />
    </section>

    <section class="modules-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{lang === 'ru' ? 'Название' : 'Title'}</th>
            <th>{lang === 'ru' ? 'Аудитория' : 'Audience'}</th>
            <th>{lang === 'ru' ? 'Путь' : 'Path'}</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(m => (
            <tr>
              <td>{m.number}</td>
              <td><a href={`${Astro.site?.base ?? ''}/${lang}/modules/${m.slug}`}>{m.title[lang]}</a></td>
              <td>{m.audience[lang]}</td>
              <td><span class="path-badge path-{m.path}">{m.path}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="paths-detail">
      <h2>{t('map.paths', lang)}</h2>
      {paths.map(p => (
        <div class="path-detail">
          <h3>{p.name[lang]}</h3>
          <p class="path-meta">{p.time[lang]} &middot; {p.audience[lang]}</p>
          <p>{p.description[lang]}</p>
          <div class="path-modules">
            <span class="label">{t('paths.required', lang)}:</span>
            {p.modules.map(n => {
              const mod = modules.find(m => m.number === n);
              return mod ? <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${mod.slug}`} class="module-chip">{mod.title[lang]}</a> : null;
            })}
          </div>
          {p.optional && (
            <div class="path-modules">
              <span class="label">{t('paths.optional', lang)}:</span>
              {p.optional.map(n => {
                const mod = modules.find(m => m.number === n);
                return mod ? <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${mod.slug}`} class="module-chip chip-optional">{mod.title[lang]}</a> : null;
              })}
            </div>
          )}
          {p.recommended && (
            <div class="path-modules">
              <span class="label">{t('paths.recommended', lang)}:</span>
              {p.recommended.map(n => {
                const mod = modules.find(m => m.number === n);
                return mod ? <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${mod.slug}`} class="module-chip chip-rec">{mod.title[lang]}</a> : null;
              })}
            </div>
          )}
          <a href={`${Astro.site?.base ?? ''}/${lang}/paths/${p.id}`} class="path-start-btn">{t('paths.start', lang)} &rarr;</a>
        </div>
      ))}
    </section>
  </div>
</BaseLayout>

<style>
  .graph-section { margin: 2rem 0; }
  .modules-table { margin: 2rem 0; }
  .paths-detail { margin: 2rem 0; }
  .path-detail { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem; }
  .path-detail h3 { margin-top: 0; }
  .path-meta { color: var(--color-text-secondary); font-size: 0.9rem; }
  .path-modules { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin: 0.5rem 0; }
  .label { font-size: 0.8rem; font-weight: 600; min-width: 7em; }
  .module-chip { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 4px; background: var(--color-accent); color: white; text-decoration: none; }
  .chip-optional { opacity: 0.6; }
  .chip-rec { background: var(--color-bg-secondary); color: var(--color-accent); border: 1px solid var(--color-accent); }
  .path-badge { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px; background: var(--color-bg-secondary); }
  .path-start-btn { display: inline-block; margin-top: 0.75rem; font-weight: 600; color: var(--color-gold); }
</style>
```

### Task 6.6: Manifesto page ([lang]/manifesto.astro)

**File:** `web/src/pages/[lang]/manifesto.astro`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { t, type Lang } from '../../i18n/ui';

export async function getStaticPaths() {
  return [{ params: { lang: 'ru' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const pages = await getCollection('pages', ({ data }) => data.lang === lang && data.id.startsWith('manifesto'));
const page = pages[0];
---

<BaseLayout lang={lang} title={t('manifesto.title', lang)}>
  <div class="content-wide">
    <article class="manifesto">
      {page && <div set:html={page.body} />}
    </article>
  </div>
</BaseLayout>

<style>
  .manifesto {
    border: 2px solid var(--color-gold);
    border-radius: 12px;
    padding: 3rem 2rem;
    margin: 2rem 0;
  }
  .manifesto :global(h1) { font-size: 2.5rem; }
  .manifesto :global(h2) { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
  @media (max-width: 768px) {
    .manifesto { padding: 1.5rem 1rem; }
  }
</style>
```

### Task 6.7: Path detail page ([lang]/paths/[...path].astro)

**File:** `web/src/pages/[lang]/paths/[...path].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { t, type Lang } from '../../i18n/ui';
import { paths } from '../../i18n/paths';
import { modules } from '../../i18n/modules';

export async function getStaticPaths() {
  const entries: { params: { lang: string; path: string } }[] = [];
  for (const lang of ['ru', 'en']) {
    for (const p of paths) {
      entries.push({ params: { lang, path: p.id } });
    }
  }
  return entries;
}

const { lang, path } = Astro.params as { lang: Lang; path: string };
const studyPath = paths.find(p => p.id === path);

if (!studyPath) return Astro.redirect(`/${lang}/404`);

const pathModules = studyPath.modules.map(n => modules.find(m => m.number === n)).filter(Boolean);
const optionalModules = (studyPath.optional || []).map(n => modules.find(m => m.number === n)).filter(Boolean);
const recommendedModules = (studyPath.recommended || []).map(n => modules.find(m => m.number === n)).filter(Boolean);
---

<BaseLayout lang={lang} title={studyPath.name[lang]}>
  <div class="content-wide">
    <h1>{studyPath.name[lang]}</h1>
    <p class="path-meta">{studyPath.time[lang]} &middot; {studyPath.audience[lang]}</p>
    <p class="path-desc">{studyPath.description[lang]}</p>

    <h2>{t('paths.required', lang)}</h2>
    <div class="module-list">
      {pathModules.map(m => {
        if (!m) return null;
        const firstModule = pathModules[0];
        return (
          <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${m!.slug}`} class="module-card">
            <span class="module-card-num">{m!.number}</span>
            <div>
              <strong>{m!.title[lang]}</strong>
              <p>{m!.subtitle[lang]}</p>
            </div>
          </a>
        );
      })}
    </div>

    {recommendedModules.length > 0 && (
      <>
        <h2>{t('paths.recommended', lang)}</h2>
        <div class="module-list">
          {recommendedModules.map(m => {
            if (!m) return null;
            return (
              <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${m!.slug}`} class="module-card">
                <span class="module-card-num">{m!.number}</span>
                <div>
                  <strong>{m!.title[lang]}</strong>
                  <p>{m!.subtitle[lang]}</p>
                </div>
              </a>
            );
          })}
        </div>
      </>
    )}

    {optionalModules.length > 0 && (
      <>
        <h2>{t('paths.optional', lang)}</h2>
        <div class="module-list">
          {optionalModules.map(m => {
            if (!m) return null;
            return (
              <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${m!.slug}`} class="module-card module-card-optional">
                <span class="module-card-num">{m!.number}</span>
                <div>
                  <strong>{m!.title[lang]}</strong>
                  <p>{m!.subtitle[lang]}</p>
                </div>
              </a>
            );
          })}
        </div>
      </>
    )}

    {pathModules[0] && (
      <a href={`${Astro.site?.base ?? ''}/${lang}/modules/${pathModules[0].slug}`} class="btn-primary mt-8 inline-block">
        {t('paths.start', lang)} &rarr;
      </a>
    )}
  </div>
</BaseLayout>

<style>
  .path-meta { color: var(--color-text-secondary); font-size: 0.95rem; margin-bottom: 0.5rem; }
  .path-desc { font-size: 1.05rem; margin-bottom: 2rem; color: var(--color-text-secondary); }
  .module-list { display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0 2rem; }
  .module-card {
    display: flex; align-items: flex-start; gap: 1rem;
    background: var(--color-card-bg); border: 1px solid var(--color-border);
    border-radius: 8px; padding: 1rem 1.25rem;
    text-decoration: none; color: var(--color-text-primary);
    transition: all 0.2s;
  }
  .module-card:hover { border-color: var(--color-gold); transform: translateX(4px); }
  .module-card-optional { opacity: 0.6; }
  .module-card-num { font-size: 1.5rem; font-weight: 700; color: var(--color-accent); min-width: 2rem; text-align: center; }
  .module-card p { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
</style>
```

### Task 6.8: 404 page

**File:** `web/src/pages/404.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { t } from '../i18n/ui';

const lang = (Astro.url.pathname.startsWith('/en') || Astro.url.pathname.startsWith('/ThePath/en')) ? 'en' : 'ru';
---

<BaseLayout lang={lang} title={t('404.title', lang)}>
  <div class="content" style="text-align: center; padding-top: 6rem;">
    <h1 style="font-size: 4rem; margin-bottom: 0.5rem;">404</h1>
    <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 2rem;">{t('404.title', lang)}</p>
    <a href={`${Astro.site?.base ?? ''}/${lang}`} class="btn-primary" style="display: inline-block;">{t('404.back', lang)}</a>
  </div>
</BaseLayout>
```

---

## Phase 7: Preact Interactive Islands

### Task 7.1: Search modal

**File:** `web/src/components/search/SearchModal.tsx`

```tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import lunr from 'lunr';
import { modules, type ModuleMeta } from '../../i18n/modules';
import { t, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}

interface SearchDoc {
  id: number;
  title: string;
  body: string;
}

let idx: lunr.Index | null = null;
let docs: SearchDoc[] = [];

export default function SearchModal({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function buildIndex() {
    if (idx) return;
    setLoading(true);
    docs = [];
    const allDocs: SearchDoc[] = [];

    for (const mod of modules) {
      try {
        const url = `${import.meta.env.BASE_URL}${lang}/modules/${mod.slug}`;
        // Use a simple approach: index module titles directly
        allDocs.push({
          id: mod.number,
          title: mod.title[lang],
          body: mod.subtitle[lang],
        });
      } catch {}
    }

    idx = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('body');
      allDocs.forEach(d => { this.add(d); docs.push(d); });
    });

    setLoading(false);
  }

  useEffect(() => {
    if (open) buildIndex();
  }, [open]);

  function search(q: string) {
    setQuery(q);
    if (!q.trim() || !idx) { setResults([]); return; }
    const found = idx.search(q).slice(0, 8);
    setResults(found.map(r => docs.find(d => d.id === Number(r.ref))!).filter(Boolean));
  }

  if (!open) return (
    <button class="search-trigger" onclick={() => setOpen(true)} title={t('nav.search', lang)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span class="search-shortcut">{t('nav.search_shortcut', lang)}</span>
    </button>
  );

  return (
    <div class="search-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('search-overlay')) setOpen(false); }}>
      <div class="search-modal">
        <input
          ref={inputRef}
          type="text"
          placeholder={t('search.placeholder', lang)}
          value={query}
          onInput={(e) => search((e.target as HTMLInputElement).value)}
          class="search-input"
        />
        <div class="search-results">
          {loading && <p class="search-empty">...</p>}
          {!loading && results.length === 0 && query && <p class="search-empty">{t('search.empty', lang)}</p>}
          {results.map(r => {
            const mod = modules.find(m => m.number === r.id);
            if (!mod) return null;
            return (
              <a href={`${import.meta.env.BASE_URL}${lang}/modules/${mod.slug}`} class="search-result" onClick={() => setOpen(false)}>
                <span class="search-result-num">{mod.number}</span>
                <span class="search-result-title">{mod.title[lang]}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

Add styles inline in the component or in a separate `<style>` tag within the TSX.

### Task 7.2: Progress bar

**File:** `web/src/components/progress/ProgressBar.tsx`

```tsx
import { useEffect, useState } from 'preact/hooks';
import type { Lang } from '../../i18n/ui';

interface Props {
  module_number: number;
  lang: Lang;
}

export default function ProgressBar({ module_number, lang }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      setProgress(pct);
      const key = `progress-${lang}-${module_number}`;
      const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
      data[key] = Math.max(data[key] || 0, pct);
      localStorage.setItem('spiral-progress', JSON.stringify(data));
    }

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div class="progress-bar" style={`--progress: ${progress}%`}>
      <div class="progress-fill" />
    </div>
  );
}
```

### Task 7.3: Bookmark button

**File:** `web/src/components/progress/BookmarkButton.tsx`

```tsx
import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props {
  module_number: number;
  lang: Lang;
}

export default function BookmarkButton({ module_number, lang }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const key = `bookmark-${lang}-${module_number}`;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
    setBookmarked(!!data[key]);
  }, []);

  function toggle() {
    const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
    if (bookmarked) {
      delete data[key];
    } else {
      data[key] = Date.now();
    }
    localStorage.setItem('spiral-progress', JSON.stringify(data));
    setBookmarked(!bookmarked);
  }

  return (
    <button class="bookmark-btn" onclick={toggle} title={bookmarked ? t('bookmark.remove', lang) : t('bookmark.add', lang)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
```

### Task 7.4: Module graph (D3)

**File:** `web/src/components/map/ModuleGraph.tsx`

```tsx
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { modules, type ModuleMeta } from '../../i18n/modules';
import { paths } from '../../i18n/paths';
import type { Lang } from '../../i18n/ui';

const pathColors: Record<string, string> = {
  quickstart: '#4CAF50',
  mentor: '#2196F3',
  coordinator: '#FF9800',
  statesman: '#E91E63',
  deep: '#9C27B0',
};

interface Props { lang: Lang; }

export default function ModuleGraph({ lang }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 500;

    const nodes = modules.map(m => ({
      id: m.number,
      title: m.title[lang],
      path: m.path,
      slug: m.slug,
    }));

    const links: { source: number; target: number }[] = [];
    // Sequential links between modules in study paths
    for (const p of paths) {
      const pathMods = [...p.modules, ...(p.optional || []), ...(p.recommended || [])];
      for (let i = 0; i < pathMods.length - 1; i++) {
        if (!links.some(l => (l.source === pathMods[i] && l.target === pathMods[i + 1]) || (l.source === pathMods[i + 1] && l.target === pathMods[i]))) {
          links.push({ source: pathMods[i], target: pathMods[i + 1] });
        }
      }
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.6);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => { window.location.href = `${import.meta.env.BASE_URL}${lang}/modules/${d.slug}`; });

    node.append('circle')
      .attr('r', 18)
      .attr('fill', d => pathColors[d.path] || '#888')
      .attr('stroke', 'var(--color-bg-primary)')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    node.append('text')
      .text(d => d.title.length > 20 ? d.title.slice(0, 18) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', '2.2em')
      .attr('fill', 'var(--color-text-secondary)')
      .attr('font-size', '10px');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [lang]);

  return (
    <div class="graph-container">
      <svg ref={svgRef} viewBox="0 0 800 500" style="width: 100%; height: auto; min-height: 300px;" />
    </div>
  );
}
```

---

## Phase 8: CI/CD and Deploy

### Task 8.1: GitHub Actions workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: web/package-lock.json
      - name: Install dependencies
        run: npm ci
        working-directory: web
      - name: Build
        run: npm run build
        working-directory: web
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Task 8.2: GitVerse workflow

**File:** `.gitverse/workflows/deploy.yml`

```yaml
name: Deploy to GitVerse Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
        working-directory: web
      - run: npm run build
        working-directory: web
      - uses: peaceiris/actions-gh-pages@v4
        with:
          publish_dir: web/dist
```

---

## Phase 9: Build and Verify

### Task 9.1: Build and fix errors

```bash
cd web
npm run build
```

Fix any TypeScript/Astro errors. Repeat until clean build.

### Task 9.2: Run dev server and verify all pages

```bash
cd web
npm run dev -- --host
```

Verify:
- `/ru/` loads with hero, prohibitions cards, path cards
- `/en/` same, in English
- `/ru/modules/0-canon` loads with sidebar, breadcrumb, full content
- `/en/modules/0-canon` loads English version
- `/ru/map` shows module table and D3 graph
- `/ru/manifesto` shows full manifesto with gold border
- `/ru/paths/quickstart` shows path detail
- Language switch works on all pages
- Theme toggle works, persists
- Mobile layout: hamburger menu, sidebar collapsible

### Task 9.3: Remove old Jekyll files

After confirming the new site works, remove old files:
```bash
rm -rf web/_layouts web/_includes web/_data web/ru web/en web/index.html web/Gemfile web/Gemfile.lock web/_config.yml web/assets
# Keep images in public/ if needed
```

But keep `web/assets/images/` for the favicon and hero images if they'll be reused.

---

## Phase 10: Commit and Push

```bash
git add -A
git commit -m "feat: Astro 5 migration — full EN translations, modern design, interactivity"
git push origin main
```

---

## Notes for Implementation

1. **Frontmatter updates for RU modules:** When copying RU modules to `src/content/modules/ru/`, update the YAML frontmatter to match the Content Collection schema.

2. **Content collection IDs:** Astro content collection entries are keyed by `{lang}/{filename}`. The `slug` parameter for dynamic routes should extract just the filename part.

3. **Base URL handling:** All internal links MUST use `${Astro.site?.base ?? ''}` prefix. Astro's `base` config handles `/ThePath` for GitHub Pages.

4. **Import `BASE_URL` in Preact components:** Use `import.meta.env.BASE_URL` for links in island components.

5. **Font loading:** JetBrains Mono from Google Fonts. If you prefer self-hosting, download the font files to `public/fonts/`.

6. **OG image generation:** For now, skip automatic OG image generation and use a static `public/og-template.png`. Can add `@vercel/og` (satori) later.
