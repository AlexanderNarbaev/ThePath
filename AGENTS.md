# AGENTS.md — ThePath / Спираль Сознания

Этот файл предназначен для ИИ-агентов, работающих с репозиторием. Читатель ничего не знает о проекте заранее. Основной язык документации и комментариев проекта — **русский**; отвечайте на русском, технические термины оставляйте на английском.

## 1. Обзор проекта

**ThePath («Спираль Сознания»)** — открытая, эволюционирующая система практик, этики и мировоззрения («моральный компас для человека, гражданина и власти»). Репозиторий содержит:

1. **Контентную базу знаний** — 15 модулей (Модуль 0 «Канон» … Модуль 14), Манифест и Карту-путеводитель на русском языке в `docs/`.
2. **Статический веб-сайт** на Astro 5 в `web/` — двуязычный (ru/en), публикуемый на GitHub Pages и GitVerse Pages.
3. **Инфраструктуру для ИИ-агентов** — WAL (write-ahead log) сессий, спецификации, конфигурацию OpenCode, вспомогательные скрипты.

Продакшен-сайт: https://alexandernarbaev.github.io/ThePath
Репозиторий: `git@github.com:AlexanderNarbaev/ThePath.git` (ветка `main`).
Лицензия: CC BY-SA 4.0 (`LICENSE`).

## 2. Структура репозитория

```
├── docs/                    # База знаний (RU): 15 модулей, Манифест, Карта
│   ├── INDEX.md             # Карта знаний — читать первой при работе с docs/
│   ├── Manifesto.md, Map.md
│   ├── Module_0.md … Module_14.md
│   ├── Prompts.md           # AI-промпты регенерации документов
│   ├── Archive/             # Предыдущие версии документов
│   └── ThePath/             # Легаси-версии сайтов (vanilla HTML/JS, JAMstack) — не редактировать
├── web/                     # Astro-сайт (основной код проекта)
│   ├── src/
│   │   ├── content/         # Content Collections: modules/{ru,en}/, pages/{ru,en}/
│   │   ├── components/      # Astro + Preact компоненты (по доменам: module/, interactive/, …)
│   │   ├── layouts/         # BaseLayout.astro, ModuleLayout.astro
│   │   ├── pages/           # Маршруты: [lang]/…, rss.xml.ts, sitemap.xml.ts, 404.astro
│   │   ├── i18n/            # ui.ts (UI-строки), modules.ts, paths.ts
│   │   ├── hooks/, utils/, types/, constants.ts, styles/global.css
│   ├── public/              # favicon, manifest.json, robots.txt, og-image.svg
│   ├── astro.config.mjs, tsconfig.json, package.json
├── infra/docker-compose.yml # Универсальное dev-окружение (Postgres, Kafka, Redis, Mongo, MinIO, WireMock)
├── scripts/sinv_tool.py     # Автономный Python-инструмент для крауд-платформы СИНВ (не связан с сайтом)
├── specs/_template.md       # Шаблон спецификации (SDD: FR/AC/NFR, статусы, волны)
├── wal/                     # WAL сессий: GLOBAL_WAL.md, SESSION_WAL.md, state.yaml
├── memory/constitution.md   # Конституция проекта (принципы SDD)
├── src/lib/                 # Bash-модули из opencode_initializer (context-selector, auto-skills, task-distributor)
├── .github/workflows/deploy.yml      # CI: GitHub Pages
├── .gitverse/workflows/pages.yml     # CI: GitVerse Pages
├── .opencode/               # Конфигурация OpenCode (агенты, skills, state)
└── output/                  # Результаты работы скриптов (например, sinv-анализ)
```

Примечание: `infra/docker-compose.yml` — это **универсальный шаблон окружения** (Postgres 18, Kafka, MongoDB 8, Redis 7, MinIO, WireMock), а не зависимость сайта. Сайт полностью статический и не требует запуска этих сервисов.

## 3. Технологический стек (web/)

| Компонент | Версия |
|-----------|--------|
| Astro | 5.x (статическая сборка) |
| Preact | 10.x (`@astrojs/preact`) — интерактивные островки |
| Tailwind CSS | 4.x (через `@tailwindcss/vite`) |
| TypeScript | 5.7+ (`astro/tsconfigs/strict`) |
| d3 | 7.x — граф модулей (`components/map/ModuleGraph.tsx`) |
| Node.js | 22 (в CI) |

Ключевые файлы конфигурации:
- `web/package.json` — зависимости и npm-скрипты.
- `web/astro.config.mjs` — site URL, `base` (через env `BASE_PATH`, по умолчанию `/ThePath`), i18n (locales `ru`, `en`; `prefixDefaultLocale: true`, дефолт — `ru`).
- `web/tsconfig.json` — строгий режим, алиас `@/*` → `src/*`, JSX через Preact.
- `web/src/content/config.ts` — Zod-схемы Content Collections (`modules`, `pages`).

## 4. Сборка и команды

Все команды выполняются из каталога `web/`:

```bash
cd web
npm install        # установка зависимостей (в CI используется npm ci)
npm run dev        # dev-сервер: http://localhost:4321
npm run build      # astro check && astro build → dist/ (это и есть проверка типов)
npm run preview    # предпросмотр собранного сайта
```

Переменные окружения:
- `BASE_PATH` — базовый путь деплоя (`/ThePath` для GitHub Pages, `/thepath` для GitVerse).
- `PUBLIC_WEB3FORMS_KEY` — публичный ключ формы контактов (Web3Forms), см. `web/.env.example`.

**Тестов в проекте нет.** Единственная автоматическая проверка — `npm run build` (включает `astro check` с типизацией и валидацией Zod-схем контента). Перед PR обязательно убедитесь, что сборка проходит (см. `CONTRIBUTING.md`).

## 5. Архитектура сайта

- **Статическая генерация (SSG)** без серверного рантайма; `dist/` публикуется целиком.
- **i18n по маршрутам:** все страницы под `src/pages/[lang]/`; `getStaticPaths` строится из `LOCALES` (`src/constants.ts`, `src/utils/static-paths.ts`).
- **Контент как данные:** модули и страницы — Markdown с YAML-фронтматтером в `src/content/`, валидируемый Zod-схемами. Имена файлов модулей: `{номер}-{slug}.md` (например, `0-canon.md`), схема требует `module_number`, `title`, `lang`; поле `path` задаёт «путь изучения» (`quickstart|mentor|coordinator|statesman|deep`).
- **Островная модель:** статическая разметка — Astro-компоненты (`.astro`); интерактив — Preact-компоненты (`.tsx`: чек-листы, трекеры, симулятор, поиск, реакции).
- **UI-строки** централизованы в `src/i18n/ui.ts` — новые строки добавлять для **обоих** языков.
- **Тёмная тема:** все компоненты обязаны работать в `[data-theme="dark"]`.
- SEO: `rss.xml.ts`, `sitemap.xml.ts`, `public/robots.txt`, `og-image.svg`.
- Аналитика: GoatCounter; комментарии — giscus (GitHub Discussions); см. актуальный статус в `wal/GLOBAL_WAL.md`.

## 6. Работа с контентом и переводами

Полное руководство — `TRANSLATION.md`. Кратко:
- Модули живут в `web/src/content/modules/{lang}/`; фронтматтер должен соответствовать схеме из `web/src/content/config.ts`.
- Новый язык: создать `content/modules/{lang}/` + `content/pages/{lang}/`, добавить UI-строки в `i18n/ui.ts`, добавить locale в `astro.config.mjs` и в `LOCALES` в `src/constants.ts`.
- Перевод — по смыслу, не дословный; ключевые термины переводить согласованно; сохранять разметку (таблицы, чек-листы, цитаты).
- **Канон (`Module_0` / `0-canon.md`) — защищённая зона: только дополнения, ядро неизменно** (зафиксировано в `wal/GLOBAL_WAL.md`).

## 7. CI/CD и деплой

Два параллельных пайплайна, триггер — push в `main`:

- **GitHub Pages** — `.github/workflows/deploy.yml`: Node 22, `npm ci` + `npm run build` в `web/` с `BASE_PATH=/ThePath`, деплой `web/dist` через `actions/deploy-pages`.
- **GitVerse Pages** — `.gitverse/workflows/pages.yml`: то же, но `BASE_PATH=/thepath`.

Локальной верификацией перед пушем служит `npm run build`.

## 8. Конвенции кода

- Компоненты маленькие, с одной ответственностью; один файл — один компонент (`CONTRIBUTING.md`).
- Стили — Tailwind CSS-токены, темы и базовые стили в `web/src/styles/global.css`.
- Импорты через алиас `@/*` (см. `tsconfig.json`).
- Ветки: `feature/short-description` → PR в `main`.
- Контент документации в `docs/` — на русском; при изменении структуры документов обновлять `docs/INDEX.md`.

## 9. Инфраструктура ИИ-агентов (внутренняя)

Проект ведётся с участием ИИ-агентов; для них в репозитории есть служебные механизмы:

- **WAL (Write-Ahead Log):** `wal/GLOBAL_WAL.md` (глобальное состояние проекта: статус, активная задача, защищённые зоны) и `wal/SESSION_WAL.md` (сессионный). Формат — три строки: `📍 Status`, `🚀 Active`, `🛑 Protected`. При значимых изменениях артефактов предлагайте обновить WAL. Сессионные блокировки — каталог `.lock/` (в `.gitignore`).
- **Спецификации (SDD):** новые фичи описываются по шаблону `specs/_template.md` (FR с GIVEN/WHEN/THEN, acceptance criteria, NFR, волны). Принципы SDD — в `memory/constitution.md`.
- **OpenCode:** конфигурация в `opencode.json` и `.opencode/` (агенты `@pm`, `@developer`, `@qa` и др., skills). Файлы `opencode.json*.bak` — резервные копии, не редактировать.
- **`src/lib/*.sh`** — bash-модули из внешнего репозитория `opencode_initializer` (выбор MCP/LSP под задачу, авто-подсказка skills, распределение задач по агентам). Используются установщиком окружения; при редактировании помнить, что канонический источник — upstream.
- **`scripts/sinv_tool.py`** — самостоятельный CLI-инструмент (Python 3.9+, `requests` + `beautifulsoup4`) для работы с крауд-платформой СИНВ; к сайту отношения не имеет. Результаты — в `output/sinv/`.

## 10. Безопасность

- Секреты не коммитить: `.env`, `.env.local` — в `.gitignore`; `.sinv_session` (cookie сессии) тоже не подлежит публикации.
- `PUBLIC_WEB3FORMS_KEY` — публичный ключ (ограничен доменом), его присутствие в CI допустимо.
- Пароли в `infra/docker-compose.yml` — только значения по умолчанию для локальной разработки; реальные значения передаются через env (`PG_PASSWORD`, `MONGO_PASSWORD`, `MINIO_PASSWORD`).
- Сайт статический, бэкенда и пользовательских данных нет; форма контактов — через внешний Web3Forms.
- Файл `SECURITY` в корне пуст — политика безопасности не оформлена.
