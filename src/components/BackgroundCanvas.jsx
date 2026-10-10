import { useEffect, useRef } from 'react';

const BackgroundCanvas = ({ theme, isPlaying }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize mouse in center
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    // Animation Variables
    let time = 0;
    let glitchTimer = 0;
    let glitches = [];

    // M0rf: ice ground, a faint data grid, a stepped ultraviolet signal that
    // leans toward the pointer, and now and then a fractured slice of screen.
    let grid = null;
    const buildGrid = () => {
      grid = document.createElement('canvas');
      grid.width = width;
      grid.height = height;
      const g = grid.getContext('2d');
      g.fillStyle = 'rgba(11, 12, 20, 0.12)';
      for (let y = 28; y < height; y += 28) {
        for (let x = 28; x < width; x += 28) g.fillRect(x, y, 1.2, 1.2);
      }
      g.fillStyle = 'rgba(68, 34, 255, 0.22)';
      for (let y = 112; y < height; y += 112) {
        for (let x = 112; x < width; x += 112) { g.fillRect(x - 4, y, 9, 1); g.fillRect(x, y - 4, 1, 9); }
      }
    };
    let slices = [];
    let sliceTimer = 0;

    const signal = (t, phase, color, lift) => {
      const m = mouseRef.current;
      const base = height * 0.64 + lift;
      const amp = isPlaying ? 70 : 40;
      const speed = isPlaying ? 0.035 : 0.016;
      ctx.beginPath();
      let prev = null;
      for (let x = 0; x <= width + 16; x += 16) {
        const near = Math.max(0, 1 - Math.abs(x - m.x) / 380);
        const raw = Math.sin(x * 0.006 + t * speed + phase) * amp
          + Math.sin(x * 0.021 - t * speed * 1.8) * amp * 0.4
          + (m.y - base) * 0.3 * near;
        const y = base + Math.round(raw / 10) * 10; // sample-and-hold steps, not a smooth curve
        if (prev === null) ctx.moveTo(x, y);
        else { ctx.lineTo(x, prev); ctx.lineTo(x, y); }
        prev = y;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const drawM0rf = (t) => {
      ctx.fillStyle = '#eceff4';
      ctx.fillRect(0, 0, width, height);
      if (!grid || grid.width !== width || grid.height !== height) buildGrid();
      ctx.drawImage(grid, 0, 0);

      signal(t, 1.4, 'rgba(183, 164, 255, 0.7)', 7);
      signal(t, 0, 'rgba(68, 34, 255, 0.55)', 0);

      ctx.fillStyle = 'rgba(11, 12, 20, 0.38)';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText(`SIG/M0RF  CH-02  ${isPlaying ? 'LIVE' : 'IDLE'}`, 40, 90);
      ctx.fillText('FOOTWORK 160 // IDM // BASS PRESSURE', 40, 106);
      ctx.fillText(`T+${String(t).padStart(7, '0')}`, width - 120, height - 40);

      // Fractures: copy a band of the frame sideways for a few frames.
      sliceTimer += isPlaying ? 2 : 1;
      if (sliceTimer > 110) {
        sliceTimer = 0;
        if (Math.random() < 0.55) {
          slices = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => ({
            y: Math.random() * height,
            h: 6 + Math.random() * 60,
            dx: (Math.random() - 0.5) * 70,
            life: 4 + Math.floor(Math.random() * 5),
          }));
        }
      }
      slices = slices.filter((s) => s.life-- > 0);
      slices.forEach((s) => {
        ctx.drawImage(canvas, 0, s.y, width, s.h, s.dx, s.y, width, s.h);
        ctx.fillStyle = 'rgba(68, 34, 255, 0.06)';
        ctx.fillRect(0, s.y, width, s.h);
        ctx.fillStyle = 'rgba(68, 34, 255, 0.5)';
        ctx.fillRect(0, s.y, width, 1);
      });
    };

    const drawGarageSale = (t) => {
      // Industrial rave background
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, width, height);

      const speedMultiplier = isPlaying ? 2.0 : 1.0;

      // Draw mechanical Grid
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Parallax center crosshair details (mechanical feel)
      const centerX = width / 2;
      const centerY = height / 2;
      const mxOffsetX = (mouseRef.current.x - centerX) * 0.03;
      const myOffsetY = (mouseRef.current.y - centerY) * 0.03;

      ctx.strokeStyle = 'rgba(255, 85, 0, 0.2)';
      ctx.beginPath();
      // Center ticks
      ctx.moveTo(centerX + mxOffsetX - 20, centerY + myOffsetY);
      ctx.lineTo(centerX + mxOffsetX + 20, centerY + myOffsetY);
      ctx.moveTo(centerX + mxOffsetX, centerY + myOffsetY - 20);
      ctx.lineTo(centerX + mxOffsetX, centerY + myOffsetY + 20);
      ctx.stroke();

      // Draw camera viewport boundaries in corners
      const pad = 40;
      const size = 30;
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.25)';
      ctx.lineWidth = 2;

      // Top Left
      ctx.beginPath();
      ctx.moveTo(pad + size, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + size);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(width - pad - size, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + size);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(pad + size, height - pad); ctx.lineTo(pad, height - pad); ctx.lineTo(pad, height - pad + size);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(width - pad - size, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad + size);
      ctx.stroke();

      // Coordinates text
      ctx.fillStyle = 'rgba(255, 85, 0, 0.3)';
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.fillText(`REC [●] ${isPlaying ? 'LIVE' : 'STBY'}`, pad + 10, pad + 50);
      ctx.fillText(`LOC: DELHI NCR / 28.6139 N 77.2090 E`, pad + 10, pad + 70);
      ctx.fillText(`SYS: UKG_RAVE_ENGINE_V1.9`, width - pad - 180, pad + 50);
      ctx.fillText(`BPM_SYNC: ${isPlaying ? '138.4' : '000.0'}`, width - pad - 180, pad + 70);

      // Strobe glitches (random orange/black horizontal bars)
      glitchTimer += speedMultiplier;
      if (glitchTimer > 60) {
        glitchTimer = 0;
        if (Math.random() < 0.4) {
          glitches = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
            y: Math.random() * height,
            h: Math.random() * 80 + 10,
            opacity: Math.random() * 0.15,
            xOffset: (Math.random() - 0.5) * 40
          }));
        } else {
          glitches = [];
        }
      }

      glitches.forEach((glitch) => {
        ctx.fillStyle = `rgba(255, 85, 0, ${glitch.opacity})`;
        ctx.fillRect(0, glitch.y, width, glitch.h);
        
        ctx.strokeStyle = `rgba(255, 241, 0, ${glitch.opacity * 2})`;
        ctx.beginPath();
        ctx.moveTo(0, glitch.y);
        ctx.lineTo(width, glitch.y);
        ctx.stroke();
      });

      // Digital scanning line
      const scanY = (t * 0.15 * speedMultiplier) % height;
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
    };

    const loop = () => {
      time++;
      
      // Lerp mouse coordinates smoothly
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (theme === 'm0rf') {
        drawM0rf(time);
      } else {
        drawGarageSale(time);
      }

      if (!still) animationId = requestAnimationFrame(loop);
    };

    // Reduced motion: one frame, no loop.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundCanvas;
