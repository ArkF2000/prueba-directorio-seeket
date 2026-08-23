'use client';

import { useEffect, useRef } from 'react';

interface Glow {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
}

/**
 * Fondo ambiental — v2.
 *
 * Antes: burbujas de color difuminadas flotando (estética genérica de landing
 * generada por IA). Ahora: grid técnico fino (vía CSS, capa aparte) + un par de
 * glows de marca MUY sutiles y lentos en canvas, que dan profundidad sin competir
 * con el contenido. La sensación buscada es "panel de producto/dev-tool", no
 * "hero de marketing".
 */
export default function AnimatedBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Solo 3 glows, grandes y muy tenues: profundidad, no ruido visual.
    const colors = ['#fa3934', '#ffac31', '#9a2e2e'];
    const glows: Glow[] = Array.from({ length: 3 }).map((_, i) => ({
      x: (window.innerWidth / 3) * (i + 0.5) + (Math.random() - 0.5) * 200,
      y: window.innerHeight * (0.25 + Math.random() * 0.5),
      size: 420 + Math.random() * 180,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      opacity: 0.05 + Math.random() * 0.04,
      color: colors[i % colors.length],
    }));

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const g of glows) {
        g.x += g.vx;
        g.y += g.vy;
        if (g.x < -g.size) g.x = window.innerWidth + g.size;
        if (g.x > window.innerWidth + g.size) g.x = -g.size;
        if (g.y < -g.size) g.y = window.innerHeight + g.size;
        if (g.y > window.innerHeight + g.size) g.y = -g.size;

        const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.size);
        gradient.addColorStop(0, `${g.color}${Math.round(g.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${g.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* Capa 1: grid técnico fino, se desvanece hacia los bordes */}
      <div
        className="bg-grid-lines absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 85%)',
        }}
      />
      {/* Capa 2: glows de marca, muy tenues, movimiento casi imperceptible */}
      <canvas ref={canvasRef} style={{ opacity: 0.9 }} />
      {/* Capa 3: grano sutil para romper el flat de los degradados oscuros */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.025]" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}