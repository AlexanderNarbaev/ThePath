import type { APIRoute } from 'astro';
import { modules } from '../i18n/modules';

const BASE = 'https://alexandernarbaev.github.io/ThePath';

export const GET: APIRoute = () => {
  const items: string[] = [];

  for (const lang of ['ru', 'en']) {
    const langName = lang === 'ru' ? 'ru' : 'en';
    items.push(`<item>
    <title>${lang === 'ru' ? 'Спираль Сознания' : 'Spiral of Consciousness'}</title>
    <link>${BASE}/${lang}/</link>
    <description>${lang === 'ru' ? 'Моральный компас для человека, гражданина и власти' : 'A Moral Compass for the Individual, the Citizen, and Authority'}</description>
    <language>${lang}</language>
    <pubDate>Sat, 31 May 2026 00:00:00 GMT</pubDate>
  </item>`);

    for (const mod of modules) {
      items.push(`<item>
    <title>${mod.title[lang as 'ru' | 'en']} — ${lang === 'ru' ? 'Модуль' : 'Module'} ${mod.number}</title>
    <link>${BASE}/${lang}/modules/${mod.slug}</link>
    <description>${mod.subtitle[lang as 'ru' | 'en']}</description>
    <language>${lang}</language>
    <pubDate>Sat, 31 May 2026 00:00:00 GMT</pubDate>
  </item>`);
    }
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Спираль Сознания / Spiral of Consciousness</title>
    <link>${BASE}/</link>
    <description>Моральный компас для человека, гражданина и власти. A Moral Compass for the Individual, the Citizen, and Authority.</description>
    <language>ru</language>
    <lastBuildDate>Sat, 31 May 2026 00:00:00 GMT</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join('\n    ')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
