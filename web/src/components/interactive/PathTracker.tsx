import { useState, useEffect } from 'preact/hooks';
import { paths } from '../../i18n/paths';
import { modules, type ModuleMeta } from '../../i18n/modules';
import { t, type Lang } from '../../i18n/ui';

interface Props { lang: Lang; }

export default function PathTracker({ lang }: Props) {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [activePath, setActivePath] = useState<string>('quickstart');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiral-progress') || '{}');
    const p: Record<string, number> = {};
    for (const key of Object.keys(data)) {
      if (key.startsWith('progress-')) {
        p[key] = data[key];
      }
    }
    setProgress(p);
  }, []);

  function getModuleProgress(modNum: number): number {
    for (const [key, val] of Object.entries(progress)) {
      if (key.includes(`-${modNum}`) && key.includes(lang)) return val as number;
    }
    return 0;
  }

  const currentPath = paths.find((p) => p.id === activePath);
  if (!currentPath) return null;

  const allModules = [...currentPath.modules, ...(currentPath.optional || []), ...(currentPath.recommended || [])];

  return (
    <div class="path-tracker">
      <div class="path-selector">
        {paths.map((p) => (
          <button
            class={`path-tab ${activePath === p.id ? 'active' : ''}`}
            onClick={() => setActivePath(p.id)}
          >
            {p.name[lang]}
          </button>
        ))}
      </div>
      <div class="path-modules">
        <h4>{currentPath.name[lang]} — {currentPath.time[lang]}</h4>
        {allModules.map((num) => {
          const mod = modules.find((m) => m.number === num);
          const pct = getModuleProgress(num);
          const done = pct >= 80;
          if (!mod) return null;
          return (
            <a href={`/ThePath/${lang}/modules/${mod.slug}`} class={`path-module ${done ? 'done' : ''}`}>
              <span class="pm-num">{mod.number}</span>
              <span class="pm-title">{mod.title[lang]}</span>
              <span class="pm-progress">
                <span class="pm-bar" style={`width:${pct}%`} />
              </span>
              <span class="pm-pct">{pct}%</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
