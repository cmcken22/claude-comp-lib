import { useEffect, useRef } from 'react';

// Night-time job-site skyline in three depth layers. Each layer moves at its own
// rate as the page scrolls, so the header reads as a parallax scene.
const rand = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function buildings(seed: number, count: number, minH: number, maxH: number, w = 1600, h = 220) {
  const r = rand(seed);
  const out: { x: number; y: number; w: number; h: number; lights: [number, number][] }[] = [];
  let x = -20;
  for (let i = 0; i < count && x < w; i++) {
    const bw = 40 + r() * 90;
    const bh = minH + r() * (maxH - minH);
    const lights: [number, number][] = [];
    for (let ly = h - bh + 12; ly < h - 10; ly += 14)
      for (let lx = x + 8; lx < x + bw - 8; lx += 12) if (r() > 0.82) lights.push([lx, ly]);
    out.push({ x, y: h - bh, w: bw, h: bh, lights });
    x += bw + 4 + r() * 18;
  }
  return out;
}

const FAR = buildings(7, 40, 40, 120);
const MID = buildings(42, 26, 70, 170);

function Crane({ x, mast, jib, flip = false }: { x: number; mast: number; jib: number; flip?: boolean }) {
  const top = 220 - mast;
  const dir = flip ? -1 : 1;
  const tip = x + jib * dir;
  const back = x - jib * 0.35 * dir;
  const lattice = [];
  for (let y = 220; y > top + 8; y -= 12) lattice.push(<path key={y} d={`M${x - 5},${y} L${x + 5},${y - 12} M${x + 5},${y} L${x - 5},${y - 12}`} />);
  return (
    <g className="cd-sky__crane">
      <path d={`M${x - 5},220 V${top} M${x + 5},220 V${top}`} />
      {lattice}
      <path d={`M${back},${top} H${tip} M${x},${top - 22} L${tip},${top} M${x},${top - 22} L${back},${top} M${x},${top} V${top - 22}`} />
      <rect className="cd-sky__counter" x={Math.min(back, back + 18 * dir)} y={top} width="18" height="10" />
      <path className="cd-sky__cable" d={`M${x + jib * 0.7 * dir},${top} V${top + 70}`} />
      <rect className="cd-sky__load" x={x + jib * 0.7 * dir - 12} y={top + 70} width="24" height="8" />
      <circle className="cd-sky__beacon" cx={tip} cy={top - 2} r="2.5" />
    </g>
  );
}

export function Skyline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, 600);
      el.style.setProperty('--sy', String(y));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div ref={ref} className="cd-sky" aria-hidden="true">
      <div className="cd-sky__layer cd-sky__layer--stars">
        <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
          {Array.from({ length: 60 }, (_, i) => {
            const r = rand(i + 99);
            return <circle key={i} cx={r() * 1600} cy={r() * 140} r={r() * 1.1 + 0.3} />;
          })}
        </svg>
      </div>
      <div className="cd-sky__layer cd-sky__layer--far">
        <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
          {FAR.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />)}
        </svg>
      </div>
      <div className="cd-sky__layer cd-sky__layer--mid">
        <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
          {MID.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} />
              {b.lights.map(([lx, ly], j) => <rect key={j} className="cd-sky__light" x={lx} y={ly} width="5" height="6" />)}
            </g>
          ))}
        </svg>
      </div>
      <div className="cd-sky__layer cd-sky__layer--near">
        <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
          <Crane x={1080} mast={200} jib={300} flip />
          <Crane x={1380} mast={150} jib={190} />
          <Crane x={520} mast={170} jib={230} />
          {/* Steel frame going up */}
          <g className="cd-sky__frame">
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${1180 + i * 34},220 V120`} />)}
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M1180,${220 - i * 25} H1316`} />)}
          </g>
        </svg>
      </div>
      <div className="cd-sky__fade" />
    </div>
  );
}
