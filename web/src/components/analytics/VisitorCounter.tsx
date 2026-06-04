import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

export default function VisitorCounter({ lang }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    fetch(`https://spiral.goatcounter.com/counter/${encodeURIComponent(path)}.json`)
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  return (
    <span class="visitor-counter" title={t('counter.visitors', lang)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {count.toLocaleString()} {t('counter.visitors', lang)}
    </span>
  );
}
