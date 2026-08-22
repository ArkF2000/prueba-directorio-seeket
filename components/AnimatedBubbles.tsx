'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export default function AnimatedBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#fa3934', '#ffac31', '#9a2e2e'];
    const bubbles: Bubble[] = [];

    // Crear burbujas iniciales
    for (let i = 0; i < 15; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        size: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        // Mover burbuja hacia arriba
        bubble.y -= bubble.speed;

        // Si sale de la pantalla, reiniciar abajo
        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }

        // Dibujar burbuja con blur
        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        ctx.fillStyle = bubble.color;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();

        // Aplicar blur manualmente con gradiente
        const gradient = ctx.createRadialGradient(
          bubble.x,
          bubble.y,
          0,
          bubble.x,
          bubble.y,
          bubble.size
        );
        gradient.addColorStop(0, `${bubble.color}${Math.floor(bubble.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${bubble.color}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.4 }}
    />
  );
}
