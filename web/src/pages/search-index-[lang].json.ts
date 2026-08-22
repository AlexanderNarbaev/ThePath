import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LOCALES } from '../constants';
import { modules as moduleMeta } from '../i18n/modules';

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as 'ru' | 'en';
  const entries = await getCollection('modules', (e) => e.data.lang === lang);
  const index = entries.map((e) => {
    const slug = e.id.split('/').pop() || e.id;
    const meta = moduleMeta.find((m) => m.slug === slug);
    return {
      slug,
      number: e.data.module_number,
      title: e.data.title,
      subtitle: e.data.subtitle ?? meta?.subtitle[lang] ?? '',
      text: stripMarkdown(e.body ?? ''),
    };
  });
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
