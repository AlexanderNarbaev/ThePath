import { useEffect, useRef, useState } from 'preact/hooks';
import { modules } from '../../i18n/modules';
import { t, type Lang } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

interface Props { lang: Lang; }

interface Result { slug: string; num: number; title: string; snippet?: string; }

interface IndexEntry { slug: string; number: number; title: string; subtitle: string; text: string; }

function makeSnippet(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return '';
  const start = Math.max(0, i - 60);
  const end = Math.min(text.length, i + q.length + 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export default function SearchModal({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    if (index === null) {
      fetch(`${BASE_PATH}/search-index-${lang}.json`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data: IndexEntry[]) => setIndex(data))
        .catch(() => setIndex([]));
    }
  }, [open]);

  function searchModules(q: string) {
    setQuery(q);
    const queryLower = q.toLowerCase().trim();
    if (!queryLower) { setResults([]); return; }

    // 1. Title/subtitle matches from static metadata
    const titleHits: Result[] = modules
      .filter((m) =>
        m.title[lang].toLowerCase().includes(queryLower) ||
        m.subtitle[lang].toLowerCase().includes(queryLower)
      )
      .map((m) => ({ slug: m.slug, num: m.number, title: m.title[lang] }));

    // 2. Full-text matches from lazily loaded content index
    const contentHits: Result[] = (index ?? [])
      .filter((e) => e.text.toLowerCase().includes(queryLower))
      .map((e) => ({ slug: e.slug, num: e.number, title: e.title, snippet: makeSnippet(e.text, queryLower) }));

    const seen = new Set(titleHits.map((r) => r.slug));
    setResults([...titleHits, ...contentHits.filter((r) => !seen.has(r.slug))].slice(0, 10));
  }

  if (!open) return (
    <button class="search-trigger" onClick={() => setOpen(true)} title={t('nav.search', lang)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span class="search-shortcut">{t('nav.search_shortcut', lang)}</span>
    </button>
  );

  return (
    <div class="search-overlay" onClick={(e: any) => { if (e.target.classList.contains('search-overlay')) setOpen(false); }}>
      <div class="search-modal">
        <input ref={inputRef} type="text" placeholder={t('search.placeholder', lang)} value={query}
          onInput={(e: any) => searchModules(e.target.value)} class="search-input" />
        <div class="search-results">
          {results.length === 0 && query && <p class="search-empty">{t('search.empty', lang)}</p>}
          {results.map((r) => (
            <a href={`${BASE_PATH}/${lang}/modules/${r.slug}`} class="search-result" onClick={() => setOpen(false)}>
              <span class="search-result-num">{r.num}</span>
              <span class="search-result-body">
                <span>{r.title}</span>
                {r.snippet && <span class="search-snippet">{r.snippet}</span>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
