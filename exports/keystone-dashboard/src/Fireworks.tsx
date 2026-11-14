import { useEffect, useRef } from 'react';

// Every button click launches a small firework from the button: a burst of
// sparks in the dashboard's accent, safety and status colors that arc out
// under gravity, twinkle and fade. Drawn on one overlay canvas above the page.
const COLORS = ['#60a5fa', '#93c5fd', '#fbbf24', '#fcd34d', '#4ade80', '#f87171', '#ffffff'];
const SELECTOR = 'button, [role="tab"], a.cd-nav__item';

interface Spark {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; color: string; size: number; trail: [number, number][];
}

export function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let sparks: Spark[] = [];
    let raf = 0;
    let w = 0, h = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      sparks = sparks.filter((s) => s.life < s.max);
      for (const s of sparks) {
        s.life++;
        s.vx *= 0.965; s.vy = s.vy * 0.965 + 0.09;
        s.x += s.vx; s.y += s.vy;
        s.trail.push([s.x, s.y]);
        if (s.trail.length > 6) s.trail.shift();
        const fade = 1 - s.life / s.max;
        const twinkle = s.life > s.max * 0.55 ? (Math.random() > 0.35 ? 1 : 0.2) : 1;
        ctx.globalAlpha = fade * twinkle;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        s.trail.forEach(([tx, ty], i) => (i ? ctx.lineTo(tx, ty) : ctx.moveTo(tx, ty)));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (sparks.length) raf = requestAnimationFrame(frame);
    };

    const burst = (x: number, y: number, rect: DOMRect) => {
      const count = reduced ? 14 : 46;
      const base = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const speed = (reduced ? 1.5 : 2.5) + Math.random() * (reduced ? 1.5 : 4.5);
        const sx = x + Math.cos(angle) * Math.min(rect.width / 2, 24) * Math.random();
        const sy = y + Math.sin(angle) * Math.min(rect.height / 2, 12) * Math.random();
        sparks.push({
          x: sx, y: sy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.5,
          life: 0, max: (reduced ? 22 : 45) + Math.random() * 30,
          color: Math.random() < 0.6 ? base : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.2 + Math.random() * 1.6,
          trail: [[sx, sy]],
        });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(SELECTOR);
      if (!el || (el as HTMLButtonElement).disabled) return;
      const rect = el.getBoundingClientRect();
      // Keyboard clicks have no pointer position: burst from the button's center.
      const fromPointer = e.detail > 0 && (e.clientX || e.clientY);
      burst(fromPointer ? e.clientX : rect.left + rect.width / 2, fromPointer ? e.clientY : rect.top + rect.height / 2, rect);
    };

    size();
    window.addEventListener('resize', size);
    document.addEventListener('click', onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  return <canvas ref={ref} className="cd-fireworks" aria-hidden="true" />;
}
