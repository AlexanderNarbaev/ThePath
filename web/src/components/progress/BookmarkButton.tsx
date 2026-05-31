import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { module_number: number; lang: Lang; }

export default function BookmarkButton({ module_number, lang }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const key = `bookmark-${lang}-${module_number}`;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
    setBookmarked(!!data[key]);
  }, []);

  function toggle() {
    const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
    if (bookmarked) delete data[key]; else data[key] = Date.now();
    localStorage.setItem('spiral-progress', JSON.stringify(data));
    setBookmarked(!bookmarked);
  }

  return (
    <button class="bookmark-btn" onClick={toggle} title={bookmarked ? t('bookmark.remove', lang) : t('bookmark.add', lang)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}
