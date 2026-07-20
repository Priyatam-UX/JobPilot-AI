import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseRepelRadius?: number;
  opacity?: number;
  speed?: number;
}

export function ParticleBackground({
  particleCount = 70,
  connectionDistance = 120,
  mouseRepelRadius = 150,
  opacity = 1,
  speed = 0.5,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Handle Resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // Handle Mouse
    const handleMouseMove = (e: MouseEvent) => {
      // Get bounding client rect to account for potential scrolling or positioning
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Setup Canvas
    canvas.width = width;
    canvas.height = height;

    const colors = ['#6366f1', '#8b5cf6', '#3b82f6']; // Indigo, Violet, Blue

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 15000) * (particleCount / 50); // Scale by screen size
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & Draw
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mouse Repulsion
        const dxMouse = p.x - mouseX;
        const dyMouse = p.y - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseRepelRadius) {
          const forceDirectionX = dxMouse / distMouse;
          const forceDirectionY = dyMouse / distMouse;
          const force = (mouseRepelRadius - distMouse) / mouseRepelRadius;
          
          p.x += forceDirectionX * force * 5;
          p.y += forceDirectionY * force * 5;
        } else {
          // Normal movement
          p.x += p.vx;
          p.y += p.vy;
        }

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Keep in bounds just in case repulsion pushed them out
        if (p.x < 0) p.x = 0;
        if (p.x > width) p.x = width;
        if (p.y < 0) p.y = 0;
        if (p.y > height) p.y = height;

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Draw Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Opacity scales with distance
            const lineOpacity = (1 - dist / connectionDistance) * 0.2 * opacity;
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineOpacity})`; // Indigo tint
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      drawParticles();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particleCount, connectionDistance, mouseRepelRadius, opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ 
        width: '100%', 
        height: '100%', 
        background: 'transparent',
        zIndex: 0 
      }}
    />
  );
}
