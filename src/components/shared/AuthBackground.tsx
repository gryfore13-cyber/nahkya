import { useEffect, useRef } from 'react';

export function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      // v10 soft beige base
      ctx.fillStyle = '#F8F1E8';
      ctx.fillRect(0, 0, w, h);

      const ribbons = [
        { y: h * 0.2, amp: 80, freq: 0.008, spd: 1.0, col: 'rgba(184,139,74,0.06)' },
        { y: h * 0.4, amp: 60, freq: 0.012, spd: 0.7, col: 'rgba(184,139,74,0.04)' },
        { y: h * 0.6, amp: 90, freq: 0.007, spd: 1.1, col: 'rgba(184,154,122,0.04)' },
      ];

      ribbons.forEach((r) => {
        ctx.beginPath();
        ctx.moveTo(0, r.y);
        for (let x = 0; x <= w; x += 3) {
          ctx.lineTo(x, r.y + Math.sin(x * r.freq + time * r.spd) * r.amp + Math.sin(x * r.freq * 0.5 + time * r.spd * 1.3) * r.amp * 0.5);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = r.col; ctx.fill();
      });

      // Gold dust particles
      for (let i = 0; i < 20; i++) {
        const px = (Math.sin(i * 137.5 + time * 0.2) * 0.5 + 0.5) * w;
        const py = (Math.cos(i * 73.3 + time * 0.15) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(px, py, Math.sin(i + time) * 1 + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,139,74,${0.08 + Math.sin(i + time * 2) * 0.04})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-behind" />;
}
