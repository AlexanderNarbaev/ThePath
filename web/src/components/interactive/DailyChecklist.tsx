import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

export default function DailyChecklist({ lang }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [items, setItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-daily') || '{}');
    setItems(data[today] || { morning: false, shield: false, evening: false });
  }, []);

  function toggle(key: string) {
    const newItems = { ...items, [key]: !items[key] };
    setItems(newItems);
    const data = JSON.parse(localStorage.getItem('spiral-daily') || '{}');
    data[today] = newItems;
    localStorage.setItem('spiral-daily', JSON.stringify(data));
  }

  const done = items.morning && items.shield && items.evening;
  const count = [items.morning, items.shield, items.evening].filter(Boolean).length;

  return (
    <div class={`daily-checklist ${done ? 'done' : ''}`}>
      <div class="dc-header">
        <span class="dc-title">{today.replace(/-/g, '.')}</span>
        <span class="dc-count">{count}/3</span>
      </div>
      <label class={`dc-item ${items.morning ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.morning || false} onChange={() => toggle('morning')} />
        <span>{t('daily.morning', lang)}</span>
      </label>
      <label class={`dc-item ${items.shield ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.shield || false} onChange={() => toggle('shield')} />
        <span>{t('daily.shield', lang)}</span>
      </label>
      <label class={`dc-item ${items.evening ? 'checked' : ''}`}>
        <input type="checkbox" checked={items.evening || false} onChange={() => toggle('evening')} />
        <span>{t('daily.evening', lang)}</span>
      </label>
      {done && <div class="dc-done">{t('daily.allDone', lang)}</div>}
    </div>
  );
}
