import { useEffect, useRef } from 'react';

interface Particle {
  hx: number; // resting position in the field
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number; // angle of the dash
  hue: number; // picks between the two accent colours
  glow: number; // brightness left by a shockwave
}

const GAP = 26; // spacing between dashes
const RADIUS = 180; // how far the cursor's influence reaches
const PARALLAX = 0.35; // field scroll speed relative to the page
const IGNORE_CLICKS = 'button, a, input, select, textarea, label, .ds-card, .ds-stat-card, .cd-rail, .ds-app-shell__sidebar, .ds-app-shell__navbar, .cd-cpanel';

const rnd = (n: number) => {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * Interactive background: a field of short dashes that drifts in a slow flow,
 * turns toward the cursor and swirls out of its way. Clicking empty background
 * sends a shockwave. Layers behind it scroll at different speeds (parallax).
 * It draws on a canvas outside React state, so the page never re-renders.
 */
export function ParticleField({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!enabled || !root || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let fieldH = 0;
    let dpr = 1;
    let pts: Particle[] = [];
    let mouse: { x: number; y: number } | null = null;
    let shocks: Array<{ x: number; y: number; r: number }> = [];
    let t = 0;
    let frame = 0;
    let colors = ['#2563eb', '#f59e0b', '#64748b'];
    let raf = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      fieldH = h + GAP * 4;
      pts = [];
      let i = 1;
      for (let y = 0; y < fieldH; y += GAP) {
        for (let x = -GAP; x < w + GAP; x += GAP) {
          const hx = x + (rnd(i) - 0.5) * GAP * 0.8;
          const hy = y + (rnd(i + 0.37) - 0.5) * GAP * 0.8;
          pts.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, a: rnd(i + 0.71) * Math.PI, hue: rnd(i + 0.13), glow: 0 });
          i++;
        }
      }
    };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = [
        cs.getPropertyValue('--ds-color-accent').trim() || colors[0],
        cs.getPropertyValue('--ds-color-warning').trim() || colors[1],
        cs.getPropertyValue('--ds-color-text-tertiary').trim() || colors[2],
      ];
    };

    const step = () => {
      if (!w || document.hidden) return;
      if (frame++ % 60 === 0) readColors();
      t += 1;
      const scroll = window.scrollY * PARALLAX;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      shocks = shocks.filter((s) => s.r < 460);
      shocks.forEach((s) => (s.r += 10));

      for (const p of pts) {
        // Resting position scrolls slower than the page and wraps around.
        const hy = (((p.hy - scroll) % fieldH) + fieldH) % fieldH - GAP * 2;
        const flow = Math.sin(p.hx * 0.006 + t * 0.004) * 1.3 + Math.cos(hy * 0.006 - t * 0.003);
        const tx = p.hx + Math.cos(flow) * 4;
        const ty = hy + Math.sin(flow) * 4;
        if (Math.abs(ty - p.y) > fieldH / 2) {
          p.y = ty;
          p.vy = 0;
        }
        let fx = (tx - p.x) * 0.035;
        let fy = (ty - p.y) * 0.035;
        let near = 0;
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < RADIUS) {
            near = 1 - d / RADIUS;
            const push = near * near * 2.6;
            fx += (dx / d) * push - (dy / d) * push * 0.7; // push out and swirl
            fy += (dy / d) * push + (dx / d) * push * 0.7;
          }
        }
        for (const s of shocks) {
          const dx = p.x - s.x;
          const dy = p.y - s.y;
          const d = Math.hypot(dx, dy) || 1;
          const band = 1 - Math.abs(d - s.r) / 36;
          if (band > 0) {
            const fade = 1 - s.r / 460;
            fx += (dx / d) * band * fade * 4;
            fy += (dy / d) * band * fade * 4;
            p.glow = Math.max(p.glow, band * fade);
          }
        }
        p.vx = (p.vx + fx) * 0.86;
        p.vy = (p.vy + fy) * 0.86;
        p.x += p.vx;
        p.y += p.vy;
        p.glow *= 0.93;
        if (p.y < -12 || p.y > h + 12) continue;

        const speed = Math.hypot(p.vx, p.vy);
        const target = near > 0.02 && mouse ? Math.atan2(mouse.y - p.y, mouse.x - p.x) : speed > 0.35 ? Math.atan2(p.vy, p.vx) : flow;
        const da = Math.atan2(Math.sin(target - p.a), Math.cos(target - p.a));
        p.a += da * 0.14;

        const energy = Math.min(1, near * 1.25 + p.glow + speed * 0.07);
        const len = 2.5 + energy * 8;
        const ox = Math.cos(p.a) * len * 0.5;
        const oy = Math.sin(p.a) * len * 0.5;
        ctx.globalAlpha = 0.16 + energy * 0.78;
        ctx.strokeStyle = energy > 0.12 ? (p.hue < 0.68 ? colors[0] : colors[1]) : colors[2];
        ctx.lineWidth = 1.3 + energy * 0.9;
        ctx.beginPath();
        ctx.moveTo(p.x - ox, p.y - oy);
        ctx.lineTo(p.x + ox, p.y + oy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      step();
    };

    const onScroll = () => root.style.setProperty('--sy', `${Math.round(window.scrollY)}px`);
    const onMove = (e: MouseEvent) => (mouse = { x: e.clientX, y: e.clientY });
    const onLeave = () => (mouse = null);
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(IGNORE_CLICKS)) return;
      shocks.push({ x: e.clientX, y: e.clientY, r: 0 });
    };

    const resize = new ResizeObserver(() => {
      layout();
      if (reduceMotion) step();
    });
    resize.observe(canvas);
    readColors();
    layout();

    if (reduceMotion) {
      step();
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('mousemove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
      window.addEventListener('click', onClick);
      onScroll();
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cd-fx" aria-hidden="true">
      <div className="cd-fx__far" />
      <div className="cd-fx__beam cd-fx__beam--a" />
      <div className="cd-fx__beam cd-fx__beam--b" />
      <canvas ref={canvasRef} className="cd-fx__canvas" />
    </div>
  );
}
