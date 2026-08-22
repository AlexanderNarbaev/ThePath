import { modules } from '../../i18n/modules';
import { paths } from '../../i18n/paths';
import type { Lang } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

const pathColors: Record<string, string> = {
  quickstart: '#4CAF50', mentor: '#2196F3', coordinator: '#FF9800', statesman: '#E91E63', deep: '#9C27B0',
};

interface Props { lang: Lang; }

// Статическая круговая раскладка («спираль») — замена d3-force: детерминирована и не тянет ~200KB зависимость
const W = 640;
const H = 440;
const RX = W / 2 - 60;
const RY = H / 2 - 60;

export default function ModuleGraph({ lang }: Props) {
  const nodes = modules.map((m, i) => {
    const angle = (2 * Math.PI * i) / modules.length - Math.PI / 2;
    return {
      number: m.number,
      slug: m.slug,
      path: m.path,
      title: m.title[lang],
      x: W / 2 + RX * Math.cos(angle),
      y: H / 2 + RY * Math.sin(angle),
    };
  });
  const byNumber = new Map(nodes.map((n) => [n.number, n]));

  const seen = new Set<string>();
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const p of paths) {
    const seq = [...p.modules, ...(p.optional || []), ...(p.recommended || [])];
    for (let i = 0; i < seq.length - 1; i++) {
      const key = [seq[i], seq[i + 1]].sort((a, b) => a - b).join('-');
      if (seen.has(key)) continue;
      seen.add(key);
      const a = byNumber.get(seq[i]);
      const b = byNumber.get(seq[i + 1]);
      if (a && b) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }

  return (
    <div style="width:100%;overflow-x:auto;margin:1rem 0;background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:12px;padding:1rem;">
      <svg viewBox={`0 0 ${W} ${H}`} style="width:100%;height:auto;min-height:350px;" role="img" aria-label="Module graph">
        {edges.map((e) => (
          <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#666" stroke-width="1" stroke-opacity="0.4" />
        ))}
        {nodes.map((n) => (
          <a href={`${BASE_PATH}/${lang}/modules/${n.slug}`} aria-label={`${n.number}: ${n.title}`}>
            <g cursor="pointer">
              <circle cx={n.x} cy={n.y} r="18" fill={pathColors[n.path] || '#888'} stroke="#fff" stroke-width="2" />
              <text x={n.x} y={n.y} text-anchor="middle" dy="0.35em" fill="white" font-size="11" font-weight="600">{n.number}</text>
              <text x={n.x} y={n.y} text-anchor="middle" dy="2.3em" fill="#aaa" font-size="9">
                {n.title.length > 18 ? n.title.slice(0, 16) + '..' : n.title}
              </text>
            </g>
          </a>
        ))}
      </svg>
    </div>
  );
}
