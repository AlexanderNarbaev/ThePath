# The Path — Website

A multilingual static website for "The Path — Evolutionary Framework of Flourishing" (Version 12.1).

## Overview

This is a static website built with HTML, CSS, and vanilla JavaScript. It presents the Path's philosophy, ethics, practices, community charter, and more in both English and Russian.

## Features

- **Multilingual Support**: English and Russian
- **Dark/Light Theme Toggle**: Persistent preference
- **Daily Practice Tracker**: Interactive checkbox with local storage
- **30-Day Guide Tracker**: Clickable day grid with progress saving
- **FAQ Accordion**: Expandable questions
- **Library Search**: Real-time filtering by category
- **Festival Countdown**: Dynamic countdown to next festival

## Structure

```
/Path_Website/
  /css/
    styles.css          # Main stylesheet
  /js/
    main.js             # All interactive features
  /en/
    index.html          # English home
    about.html          # About page
    practices.html      # Practices page
    faq.html            # FAQ page
    quickstart.html     # 30-day guide
    library.html        # Library page
    ...                 # More pages
  /ru/
    index.html          # Russian home
    ...                 # Russian translations
```

## Running Locally

### Option 1: Simple HTTP Server

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000/en/
```

### Option 2: Using npx

```bash
npx serve /Path_Website/en
```

### Option 3: VS Code Live Server

Open the folder in VS Code and use the Live Server extension.

## Building

This is a static site — no build step required. All files are ready to serve.

## Deployment

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select main branch as source
4. Your site will be at `https://username.github.io/repo/`

### Netlify

1. Drag and drop the `/Path_Website` folder to Netlify
2. Or connect your Git repository
3. Set build command: (empty)
4. Publish directory: `/Path_Website/en` (or `/ru`)

### Vercel

```bash
npm i -g vercel
vercel deploy --prod
```

## Content

All content is sourced from the Markdown documents in `/home/narbaevay@cloudx.group/Desktop/Path/`.

## License

Creative Commons Attribution 4.0 International (CC BY 4.0)

## Version

Version 12.1 — Final
