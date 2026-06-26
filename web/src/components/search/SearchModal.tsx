import { useEffect, useRef, useState } from 'preact/hooks';
import lunr from 'lunr';
import { modules } from '../../i18n/modules';
import { t, type Lang } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

interface Props { lang: Lang; }

interface Doc { id: number; title: string; }

let idx: lunr.Index | null = null;
let docs: Doc[] = [];

export default function SearchModal({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
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

  function buildIndex() {
    if (idx) return;
    setLoading(true);
    docs = modules.map((m) => ({ id: m.number, title: m.title[lang] }));
    idx = lunr(function (this: any) {
      this.ref('id');
      this.field('title', { boost: 10 });
      docs.forEach((d: Doc) => this.add(d));
    });
    setLoading(false);
  }

  useEffect(() => { if (open) buildIndex(); }, [open]);

  function search(q: string) {
    setQuery(q);
    if (!q.trim() || !idx) { setResults([]); return; }
    const found = idx.search(q).slice(0, 8);
    setResults(found.map((r: any) => docs.find((d) => d.id === Number(r.ref))!).filter(Boolean));
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
          onInput={(e: any) => search(e.target.value)} class="search-input" />
        <div class="search-results">
          {loading && <p class="search-empty">...</p>}
          {!loading && results.length === 0 && query && <p class="search-empty">{t('search.empty', lang)}</p>}
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
