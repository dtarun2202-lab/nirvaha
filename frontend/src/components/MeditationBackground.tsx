import { useEffect, useRef } from "react";

/**
 * MeditationBackground — full-viewport canvas.
 * Particles avoid each other (separation steering) and move independently.
 */
export function MeditationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Brand palette — NIRVAHA greens
    const colors: [number, number, number][] = [
      [11,  46,  36],
      [22,  101, 62],
      [52,  168, 100],
      [100, 190, 140],
    ];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    interface P {
      type: "om" | "lotus" | "mandala";
      x: number; y: number;
      vx: number; vy: number;
      size: number;           // visual radius (used for separation)
      alpha: number;
      alphaDir: number;
      rot: number;
      rotSpeed: number;
      rgb: [number, number, number];
      spokes: number;
    }

    // Minimum separation between particle centres — keep them far apart
    const MIN_DIST = 200;
    // Slow, calm speed
    const SPEED = () => rand(0.18, 0.32);

    const cols = 5, rows = 4;
    const particles: P[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const type = (["om", "lotus", "mandala"] as const)[idx % 3];
        const cellW = canvas.width  / cols;
        const cellH = canvas.height / rows;
        const pad   = 50;

        const angle = rand(0, Math.PI * 2);
        const spd   = SPEED();

        particles.push({
          type,
          x: col * cellW + rand(pad, cellW - pad),
          y: row * cellH + rand(pad, cellH - pad),
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: type === "mandala" ? rand(40, 70) : type === "om" ? rand(20, 36) : rand(14, 26),
          alpha: 0.5 + (idx % 7) * 0.06,
          alphaDir: idx % 2 === 0 ? 1 : -1,
          rot: (idx / 20) * Math.PI * 2,
          rotSpeed: rand(-0.006, 0.006),
          rgb: colors[idx % colors.length],
          spokes: idx % 2 === 0 ? 8 : 12,
        });
      }
    }

    // ── draw helpers ─────────────────────────────────────────

    function drawOm(p: P) {
      const [r, g, b] = p.rgb;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size * 1.8}px serif`;
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ॐ", p.x, p.y);
      ctx.restore();
    }

    function drawLotus(p: P) {
      const [r, g, b] = p.rgb;
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      for (let k = 0; k < 6; k++) {
        ctx.save();
        ctx.rotate((k / 6) * Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo( s * 0.4, -s * 0.6,  s * 0.8, -s * 1.2, 0, -s * 1.6);
        ctx.bezierCurveTo(-s * 0.8, -s * 1.2, -s * 0.4, -s * 0.6, 0, 0);
        ctx.fillStyle   = `rgba(${r},${g},${b},0.18)`;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
        ctx.lineWidth = 0.9;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.fill();
      ctx.restore();
    }

    function drawMandala(p: P) {
      const [r, g, b] = p.rgb;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(0, 0, p.size,        0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, p.size * 0.2,  0, Math.PI * 2); ctx.stroke();
      for (let k = 0; k < p.spokes; k++) {
        const a  = (k / p.spokes) * Math.PI * 2;
        const a2 = ((k + 0.5) / p.spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * p.size * 0.2, Math.sin(a) * p.size * 0.2);
        ctx.lineTo(Math.cos(a) * p.size,       Math.sin(a) * p.size);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(Math.cos(a2) * p.size * 0.77, Math.sin(a2) * p.size * 0.77, p.size * 0.16, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── tick ─────────────────────────────────────────────────
    function tick() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Separation steering — push particles apart
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let sx = 0, sy = 0;

        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < MIN_DIST) {
            // stronger repulsion so they stay far apart
            const force = (MIN_DIST - dist) / MIN_DIST * 0.12;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
          }
        }

        a.vx += sx;
        a.vy += sy;

        // Clamp speed so repulsion doesn't make them rocket
        const spd = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        const maxSpd = 0.38;
        if (spd > maxSpd) { a.vx = (a.vx / spd) * maxSpd; a.vy = (a.vy / spd) * maxSpd; }

        // Minimum speed so they never stop
        const minSpd = 0.15;
        if (spd < minSpd && spd > 0) { a.vx = (a.vx / spd) * minSpd; a.vy = (a.vy / spd) * minSpd; }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot   += p.rotSpeed;
        p.alpha += p.alphaDir * 0.003;
        if (p.alpha > 0.9) p.alphaDir = -1;
        if (p.alpha < 0.4) p.alphaDir =  1;

        // Bounce off edges instead of wrapping — keeps them spread
        const margin = p.size + 10;
        if (p.x < margin)     { p.x = margin;     p.vx = Math.abs(p.vx); }
        if (p.x > w - margin) { p.x = w - margin; p.vx = -Math.abs(p.vx); }
        if (p.y < margin)     { p.y = margin;      p.vy = Math.abs(p.vy); }
        if (p.y > h - margin) { p.y = h - margin;  p.vy = -Math.abs(p.vy); }

        if (p.type === "om")      drawOm(p);
        else if (p.type === "lotus")  drawLotus(p);
        else                          drawMandala(p);
      }

      animId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
