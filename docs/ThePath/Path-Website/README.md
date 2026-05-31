# The Path — Website

A production-ready multilingual website for "The Path — Evolutionary Framework of Flourishing" (Version 12.1).

## Overview

This is a static JAMstack website built with vanilla HTML, CSS, and JavaScript. It features:
- **Multilingual support**: English (primary) and Russian
- **Dark/Light theme**: Toggle with persistent storage
- **Interactive features**: Daily practice tracker, 30-day guide, FAQ accordion
- **Responsive design**: Mobile-first, works on all devices
- **Accessible**: Semantic HTML, keyboard navigation, WCAG 2.1 AA

## Project Structure

```
Path-Website/
├── index.html              # Home page
├── about.html              # About page
├── ethics.html             # Ethics page
├── practices.html          # Daily practices
├── community.html          # Community charter
├── economy.html            # Economy model
├── politics.html           # Politics & governance
├── education.html          # Education
├── health.html             # Health & body
├── family.html             # Family & relationships
├── library.html            # Book library
├── stories.html            # Parables
├── symbols.html            # Symbols & art
├── festivals.html          # Festivals & calendar
├── global.html             # Global coordination
├── evolution.html          # System evolution
├── faq.html                 # FAQ accordion
├── manifesto.html          # Adoption manifesto
├── roadmap.html            # Implementation roadmap
├── quickstart.html         # 30-day guide
├── resources.html          # Downloads
├── contact.html            # Contact form
├── src/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   └── js/
│       └── main.js         # JavaScript functionality
└── README.md               # This file
```

## Running Locally

### Option 1: Simple HTTP Server

```bash
# Python 3
python -m http.server 8000

# Or Node.js (if installed)
npx http-server .
```

Then open http://localhost:8000 in your browser.

### Option 2: VS Code Live Server

1. Install the "Live Server" extension
2. Right-click index.html and select "Open with Live Server"

## Deployment

### Netlify (Recommended)

1. Push code to GitHub
2. Connect to Netlify
3. Deploy from the `main` branch
4. Custom domain can be configured

### Vercel

```bash
npm i -g vercel
vercel
```

### GitHub Pages

1. Go to Settings > Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)

## Features

- **Daily Practice Tracker**: Check off morning intention and evening reflection (saved to localStorage)
- **30-Day Guide**: Interactive day-by-day guide with progress saved to localStorage
- **Festival Countdown**: Shows days until next seasonal festival
- **Library Search**: Filter books by category and search by title/author
- **FAQ Accordion**: Expandable answers to common questions
- **Theme Toggle**: Switch between dark and light modes
- **Language Switcher**: Toggle between English and Russian

## Content Sources

All content is sourced from the original Markdown documents in `/home/narbaevay@cloudx.group/Desktop/Path/`:
- English: `01_OnePageSummary.md` - `20_QuickStart.md`
- Russian: `RU/01_KratkoyeRezume.md` - `RU/20_Startovyy_Gayd.md`

## Design System

- **Colors**: Dark blue (#0F172A), Gold (#FBBF24), White (#FFFFFF)
- **Fonts**: System fonts (Inter, Roboto, sans-serif)
- **Symbol**: ❂ Open Spiral (growth without closure)
- **Style**: Minimalist, clean, accessible

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Support for older browsers via CSS fallbacks

## License

Creative Commons Attribution 4.0 International (CC BY 4.0)

## Version

Version 12.1 — Final