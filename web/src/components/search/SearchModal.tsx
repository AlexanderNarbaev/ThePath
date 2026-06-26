import { useEffect, useRef, useState } from 'preact/hooks';
import { modules } from '../../i18n/modules';
import { t, type Lang } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

interface Props { lang: Lang; }

interface Doc { id: number; title: string; }

export default function SearchModal({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Doc[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  function searchModules(q: string) {
    setQuery(q);
    const queryLower = q.toLowerCase().trim();
    if (!queryLower) { setResults([]); return; }
    const found = modules.filter((m) =>
      m.title[lang].toLowerCase().includes(queryLower) ||
      m.subtitle[lang].toLowerCase().includes(queryLower)
    ).slice(0, 10);
    setResults(found.map((m) => ({ id: m.number, title: m.title[lang] })));
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
          {results.map((r) => {
            const mod = modules.find((m) => m.number === r.id);
            if (!mod) return null;
            return (
              <a href={`${BASE_PATH}/${lang}/modules/${mod.slug}`} class="search-result" onClick={() => setOpen(false)}>
                <span class="search-result-num">{mod.number}</span><span>{mod.title[lang]}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
