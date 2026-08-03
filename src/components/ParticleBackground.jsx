import React, { useEffect, useRef } from 'react';

export default function ParticleBackground({ timeOfDay = 'noon' }) {
  const canvasRef = useRef(null);
  const timeOfDayRef = useRef(timeOfDay);

  useEffect(() => {
    timeOfDayRef.current = timeOfDay;
  }, [timeOfDay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    let animationFrameId;
    let resizeFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        initParticles();
      });
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2.0 + 0.8;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.04 + 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw(ctx) {
        ctx.beginPath();
        const currentRadius = this.radius * (0.8 + Math.sin(this.pulse) * 0.3);
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        
        const stage = timeOfDayRef.current;
        const alpha = 0.35 + Math.sin(this.pulse) * 0.3;

        if (stage === 'night' || stage === 'evening') {
          // Glowing Fireflies halo
          ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(254, 240, 138, 0.9)';
        } else if (stage === 'morning') {
          ctx.fillStyle = `rgba(254, 215, 170, ${alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(251, 146, 60, 0.6)';
        } else {
          ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.8})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(110, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };
    
    initParticles();

    const drawLines = () => {
      const stage = timeOfDayRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            if (stage === 'night') {
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance / 800})`;
            } else if (stage === 'evening') {
              ctx.strokeStyle = `rgba(251, 146, 60, ${0.12 - distance / 900})`;
            } else if (stage === 'morning') {
              ctx.strokeStyle = `rgba(251, 146, 60, ${0.12 - distance / 900})`;
            } else {
              ctx.strokeStyle = `rgba(53, 118, 193, ${0.12 - distance / 1000})`;
            }
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      
      drawLines();
      
      if (!reducedMotion.matches && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleVisibility = () => {
      cancelAnimationFrame(animationFrameId);
      if (!document.hidden) render();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Don't block clicks
        zIndex: -1, // Just above the gradient background, but behind everything else
      }}
    />
  );
}
