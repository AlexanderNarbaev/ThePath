# Спираль Сознания / Spiral of Consciousness

**Моральный компас для человека, гражданина и власти.**
Открытая, эволюционирующая система практик, этики и мировоззрения
для навигации в эпоху Великого Испытания (XXI–XXIII века).

## Три запрета

**Не убивай. Не пытай. Не порабощай.** — абсолютные красные линии.

## Четыре принципа

**Развивай себя. Твори и помогай. Думай на долгосрочное будущее. Сохраняй и умножай сознание.**

## Структура репозитория

```
├── docs/                    # 15 модулей, Манифест, Карта-путеводитель
│   ├── INDEX.md             # Карта знаний
│   ├── Manifesto.md         # Манифест Спирали Сознания
│   ├── Map.md               # Карта-путеводитель
│   ├── Module_0.md  - Module_14.md  # Модули системы
│   ├── Prompts.md           # AI-промпты регенерации документов
│   └── Archive/             # Предыдущие версии документов
├── web/                     # Astro-сайт
│   ├── src/
│   │   ├── content/         # Markdown-контент (RU + EN)
│   │   ├── components/      # Astro + Preact компоненты
│   │   ├── layouts/         # Шаблоны страниц
│   │   ├── pages/           # Маршруты
│   │   ├── i18n/            # Локализация
│   │   └── styles/          # Tailwind CSS
│   ├── public/              # Статические файлы
│   └── astro.config.mjs
├── infra/                   # Docker Compose, WireMock
├── wal/                     # Write-Ahead Log сессий
├── .github/workflows/       # CI/CD (GitHub Pages)
└── .gitverse/workflows/     # CI/CD (GitVerse Pages)
```

## Сайт

🌐 **[alexandernarbaev.github.io/ThePath](https://alexandernarbaev.github.io/ThePath)**

## Разработка

```bash
cd web
npm install
npm run dev          # dev-сервер на http://localhost:4321
npm run build        # продакшн-сборка в dist/
```

## Лицензия

[CC BY-SA 4.0](LICENSE)
