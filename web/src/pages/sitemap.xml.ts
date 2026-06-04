import type { APIRoute } from 'astro';
import { modules } from '../i18n/modules';
import { paths } from '../i18n/paths';

const BASE = 'https://alexandernarbaev.github.io/ThePath';

export const GET: APIRoute = () => {
  const pages: { loc: string; lastmod: string; priority: number }[] = [];

  const now = '2026-05-31';

  pages.push({ loc: `${BASE}/`, lastmod: now, priority: 1.0 });
  pages.push({ loc: `${BASE}/ru/`, lastmod: now, priority: 1.0 });
  pages.push({ loc: `${BASE}/en/`, lastmod: now, priority: 1.0 });
  pages.push({ loc: `${BASE}/ru/map`, lastmod: now, priority: 0.9 });
  pages.push({ loc: `${BASE}/en/map`, lastmod: now, priority: 0.9 });
  pages.push({ loc: `${BASE}/ru/manifesto`, lastmod: now, priority: 0.9 });
  pages.push({ loc: `${BASE}/en/manifesto`, lastmod: now, priority: 0.9 });
  pages.push({ loc: `${BASE}/ru/glossary`, lastmod: now, priority: 0.8 });
  pages.push({ loc: `${BASE}/en/glossary`, lastmod: now, priority: 0.8 });
  pages.push({ loc: `${BASE}/ru/contact`, lastmod: now, priority: 0.6 });
  pages.push({ loc: `${BASE}/en/contact`, lastmod: now, priority: 0.6 });
  pages.push({ loc: `${BASE}/ru/simulator`, lastmod: now, priority: 0.7 });
  pages.push({ loc: `${BASE}/en/simulator`, lastmod: now, priority: 0.7 });

  const langs = ['ru', 'en'] as const;
  for (const lang of langs) {
    for (const mod of modules) {
      pages.push({ loc: `${BASE}/${lang}/modules/${mod.slug}`, lastmod: now, priority: 0.8 });
    }
    for (const path of paths) {
      pages.push({ loc: `${BASE}/${lang}/paths/${path.id}`, lastmod: now, priority: 0.7 });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((p) => {
    const isRu = p.loc.includes('/ru/');
    const otherLang = isRu ? 'en' : 'ru';
    const altUrl = isRu
      ? p.loc.replace('/ru/', '/en/')
      : p.loc.replace('/en/', '/ru/');
    return `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="${isRu ? 'ru' : 'en'}" href="${p.loc}" />
    <xhtml:link rel="alternate" hreflang="${otherLang}" href="${altUrl}" />
  </url>`;
  }).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
