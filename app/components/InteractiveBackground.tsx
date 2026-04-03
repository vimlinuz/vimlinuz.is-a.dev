"use client";

import { useEffect, useRef } from "react";

type StarType = "faint" | "normal" | "hero";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  starType: StarType;
  radius: number;
  phase: number;
  phaseSpeed: number;
  baseAlpha: number;
  ambientAmplitude: number;
  baseTwinkle: number;
  twinkleIntensity: number;
  pulse: number;
  pulseChance: number;
  pulseDecay: number;
  sparkleAngle: number;
  sparkleRotationBase: number;
  sparkleRotationBoost: number;
  sparkleThreshold: number;
  sparkleStretch: number;
  atmospherePhase: number;
  atmosphereSpeed: number;
  atmosphereAmount: number;
  coreColor: [number, number, number];
  sparkleColor: [number, number, number];
}

const DOT_COUNT = 115;
const AVOID_RADIUS = 72;
const AVOID_FORCE = 0.28;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createDot(width: number, height: number): Dot {
  const baseVx = (Math.random() - 0.5) * 0.18;
  const baseVy = (Math.random() - 0.5) * 0.18;
  const starRoll = Math.random();

  let starType: StarType = "faint";
  if (starRoll > 0.95) {
    starType = "hero";
  } else if (starRoll > 0.7) {
    starType = "normal";
  }

  const settings =
    starType === "hero"
      ? {
          radius: [1.3, 2.4],
          baseAlpha: [0.1, 0.18],
          ambientAmplitude: [0.07, 0.13],
          baseTwinkle: [0.42, 0.58],
          twinkleIntensity: [0.35, 0.55],
          pulseChance: [0.005, 0.008],
          pulseDecay: [0.965, 0.978],
          sparkleThreshold: [0.2, 0.32],
          sparkleStretch: [1.55, 2],
          sparkleRotationBase: [0.03, 0.06],
          sparkleRotationBoost: [0.13, 0.2],
          atmosphereSpeed: [0.0005, 0.0011],
          atmosphereAmount: [0.02, 0.045],
        }
      : starType === "normal"
        ? {
            radius: [1, 2],
            baseAlpha: [0.08, 0.14],
            ambientAmplitude: [0.06, 0.11],
            baseTwinkle: [0.4, 0.56],
            twinkleIntensity: [0.28, 0.44],
            pulseChance: [0.003, 0.0055],
            pulseDecay: [0.96, 0.974],
            sparkleThreshold: [0.24, 0.38],
            sparkleStretch: [1.35, 1.8],
            sparkleRotationBase: [0.025, 0.05],
            sparkleRotationBoost: [0.1, 0.16],
            atmosphereSpeed: [0.00045, 0.001],
            atmosphereAmount: [0.022, 0.05],
          }
        : {
            radius: [0.7, 1.45],
            baseAlpha: [0.05, 0.11],
            ambientAmplitude: [0.05, 0.09],
            baseTwinkle: [0.34, 0.5],
            twinkleIntensity: [0.2, 0.33],
            pulseChance: [0.0015, 0.003],
            pulseDecay: [0.955, 0.968],
            sparkleThreshold: [0.55, 0.7],
            sparkleStretch: [1.2, 1.55],
            sparkleRotationBase: [0.02, 0.04],
            sparkleRotationBoost: [0.07, 0.12],
            atmosphereSpeed: [0.00035, 0.0009],
            atmosphereAmount: [0.018, 0.042],
          };

  const temperatureRoll = Math.random();
  const temperatureBias = starType === "hero" ? 0.52 : starType === "normal" ? 0.38 : 0.26;
  const warmCutoff = temperatureBias * 0.5;
  const coolCutoff = 1 - temperatureBias * 0.5;
  const isWarm = temperatureRoll < warmCutoff;
  const isCool = temperatureRoll > coolCutoff;
  const coreColor: [number, number, number] = isWarm
    ? [247, 234, 212]
    : isCool
      ? [217, 233, 252]
      : [226, 239, 250];
  const sparkleColor: [number, number, number] = isWarm
    ? [255, 244, 225]
    : isCool
      ? [228, 245, 255]
      : [235, 248, 255];

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: baseVx,
    vy: baseVy,
    baseVx,
    baseVy,
    starType,
    radius: randomBetween(settings.radius[0], settings.radius[1]),
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: randomBetween(0.0025, 0.0065),
    baseAlpha: randomBetween(settings.baseAlpha[0], settings.baseAlpha[1]),
    ambientAmplitude: randomBetween(settings.ambientAmplitude[0], settings.ambientAmplitude[1]),
    baseTwinkle: randomBetween(settings.baseTwinkle[0], settings.baseTwinkle[1]),
    twinkleIntensity: randomBetween(settings.twinkleIntensity[0], settings.twinkleIntensity[1]),
    pulse: 0,
    pulseChance: randomBetween(settings.pulseChance[0], settings.pulseChance[1]),
    pulseDecay: randomBetween(settings.pulseDecay[0], settings.pulseDecay[1]),
    sparkleAngle: Math.random() * Math.PI,
    sparkleRotationBase: randomBetween(
      settings.sparkleRotationBase[0],
      settings.sparkleRotationBase[1],
    ),
    sparkleRotationBoost: randomBetween(
      settings.sparkleRotationBoost[0],
      settings.sparkleRotationBoost[1],
    ),
    sparkleThreshold: randomBetween(settings.sparkleThreshold[0], settings.sparkleThreshold[1]),
    sparkleStretch: randomBetween(settings.sparkleStretch[0], settings.sparkleStretch[1]),
    atmospherePhase: Math.random() * Math.PI * 2,
    atmosphereSpeed: randomBetween(settings.atmosphereSpeed[0], settings.atmosphereSpeed[1]),
    atmosphereAmount: randomBetween(settings.atmosphereAmount[0], settings.atmosphereAmount[1]),
    coreColor,
    sparkleColor,
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

    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      alpha: number,
      angle: number,
      stretch: number,
      strength: number,
      sparkleColor: [number, number, number],
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      const longRay = size * stretch;
      const midRay = longRay * 0.52;
      const [sr, sg, sb] = sparkleColor;

      ctx.strokeStyle = `rgba(${sr - 12}, ${sg - 8}, ${sb - 6}, ${alpha * 0.32})`;
      ctx.lineWidth = 1 + strength * 0.85;
      ctx.beginPath();
      ctx.moveTo(-longRay, 0);
      ctx.lineTo(longRay, 0);
      ctx.moveTo(0, -longRay);
      ctx.lineTo(0, longRay);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha})`;
      ctx.lineWidth = 0.55 + strength * 0.4;

      ctx.beginPath();
      ctx.moveTo(-longRay, 0);
      ctx.lineTo(longRay, 0);
      ctx.moveTo(0, -longRay);
      ctx.lineTo(0, longRay);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${sr - 22}, ${sg - 20}, ${sb - 18}, ${alpha * 0.5})`;
      ctx.lineWidth = 0.35 + strength * 0.28;
      ctx.beginPath();
      ctx.moveTo(-midRay, -midRay);
      ctx.lineTo(midRay, midRay);
      ctx.moveTo(midRay, -midRay);
      ctx.lineTo(-midRay, midRay);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${Math.min(1, alpha * 1.12)})`;
      ctx.arc(0, 0, 0.55 + strength * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
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
        dot.atmospherePhase += dot.atmosphereSpeed;
        const ambientWave = 0.5 + 0.5 * Math.sin(dot.phase);
        const atmosphericWave =
          Math.sin(dot.atmospherePhase) * 0.65 + Math.sin(dot.atmospherePhase * 0.57 + 1.7) * 0.35;
        const atmosphericFactor = 1 + atmosphericWave * dot.atmosphereAmount;

        if (dot.pulse < 0.01 && Math.random() < dot.pulseChance) {
          dot.pulse = 0.55 + Math.random() * 0.45;
        }

        dot.pulse *= dot.pulseDecay;
        if (dot.pulse < 0.001) {
          dot.pulse = 0;
        }

        const burstTwinkle = dot.pulse * dot.twinkleIntensity;
        dot.sparkleAngle += dot.sparkleRotationBase + burstTwinkle * dot.sparkleRotationBoost;

        const baseAlpha = Math.max(
          0,
          dot.baseAlpha + (ambientWave - 0.5) * 2 * dot.ambientAmplitude * 0.65,
        );
        const midTwinkle = dot.baseTwinkle + (ambientWave - 0.5) * 2 * dot.ambientAmplitude;
        const twinkle = Math.min(0.86, Math.max(0, midTwinkle + burstTwinkle));
        const alpha = Math.min(1, Math.max(0, (baseAlpha + twinkle * 0.28) * atmosphericFactor));
        const coreRadius = dot.radius * (1 + twinkle * 0.15 + burstTwinkle * 0.16 + (atmosphericFactor - 1) * 0.08);

        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < -4) dot.x = width + 4;
        if (dot.x > width + 4) dot.x = -4;
        if (dot.y < -4) dot.y = height + 4;
        if (dot.y > height + 4) dot.y = -4;

        if (dot.starType !== "faint" && burstTwinkle > dot.sparkleThreshold) {
          const sparkleStrength = (burstTwinkle - dot.sparkleThreshold) / (1 - dot.sparkleThreshold);
          const baseSize = dot.starType === "hero" ? 2.4 : 1.9;
          const maxAlpha = dot.starType === "hero" ? 0.92 : 0.78;
          const sparkleSize = dot.radius * (baseSize + sparkleStrength * 1.9);
          const sparkleAlpha = Math.min(maxAlpha, 0.38 + sparkleStrength * 0.62);
          drawSparkle(
            dot.x,
            dot.y,
            sparkleSize,
            sparkleAlpha,
            dot.sparkleAngle,
            dot.sparkleStretch,
            sparkleStrength,
            dot.sparkleColor,
          );
        }

        const [cr, cg, cb] = dot.coreColor;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
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
