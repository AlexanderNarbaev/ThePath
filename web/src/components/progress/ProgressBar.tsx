import { useEffect, useState } from 'preact/hooks';
import type { Lang } from '../../i18n/ui';

interface Props { module_number: number; lang: Lang; }

export default function ProgressBar({ module_number, lang }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      setProgress(pct);
      const key = `progress-${lang}-${module_number}`;
      const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
      data[key] = Math.max(data[key] || 0, pct);
      localStorage.setItem('spiral-progress', JSON.stringify(data));
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div class="progress-container" style={`--p:${progress}%`}>
      <div class="progress-fill" />
    </div>
  );
}
