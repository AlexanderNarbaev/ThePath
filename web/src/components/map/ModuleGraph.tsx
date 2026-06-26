import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { modules } from '../../i18n/modules';
import { paths } from '../../i18n/paths';
import type { Lang } from '../../i18n/ui';
import { BASE_PATH } from '../../constants';

const pathColors: Record<string, string> = {
  quickstart: '#4CAF50', mentor: '#2196F3', coordinator: '#FF9800', statesman: '#E91E63', deep: '#9C27B0',
};

interface Props { lang: Lang; }

export default function ModuleGraph({ lang }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const container = containerRef.current;
    const svgEl = svgRef.current;

    function render() {
      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();

      const width = container?.clientWidth || 600;
      const height = Math.min(width * 0.6, 500);

      const nodes: any[] = modules.map((m) => ({ id: m.number, title: m.title[lang], path: m.path, slug: m.slug }));
      const edges: { source: number; target: number }[] = [];

      for (const p of paths) {
        const pmods = [...p.modules, ...(p.optional || []), ...(p.recommended || [])];
        for (let i = 0; i < pmods.length - 1; i++) {
          if (!edges.some((l) => (l.source === pmods[i] && l.target === pmods[i + 1]) || (l.source === pmods[i + 1] && l.target === pmods[i])))
            edges.push({ source: pmods[i], target: pmods[i + 1] });
        }
      }

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));

      svg.attr('viewBox', `0 0 ${width} ${height}`);

      const link = svg.append('g').selectAll('line').data(edges).join('line')
        .attr('stroke', '#666').attr('stroke-width', 1).attr('stroke-opacity', 0.4);

      const node = svg.append('g').selectAll('g').data(nodes).join('g')
        .attr('cursor', 'pointer')
        .attr('tabindex', 0)
        .attr('role', 'link')
        .attr('aria-label', (d: any) => `${d.id}: ${d.title}`)
        .on('click', (_e: any, d: any) => { window.location.href = `${BASE_PATH}/${lang}/modules/${d.slug}`; })
        .on('keydown', (event: any, d: any) => {
          if (event.key === 'Enter') {
            window.location.href = `${BASE_PATH}/${lang}/modules/${d.slug}`;
          }
        });

      node.append('circle').attr('r', 18).attr('fill', (d: any) => pathColors[d.path] || '#888')
        .attr('stroke', '#fff').attr('stroke-width', 2);

      node.append('text').text((d: any) => d.id).attr('text-anchor', 'middle').attr('dy', '0.35em')
        .attr('fill', 'white').attr('font-size', '11px').attr('font-weight', '600');

      node.append('text').text((d: any) => d.title.length > 18 ? d.title.slice(0, 16) + '..' : d.title)
        .attr('text-anchor', 'middle').attr('dy', '2.3em').attr('fill', '#aaa').attr('font-size', '9px');

      simulation.on('tick', () => {
        link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      });

      return simulation;
    }

    let sim = render();

    const observer = new ResizeObserver(() => {
      sim?.stop();
      sim = render();
    });
    if (container) observer.observe(container);

    return () => {
      sim?.stop();
      observer.disconnect();
    };
  }, [lang]);

  return (
    <div ref={containerRef} style="width:100%;overflow-x:auto;margin:1rem 0;background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:12px;padding:1rem;">
      <svg ref={svgRef} style="width:100%;height:auto;min-height:350px;" />
    </div>
  );
}
