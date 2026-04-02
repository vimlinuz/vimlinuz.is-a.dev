"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  phase: number;
  phaseSpeed: number;
  baseAlpha: number;
  alphaAmplitude: number;
}

const DOT_COUNT = 115;
const AVOID_RADIUS = 72;
const AVOID_FORCE = 0.28;

function createDot(width: number, height: number): Dot {
  const baseVx = (Math.random() - 0.5) * 0.18;
  const baseVy = (Math.random() - 0.5) * 0.18;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: baseVx,
    vy: baseVy,
    baseVx,
    baseVy,
    radius: 0.9 + Math.random() * 1.9,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: 0.004 + Math.random() * 0.01,
    baseAlpha: 0.06 + Math.random() * 0.1,
    alphaAmplitude: 0.04 + Math.random() * 0.08,
  };
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const disableAnimation = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 768px), (hover: none), (pointer: coarse)",
    ).matches;

    if (disableAnimation) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let dots: Dot[] = [];

    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = Array.from({ length: DOT_COUNT }, () => createDot(width, height));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0.001 && distance < AVOID_RADIUS) {
          const force = ((AVOID_RADIUS - distance) / AVOID_RADIUS) * AVOID_FORCE;
          dot.vx += (dx / distance) * force;
          dot.vy += (dy / distance) * force;
        }

        dot.vx += (dot.baseVx - dot.vx) * 0.05;
        dot.vy += (dot.baseVy - dot.vy) * 0.05;

        dot.phase += dot.phaseSpeed;
        const alpha = Math.max(0, dot.baseAlpha + dot.alphaAmplitude * Math.sin(dot.phase));

        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < -4) dot.x = width + 4;
        if (dot.x > width + 4) dot.x = -4;
        if (dot.y < -4) dot.y = height + 4;
        if (dot.y > height + 4) dot.y = -4;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 239, 250, ${alpha})`;
        ctx.fill();
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    step();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
