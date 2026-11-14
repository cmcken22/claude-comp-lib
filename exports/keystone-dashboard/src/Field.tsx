import { useEffect, useRef } from 'react';

// Page background: a grid of short survey-style ticks. Near the pointer they
// turn to face it, swell, are pushed outward and glow in the accent and
// safety colors; away from it they settle back into a calm grid. Clicking
// sends a ripple through the field.
export function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const GAP = 30;
    const RADIUS = 220;
    type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; a: number; seed: number };
    let pts: P[] = [];
    let w = 0, h = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const ripples: { x: number; y: number; t: number }[] = [];
    let raf = 0, lastMove = 0, t0 = performance.now();

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP / 2; y < h + GAP; y += GAP)
        for (let x = GAP / 2; x < w + GAP; x += GAP) {
          const jx = x + (Math.random() - 0.5) * 8, jy = y + (Math.random() - 0.5) * 8;
          pts.push({ hx: jx, hy: jy, x: jx, y: jy, vx: 0, vy: 0, a: -Math.PI / 4, seed: Math.random() * Math.PI * 2 });
        }
    };

    const draw = (now: number) => {
      raf = 0;
      const t = (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      ctx.clearRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t > 1.6) ripples.splice(i, 1);

      let moving = false;
      for (const p of pts) {
        // Idle drift so the field breathes even when the pointer is still.
        const driftX = reduced ? 0 : Math.sin(t * 0.6 + p.seed) * 1.2;
        const driftY = reduced ? 0 : Math.cos(t * 0.5 + p.seed * 1.3) * 1.2;
        let fx = (p.hx + driftX - p.x) * 0.06;
        let fy = (p.hy + driftY - p.y) * 0.06;

        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        let k = mouse.active ? Math.max(0, 1 - d / RADIUS) : 0;
        if (k > 0) { const push = k * k * 3.2; fx += (dx / d) * push; fy += (dy / d) * push; }

        for (const r of ripples) {
          const age = t - r.t, front = age * 520;
          const rd = Math.hypot(p.hx - r.x, p.hy - r.y);
          const band = Math.max(0, 1 - Math.abs(rd - front) / 60) * (1 - age / 1.6);
          if (band > 0) { fx += ((p.hx - r.x) / (rd || 1)) * band * 4; fy += ((p.hy - r.y) / (rd || 1)) * band * 4; k = Math.max(k, band * 0.8); }
        }

        p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82;
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02) moving = true;

        const target = k > 0.02 ? Math.atan2(mouse.y - p.y, mouse.x - p.x) : -Math.PI / 4;
        let da = target - p.a;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        p.a += da * (0.08 + k * 0.2);

        const len = 3 + k * 9;
        const cx = Math.cos(p.a) * len / 2, cy = Math.sin(p.a) * len / 2;
        // Accent blue in the core, safety amber at the rim.
        const hue = 215 - (1 - k) * k * 4 * 175;
        const alpha = 0.13 + k * 0.75;
        ctx.strokeStyle = k > 0.02 ? `hsla(${hue}, 90%, ${62 + k * 8}%, ${alpha})` : 'rgba(148, 163, 184, 0.14)';
        ctx.lineWidth = 1.2 + k * 1.3;
        ctx.beginPath();
        ctx.moveTo(p.x - cx, p.y - cy);
        ctx.lineTo(p.x + cx, p.y + cy);
        ctx.stroke();
      }

      const keepGoing = !reduced || moving || now - lastMove < 1200 || ripples.length > 0;
      if (keepGoing && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => {
      if (mouse.tx < -9000) { mouse.x = e.clientX; mouse.y = e.clientY; }
      mouse.tx = e.clientX; mouse.ty = e.clientY; mouse.active = true; lastMove = performance.now(); kick();
    };
    const onLeave = () => { mouse.active = false; kick(); };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: (performance.now() - t0) / 1000 }); kick();
    };
    const onResize = () => { build(); kick(); };

    build(); kick();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', kick);
    };
  }, []);

  return <canvas ref={ref} className="cd-field" aria-hidden="true" />;
}
