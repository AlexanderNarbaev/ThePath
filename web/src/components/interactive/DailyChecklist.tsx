import { useState, useEffect } from 'preact/hooks';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

type DayData = Record<string, boolean>;
type Store = Record<string, DayData>;

const isDayComplete = (d?: DayData) => !!(d && d.morning && d.shield && d.evening);

function calcStreak(data: Store): number {
  const d = new Date();
  // Если сегодня ещё не всё выполнено, серия считается со вчерашнего дня
  if (!isDayComplete(data[d.toISOString().slice(0, 10)])) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (isDayComplete(data[d.toISOString().slice(0, 10)])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function DailyChecklist({ lang }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [items, setItems] = useState<DayData>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data: Store = JSON.parse(localStorage.getItem('spiral-daily') || '{}');
    setItems(data[today] || { morning: false, shield: false, evening: false });
    setStreak(calcStreak(data));
  }, []);

  function toggle(key: string) {
    const newItems = { ...items, [key]: !items[key] };
    setItems(newItems);
    const data: Store = JSON.parse(localStorage.getItem('spiral-daily') || '{}');
    data[today] = newItems;
    localStorage.setItem('spiral-daily', JSON.stringify(data));
    setStreak(calcStreak(data));
  }

  const done = isDayComplete(items);
  const count = [items.morning, items.shield, items.evening].filter(Boolean).length;

  return (
    <div class={`daily-checklist ${done ? 'done' : ''}`}>
      <div class="dc-header">
        <span class="dc-title">{today.replace(/-/g, '.')}</span>
        <span class="dc-meta">
          {streak > 0 && (
            <span class="dc-streak" title={t('daily.streak', lang)}>🔥 {streak}</span>
          )}
          <span class="dc-count">{count}/3</span>
        </span>
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
