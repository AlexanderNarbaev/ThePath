# Design Spec: Комплексное улучшение сайта — 2026-06-04

## Контекст
Сайт «Спираль Сознания» (Astro 5 + Preact + Tailwind 4, GitHub Pages + GitVerse Pages, 53 страницы, RU+EN). Сессия 2026-05-31 закрыта. Требуется: починить баги, i18n, SEO, добавить аналитику, форму связи, интерактивные симуляции, комментарии/реакции.

## Направления

### 1. Баги и i18n

| # | Файл | Проблема | Строка | Решение |
|---|------|----------|--------|---------|
| 1.1 | `web/src/pages/[lang]/paths/[...path].astro` | Редирект 404 ведёт на несуществующий `/${lang}/404` | :18 | `Astro.redirect('/ThePath/404')` |
| 1.2 | `web/src/components/module/TableOfContents.astro` | «Содержание» всегда по-русски | :11 | Ключ `toc.title` в `ui.ts`, `{t('toc.title', lang)}` |
| 1.3 | `web/src/pages/404.astro` | Хардкод-текст дублирует ключи `ui.ts` | :14-27 | Заменить на `t()` |
| 1.4 | `web/src/components/module/ModuleNav.astro` | «Пред./След.» хардкод | :20, :28 | Ключи `module.prev`/`module.next` |
| 1.5 | `web/src/components/interactive/DailyChecklist.tsx` | 4 строки хардкод | :34-44 | Ключи `daily.morning`/`daily.shield`/`daily.evening`/`daily.allDone` |
| 1.6 | `web/src/components/interactive/EthicalCompass.tsx` | «Новый вопрос» хардкод | :110 | Ключ `compass.reset` |
| 1.7 | `web/src/pages/[lang]/map.astro` | Заголовки таблицы хардкод + `as any` | :22-64 | Ключи `table.number`, `table.title`, `table.audience`, `table.path`; `Lang` вместо `as any` |
| 1.8 | `web/src/pages/[lang]/glossary.astro` | Вся страница в обход `t()` | :37-48 | Вынести термины в `ui.ts`; переписать с `t()` |
| 1.9 | `web/src/styles/global.css` | `.skip-link` и `.search-overlay` оба `z-index: 100` | :86, :126 | `.search-overlay` → `z-index: 101` |
| 1.10 | `web/src/components/ThemeToggle.astro` | Противоречивые CSS правила `:root .icon-sun` | :15-16 | Убрать `.icon-sun` из строки 16 |

### 2. SEO

| # | Что | Где | Детали |
|---|-----|-----|--------|
| 2.1 | `robots.txt` | `web/public/robots.txt` | `Sitemap: https://alexandernarbaev.github.io/ThePath/sitemap.xml` |
| 2.2 | Canonical URL | `BaseLayout.astro` | `<link rel="canonical" href={canonicalUrl} />` — абсолютный URL страницы |
| 2.3 | `og:image` + `twitter:image` | `BaseLayout.astro` | 1200×630 SVG с золотой спиралью на тёмном фоне + текст «Спираль Сознания» |
| 2.4 | `og:url` + `og:locale` | `BaseLayout.astro` | Абсолютный URL, `ru`/`en` |
| 2.5 | JSON-LD `WebSite` | `BaseLayout.astro` | name, url, description, inLanguage |
| 2.6 | JSON-LD `BreadcrumbList` | `ModuleLayout.astro` | Главная → Модуль N |
| 2.7 | JSON-LD `Article` | `ModuleLayout.astro` | headline, description, datePublished, inLanguage |
| 2.8 | `og:type=article` | `ModuleLayout.astro` | Переопределить `website` → `article` для модулей |
| 2.9 | Sitemap hreflang | `sitemap.xml.ts` | `<xhtml:link rel="alternate" hreflang="ru"/en"/>` внутри каждого `<url>` |
| 2.10 | `og:image` генерация | `web/public/og-image.png` | Статическая картинка 1200×630px |

### 3. Аналитика и счётчик (GoatCounter)

| # | Что | Где | Детали |
|---|-----|-----|--------|
| 3.1 | GoatCounter скрипт | `BaseLayout.astro` `<head>` | `<script data-goatcounter="https://[code].goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>` |
| 3.2 | VisitorCounter компонент | `web/src/components/analytics/VisitorCounter.tsx` | Preact, `client:load`. Вызывает GoatCounter JSON API `/counter/[path].json`, показывает число в футере |
| 3.3 | Локализация счётчика | `ui.ts` | Ключи `counter.visitors` |
| 3.4 | Размещение | `Footer.astro` | Виджет счётчика в футере |

### 4. Форма обратной связи

| # | Что | Где | Детали |
|---|-----|-----|--------|
| 4.1 | `ContactForm.tsx` | `web/src/components/forms/ContactForm.tsx` | Preact, `client:load`. Поля: имя, email, тема, сообщение. Web3Forms API. `access_key` из `import.meta.env.WEB3FORMS_KEY`. `lang==='ru'` → `alexander.narbayev@yandex.ru`, иначе → `alexander.narbayev@gmail.com` |
| 4.2 | Страница контактов | `web/src/pages/[lang]/contact.astro` | `BaseLayout` + `ContactForm`, заголовок из `ui.ts` |
| 4.3 | Ключи i18n | `ui.ts` | `contact.title`, `contact.name`, `contact.email`, `contact.subject`, `contact.message`, `contact.send`, `contact.sent`, `contact.error` |
| 4.4 | Ссылки в навигации | `Nav.astro`, `Footer.astro` | «Контакты»/«Contact» → `/ThePath/{lang}/contact` |
| 4.5 | `.env` файл | `web/.env` | `WEB3FORMS_KEY=...` (в .gitignore) |
| 4.6 | `.env.example` | `web/.env.example` | `WEB3FORMS_KEY=your_key_here` |
| 4.7 | `.gitignore` обновление | `web/.gitignore` | Добавить `.env` (если отсутствует) |

### 5. Интерактивные симуляции и квизы

| # | Что | Где | Детали |
|---|-----|-----|--------|
| 5.1 | `EthicalSimulator.tsx` | `web/src/components/interactive/EthicalSimulator.tsx` | Новый компонент. 6 этических сценариев (по 2-3 выбора), подсчёт очков по 3 шкалам: милосердие (compassion), справедливость (justice), мудрость (wisdom). Результат с интерпретацией + визуализация (радар/spider chart) |
| 5.2 | `ShareResult.tsx` | `web/src/components/interactive/ShareResult.tsx` | Кнопка «Поделиться» → копирует URL с параметрами (`?s=1,2,3`) в буфер + toast-уведомление |
| 5.3 | Улучшенный `EthicalCompass` | `web/src/components/interactive/EthicalCompass.tsx` | +3 дополнительных вопроса (сейчас 7 состояний, добавить до 10). Анимация перехода (fade-in). Индикатор прогресса. |
| 5.4 | Размещение симулятора | `web/src/pages/[lang]/simulator.astro` | Новая страница с `EthicalSimulator` + `ShareResult` |
| 5.5 | Ключи i18n | `ui.ts` | `simulator.title`, `simulator.subtitle`, `simulator.scenarios[].question/answers`, `simulator.results[]`, `simulator.scales[]`, `simulator.share`, `simulator.copied`, `compass.progress` |
| 5.6 | Ссылка в навигации | `Nav.astro` | «Симулятор»/«Simulator» |

### 6. Комментарии и реакции

| # | Что | Где | Детали |
|---|-----|-----|--------|
| 6.1 | giscus интеграция | `web/src/components/social/Comments.astro` | Astro-компонент, `<script>` giscus с атрибутами repo/category/mapping. Только для страниц модулей. |
| 6.2 | `Reactions.tsx` | `web/src/components/social/Reactions.tsx` | Preact, `client:load`. Кнопки 👍👎💡🙏. Сохраняются в `localStorage`. Визуально показывают нажатие. |
| 6.3 | Share buttons | `web/src/components/social/ShareButtons.astro` | Astro-компонент. Кнопки: Twitter/X, Telegram, Копировать ссылку. Чистый HTML, без внешних JS. Twitter: `https://twitter.com/intent/tweet?url=...&text=...`. Telegram: `https://t.me/share/url?url=...&text=...` |
| 6.4 | Размещение | `ModuleLayout.astro` | `Reactions` + `ShareButtons` внизу страницы модуля, `Comments` под ними |
| 6.5 | Настройка giscus | GitHub repo | Включить Discussions → установить giscus app → создать категорию «Module Comments» → получить config |
| 6.6 | Ключи i18n | `ui.ts` | `reactions.like`, `reactions.dislike`, `reactions.insight`, `reactions.gratitude`, `share.title`, `share.copy`, `share.copied`, `comments.title` |

## Добавляемые ключи `ui.ts`

```typescript
// Баги/i18n
'toc.title': { ru: 'Содержание', en: 'Contents' },
'module.prev': { ru: 'Предыдущий', en: 'Previous' },
'module.next': { ru: 'Следующий', en: 'Next' },
'table.number': { ru: '#', en: '#' },
'table.title': { ru: 'Название', en: 'Title' },
'table.audience': { ru: 'Аудитория', en: 'Audience' },
'table.path': { ru: 'Путь', en: 'Path' },
'daily.morning': { ru: 'Утреннее намерение', en: 'Morning intention' },
'daily.shield': { ru: 'Цифровой щит', en: 'Digital shield' },
'daily.evening': { ru: 'Вечерняя рефлексия', en: 'Evening reflection' },
'daily.allDone': { ru: '✓ Все практики выполнены', en: '✓ All practices complete' },
'compass.reset': { ru: '← Новый вопрос', en: '← New question' },
'compass.progress': { ru: 'Шаг {current} из {total}', en: 'Step {current} of {total}' },

// Счётчик
'counter.visitors': { ru: 'посетителей', en: 'visitors' },

// Форма связи
'contact.title': { ru: 'Обратная связь', en: 'Contact' },
'contact.name': { ru: 'Ваше имя', en: 'Your name' },
'contact.email': { ru: 'Email', en: 'Email' },
'contact.subject': { ru: 'Тема', en: 'Subject' },
'contact.message': { ru: 'Сообщение', en: 'Message' },
'contact.send': { ru: 'Отправить', en: 'Send' },
'contact.sending': { ru: 'Отправка...', en: 'Sending...' },
'contact.sent': { ru: 'Сообщение отправлено!', en: 'Message sent!' },
'contact.error': { ru: 'Ошибка отправки. Попробуйте позже.', en: 'Error sending. Try again later.' },

// Симуляции
'simulator.title': { ru: 'Этический симулятор', en: 'Ethical Simulator' },
'simulator.subtitle': { ru: 'Проверьте свои этические принципы в сложных ситуациях', en: 'Test your ethical principles in complex situations' },
'simulator.share': { ru: 'Поделиться результатом', en: 'Share result' },
'simulator.copied': { ru: 'Ссылка скопирована!', en: 'Link copied!' },

// Реакции
'reactions.like': { ru: 'Нравится', en: 'Like' },
'reactions.dislike': { ru: 'Не нравится', en: 'Dislike' },
'reactions.insight': { ru: 'Озарение', en: 'Insight' },
'reactions.gratitude': { ru: 'Благодарность', en: 'Gratitude' },

// Шаринг
'share.title': { ru: 'Поделиться', en: 'Share' },
'share.copy': { ru: 'Копировать ссылку', en: 'Copy link' },
'share.copied': { ru: 'Ссылка скопирована!', en: 'Link copied!' },

// Комментарии
'comments.title': { ru: 'Комментарии', en: 'Comments' },
```

## Файлы (новые и изменённые)

### Новые файлы
- `web/public/robots.txt`
- `web/public/og-image.png`
- `web/.env.example`
- `web/src/components/analytics/VisitorCounter.tsx`
- `web/src/components/forms/ContactForm.tsx`
- `web/src/pages/[lang]/contact.astro`
- `web/src/pages/[lang]/simulator.astro`
- `web/src/components/interactive/EthicalSimulator.tsx`
- `web/src/components/interactive/ShareResult.tsx`
- `web/src/components/social/Comments.astro`
- `web/src/components/social/Reactions.tsx`
- `web/src/components/social/ShareButtons.astro`

### Изменяемые файлы
- `web/src/i18n/ui.ts` (+~40 ключей)
- `web/src/layouts/BaseLayout.astro` (canonical, og:image, og:url, og:locale, JSON-LD WebSite)
- `web/src/layouts/ModuleLayout.astro` (JSON-LD: Article, BreadcrumbList, og:type=article, Comments+Reactions+ShareButtons)
- `web/src/pages/[lang]/paths/[...path].astro` (:18, фикс 404)
- `web/src/pages/404.astro` (:14-27, t())
- `web/src/components/module/TableOfContents.astro` (:11, t())
- `web/src/components/module/ModuleNav.astro` (:20, :28, t())
- `web/src/components/interactive/DailyChecklist.tsx` (:34-44, t())
- `web/src/components/interactive/EthicalCompass.tsx` (:110, t() + новые вопросы)
- `web/src/pages/[lang]/map.astro` (:22-64, t() + Lang)
- `web/src/pages/[lang]/glossary.astro` (:37-48, t())
- `web/src/components/Nav.astro` (добавить ссылки: Контакты, Симулятор)
- `web/src/components/Footer.astro` (счётчик + ссылка Контакты)
- `web/src/styles/global.css` (:126, z-index)
- `web/src/components/ThemeToggle.astro` (:15-16, CSS fix)
- `web/src/pages/sitemap.xml.ts` (hreflang)
- `web/astro.config.mjs` (env vars для Web3Forms)

## Ограничения и риски

1. **giscus требует GitHub Discussions** — нужно включить в репозитории и установить giscus app. Если невозможно — fallback на кастомный localStorage-based механизм комментариев (без авторизации).
2. **Web3Forms бесплатный тир** — 250 сообщений/мес. Выше — нужен Pro ($9/мес) или fallback на mailto.
3. **GoatCounter** — нужна регистрация аккаунта и получение кода сайта. Альтернатива: Cloudflare Analytics.
4. **Без бэкенда** — всё работает на статическом GitHub Pages. Никакие серверные функции не требуются.
5. **Канон (Модуль 0)** — неизменен.
6. **Никаких внешних ссылок** в контенте модулей (giscus/GoatCounter/Web3Forms — технические интеграции, не контентные ссылки).

## Self-Review

- [x] Нет TBD/TODO
- [x] Нет противоречий между секциями
- [x] Все ключи ui.ts перечислены
- [x] Все файлы перечислены (новые + изменяемые)
- [x] Ограничения задокументированы
- [x] Fallback-ы указаны для рискованных интеграций
