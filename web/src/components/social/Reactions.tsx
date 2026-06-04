import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; pageId: string; }

const EMOJIS = [
  { key: 'like', emoji: '👍' },
  { key: 'dislike', emoji: '👎' },
  { key: 'insight', emoji: '💡' },
  { key: 'gratitude', emoji: '🙏' },
] as const;

export default function Reactions({ lang, pageId }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-reactions') || '{}');
    if (data[pageId]) setActive(data[pageId]);
  }, [pageId]);

  function react(key: string) {
    const newVal = active === key ? null : key;
    setActive(newVal);
    const data = JSON.parse(localStorage.getItem('spiral-reactions') || '{}');
    if (newVal) data[pageId] = newVal;
    else delete data[pageId];
    localStorage.setItem('spiral-reactions', JSON.stringify(data));
  }

  return (
    <div class="reactions">
      <span class="reactions-title">{t('reactions.title', lang)}</span>
      {EMOJIS.map(({ key, emoji }) => (
        <button
          class={`reaction-btn ${active === key ? 'active' : ''}`}
          onClick={() => react(key)}
          aria-label={t(`reactions.${key}` as any, lang)}
          title={t(`reactions.${key}` as any, lang)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
