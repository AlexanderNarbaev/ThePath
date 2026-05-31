# Spec: Astro Redesign — «Спираль Сознания»

**Date:** 2026-05-31
**Status:** approved
**Version:** 1.0

---

## 1. Контекст

Существующий Jekyll-сайт (52 файла) деплоится на GitHub Pages + GitVerse Pages. Проблемы:
- 15 английских модулей — заглушки (27 строк с «translation in progress»)
- EN-манифест и карта урезаны на 40%/25%
- Дизайн минималистичный, нет тёмной темы, нет интерактива
- OG-метатеги не локализованы

Цель: полная пересборка на Astro 5 с полноценными переводами (EN первым, инфраструктура для краудсорсинга), интерактивом и современным дизайном.

## 2. Технологический стек

| Слой | Технология |
|------|-----------|
| Фреймворк | Astro 5 |
| UI-острова | Preact (поиск, прогресс, темы, граф) |
| CSS | Tailwind CSS v4 |
| Визуализации | D3.js |
| Поиск | Lunr.js (клиентский) |
| View-переходы | Astro View Transitions |
| Деплой | GitHub Pages (peaceiris/actions-gh-pages) |
| CI/CD | GitHub Actions |

## 3. Файловая структура

```
web/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── src/
│   ├── content/
│   │   ├── modules/
│   │   │   ├── ru/0-canon.md
│   │   │   ├── ru/1-cosmology.md
│   │   │   ├── ... (15 модулей)
│   │   │   ├── en/0-canon.md
│   │   │   ├── en/1-cosmology.md
│   │   │   └── ... (15 модулей)
│   │   ├── ru/
│   │   │   ├── index.md
│   │   │   ├── manifesto.md
│   │   │   └── map.md
│   │   ├── en/
│   │   │   ├── index.md
│   │   │   ├── manifesto.md
│   │   │   └── map.md
│   │   └── config.ts
│   ├── i18n/
│   │   ├── ui.ts
│   │   ├── modules.ts
│   │   └── paths.ts
│   ├── pages/
│   │   ├── index.astro              # редирект / → /ru/
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   ├── manifesto.astro
│   │   │   ├── map.astro
│   │   │   ├── modules/[...slug].astro
│   │   │   └── paths/[...path].astro
│   │   ├── 404.astro
│   │   └── rss.xml.js
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Sidebar.astro
│   │   ├── ThemeToggle.astro
│   │   ├── LanguageSwitch.astro
│   │   ├── MobileMenu.astro
│   │   ├── module/
│   │   │   ├── ModuleMeta.astro
│   │   │   └── ModuleBreadcrumb.astro
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── ProhibitionsCards.astro
│   │   │   └── PathCards.astro
│   │   ├── map/
│   │   │   └── ModuleGraph.tsx
│   │   ├── search/
│   │   │   └── SearchModal.tsx
│   │   ├── progress/
│   │   │   ├── ProgressBar.tsx
│   │   │   └── BookmarkButton.tsx
│   │   └── spiral/
│   │       └── AnimatedSpiral.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ModuleLayout.astro
│   │   └── HomeLayout.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-template.png
│   └── robots.txt
├── TRANSLATION.md
├── CONTRIBUTING.md
└── LICENSE
```

## 4. Content Collection Schema

```typescript
// src/content/config.ts
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
    ogImage: z.string().optional(),
  }),
});
```

## 5. Дизайн: «Космический минимализм»

### Цветовая схема

| Токен | Светлая тема | Тёмная тема |
|-------|-------------|------------|
| `--bg-primary` | `#fafaf5` (пергамент) | `#0a0a14` (глубокий космос) |
| `--bg-secondary` | `#f3f2ee` | `#12121f` |
| `--text-primary` | `#1a1a2e` | `#f0efe7` |
| `--text-secondary` | `#4a4a5e` | `#a0a0b8` |
| `--accent` | `#2c3e9e` (индиго) | `#e6c17b` (янтарь/золото) |
| `--accent-hover` | `#1a2878` | `#f0d48a` |
| `--nav-bg` | `#ffffff` | `#0c0c1a` |
| `--card-bg` | `#ffffff` | `#161630` |
| `--border` | `#e2e1dc` | `#2a2a40` |
| `--danger` | `#c0392b` (три запрета) | `#e74c3c` |

### Типографика

- Основной: системный стек (`-apple-system, ...`)
- Моноширинный: `JetBrains Mono` (цитаты, код)
- Заголовки: жирный градиент от `--accent` к более светлому
- h1: 2.5rem / h2: 1.75rem / h3: 1.25rem / body: 1.125rem
- line-height: 1.8

### Спираль-мотив

- Логотип в nav: 32×32 SVG
- Главная: медленно вращающаяся SVG-спираль (CSS animation) в hero-секции
- Спираль-рамка вокруг манифеста (CSS border-image)
- Фоновая текстура: радиальный градиент (очень слабый)

## 6. Страницы и компоненты

### 6.1 Главная (`[lang]/index.astro`)

- `Hero.astro` — анимированная спираль + заголовок + подзаголовок + 2 CTA
- `ProhibitionsCards.astro` — 3 карточки «Три запрета» с иконками и краткими описаниями
- `PathCards.astro` — 5 путей изучения (карточки со ссылками)
- Контент из Markdown (добро пожаловать, обзор системы)

### 6.2 Страница модуля (`[lang]/modules/[...slug].astro`)

- `Sidebar.astro` — навигация по всем 15 модулям, подсветка активного
- `ModuleMeta.astro` — номер, версия, аудитория
- `ModuleBreadcrumb.astro` — хлебные крошки (Главная → Карта → Название)
- Основной контент из Markdown (рендерится Astro)
- `ProgressBar.tsx` — остров: прогресс прочтения (событие scroll)
- `BookmarkButton.tsx` — остров: закладка (localStorage)

### 6.3 Карта-путеводитель (`[lang]/map.astro`)

- Таблица всех 15 модулей (name, audience, path, link)
- `ModuleGraph.tsx` — остров: D3 force-directed граф модулей с путями
- 5 путей изучения с деталями
- Как внести вклад + контакты

### 6.4 Манифест (`[lang]/manifesto.astro`)

- Полноширинный текст с декоративной спираль-рамкой
- Без сайдбара

### 6.5 Путь изучения (`[lang]/paths/[...path].astro`)

- Заголовок пути + описание + время
- Список модулей (обязательные, рекомендуемые, опциональные)
- Кнопка «Начать путь» → первый модуль

## 7. Интерактивность (Preact-острова)

### 7.1 Поиск (`SearchModal.tsx`)

- Триггер: ⌘K или клик по иконке поиска в nav
- Модальное окно с инпутом
- Lunr.js индекс (все модули на текущем языке), строится при первом открытии
- Результаты: название модуля + сниппет с подсветкой

### 7.2 Прогресс (`ProgressBar.tsx`, `BookmarkButton.tsx`)

- Тонкий прогресс-бар вверху страницы модуля (0–100% прочтения)
- Данные хранятся в localStorage: `{ "module-0": { progress: 85, bookmarked: true, lastVisit: "..." } }`
- Кнопка-звёздочка закладки

### 7.3 Граф модулей (`ModuleGraph.tsx`)

- D3 force-directed граф
- Узлы = модули (цвет = путь изучения)
- Рёбра = связи (зависимости, рекомендованные переходы)
- Клик → переход на страницу модуля

### 7.4 Переключатель темы (`ThemeToggle.astro`)

- Иконка солнце/луна в nav
- `data-theme` атрибут на `<html>` + localStorage
- Уважает `prefers-color-scheme` системы

### 7.5 Анимированная спираль (`AnimatedSpiral.astro`)

- Pure CSS анимация вращения SVG-спирали
- Расположена в hero-секции главной
- `prefers-reduced-motion` — статична

## 8. I18N архитектура

### UI-строки (`src/i18n/ui.ts`)

```typescript
export const ui = {
  ru: {
    'nav.home': 'Главная',
    'nav.map': 'Карта',
    'nav.manifesto': 'Манифест',
    'nav.search': 'Поиск',
    'sidebar.title': 'Все модули',
    'sidebar.modules': 'Модули ▸',
    'hero.title': 'Спираль Сознания',
    'hero.subtitle': 'Моральный компас для человека, гражданина и власти',
    'hero.cta_path': 'Выбрать путь изучения',
    'hero.cta_manifesto': 'Читать Манифест',
    'footer.text': '«Ты — сознающий узел...»',
    // ... все строки из старого _data/ui.yml
  },
  en: { /* ... */ },
} as const;
```

### Модули (`src/i18n/modules.ts`)

```typescript
export const modules = [
  { number: 0, title: 'Канон Спирали', title_en: 'Canon of the Spiral', subtitle: '...', subtitle_en: '...', path: 'quickstart', version: '2.1' },
  // ... 15 модулей
];
```

### Пути (`src/i18n/paths.ts`)

```typescript
export const paths = {
  quickstart: { name: 'Быстрый старт', name_en: 'Quick Start', ... },
  // ... 5 путей
};
```

### Маршрутизация

- Динамический роутинг: `[lang]/...`
- Дефолтный язык: `ru`
- `hreflang`-теги для SEO
- Сохранение языка при навигации

## 9. English-переводы (Этап 1)

### 9.1 Модули (15 шт.)

Полноценные переводы, не хуже русских (~200–280 строк каждый):
- Полный текст разделов
- Сохранение всех таблиц, чек-листов, процедур
- Адаптация идиом и культурных отсылок

### 9.2 Манифест

Довести до паритета с русским (114 строк): добавить отсутствующие разделы:
- «Спираль и власть»
- «Преступный приказ»
- «Этическая легитимность государства»

### 9.3 Карта

Довести до паритета с русским (110 строк): расширенные описания модулей, детали путей, контакты.

## 10. Инфраструктура для краудсорсинга

- `TRANSLATION.md` — гид для переводчиков (формат, требования, процесс PR)
- `CONTRIBUTING.md` — общий гид по контрибьюции
- JSON-схема для переводов (автоматическая валидация)
- Шаблон Issue для запроса нового языка
- Директория `src/content/modules/` готова к добавлению новых языковых папок

## 11. CI/CD и деплой

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
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
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: web/dist
```

GitVerse: аналогичный workflow (`.gitverse/workflows/deploy.yml`).

## 12. Стандартные файлы репозитория

- `README.md` — описание проекта, ссылка на сайт, структура
- `LICENSE` — CC BY-SA 4.0
- `CONTRIBUTING.md` — как помочь (переводы, код, дизайн)
- `TRANSLATION.md` — гид по переводам
- `CODE_OF_CONDUCT.md` — кодекс поведения (на основе Contributor Covenant)
- `.gitignore` — node_modules, dist, .astro, .DS_Store

## 13. Что НЕ входит

- Бэкенд / серверный рендеринг
- CMS (Netlify CMS, TinaCMS) — только Markdown
- Комментирование / социальные фичи
- Аналитика (Google Analytics / Plausible) — опционально позже
- Автоматический машинный перевод — все переводы вручную

## 14. Селф-ревью

- [x] Нет TBD/заглушек
- [x] Архитектура соответствует описанию страниц
- [x] Scope сфокусирован: один сайт, одна кодовая база
- [x] Требования однозначны (дизайн-токены, компоненты, i18n)
