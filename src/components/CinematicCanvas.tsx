import React, { useEffect, useRef, useState, useCallback } from 'react';
import orbitImgUrl from '../assets/images/earth_orbit_sunrise_1790011975354.jpg';
import cloudsImgUrl from '../assets/images/clouds_atmospheric_dive_1790012015846.jpg';
import spireImgUrl from '../assets/images/skytower_city_spire_1790011990199.jpg';
import penthouseImgUrl from '../assets/images/luxury_penthouse_sky_1790012002191.jpg';

interface CinematicCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  onStageChange?: (stage: 'orbit' | 'spire' | 'penthouse') => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  type: 'star' | 'cloud-streak' | 'interior-dust';
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  scrollProgress,
  onStageChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{
    orbit: HTMLImageElement | null;
    clouds: HTMLImageElement | null;
    spire: HTMLImageElement | null;
    penthouse: HTMLImageElement | null;
  }>({
    orbit: null,
    clouds: null,
    spire: null,
    penthouse: null
  });

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const smoothedProgressRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const currentStageRef = useRef<'orbit' | 'spire' | 'penthouse'>('orbit');

  // Preload all 4 high-resolution cinematic key assets
  useEffect(() => {
    let loadedCount = 0;
    const total = 4;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= total) {
        setImagesLoaded(true);
      }
    };

    const orbit = new Image();
    orbit.src = orbitImgUrl;
    orbit.onload = checkAllLoaded;

    const clouds = new Image();
    clouds.src = cloudsImgUrl;
    clouds.onload = checkAllLoaded;

    const spire = new Image();
    spire.src = spireImgUrl;
    spire.onload = checkAllLoaded;

    const penthouse = new Image();
    penthouse.src = penthouseImgUrl;
    penthouse.onload = checkAllLoaded;

    imagesRef.current = { orbit, clouds, spire, penthouse };

    // Initialize ambient particles
    const particles: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() - 0.5) * 0.0003,
        speedX: (Math.random() - 0.5) * 0.0003,
        opacity: Math.random() * 0.8 + 0.2,
        type: i < 50 ? 'star' : i < 70 ? 'cloud-streak' : 'interior-dust'
      });
    }
    particlesRef.current = particles;

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Mouse move handler for silky subtle 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mousePosRef.current.targetX = nx;
      mousePosRef.current.targetY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Helper to draw an image centered and scaled like CSS cover
  const drawImageCover = useCallback((
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cw: number,
    ch: number,
    scale: number,
    panX: number,
    panY: number,
    alpha: number
  ) => {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let renderW = cw;
    let renderH = ch;

    if (canvasRatio > imgRatio) {
      renderW = cw;
      renderH = cw / imgRatio;
    } else {
      renderH = ch;
      renderW = ch * imgRatio;
    }

    renderW *= scale;
    renderH *= scale;

    const offsetX = (cw - renderW) / 2 + panX;
    const offsetY = (ch - renderH) / 2 + panY;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    ctx.restore();
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth progress interpolation for jank-free scrubbing
      smoothedProgressRef.current += (scrollProgress - smoothedProgressRef.current) * 0.12;
      const p = smoothedProgressRef.current;

      // Mouse lerp
      const mouse = mousePosRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Resize canvas if needed
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;

      if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep luxury charcoal background
      ctx.fillStyle = '#060709';
      ctx.fillRect(0, 0, cw, ch);

      // Determine current stage and inform parent if changed
      let currentStage: 'orbit' | 'spire' | 'penthouse' = 'orbit';
      if (p < 0.32) {
        currentStage = 'orbit';
      } else if (p < 0.70) {
        currentStage = 'spire';
      } else {
        currentStage = 'penthouse';
      }

      if (currentStage !== currentStageRef.current) {
        currentStageRef.current = currentStage;
        if (onStageChange) onStageChange(currentStage);
      }

      const { orbit, clouds, spire, penthouse } = imagesRef.current;

      // Micro parallax offset from mouse
      const mouseOffsetX = mouse.x * 24;
      const mouseOffsetY = mouse.y * 18;

      /* =========================================================================
         STAGE 1: Earth Orbit View (0.0 -> 0.32)
         Fading into sunrise clouds with headline "Beyond the horizon"
         ========================================================================= */
      if (orbit && orbit.complete) {
        // Orbit opacity: 1 at p=0, starts fading at 0.22, fully faded by 0.35
        let orbitAlpha = 1;
        if (p > 0.20) {
          orbitAlpha = 1 - (p - 0.20) / 0.15;
        }

        // Camera push-in towards the curved horizon
        const orbitScale = 1.02 + p * 0.45;
        // As you descend, the horizon rises upward in camera view
        const orbitPanY = mouseOffsetY * 0.5 - p * (ch * 0.4);
        const orbitPanX = mouseOffsetX * 0.5;

        drawImageCover(ctx, orbit, cw, ch, orbitScale, orbitPanX, orbitPanY, orbitAlpha);

        // Orbital sunrise atmospheric glow effect
        if (orbitAlpha > 0.05) {
          ctx.save();
          ctx.globalAlpha = orbitAlpha * 0.4;
          const sunGlow = ctx.createRadialGradient(
            cw * 0.55 + mouseOffsetX,
            ch * 0.48 + orbitPanY,
            10,
            cw * 0.55 + mouseOffsetX,
            ch * 0.48 + orbitPanY,
            cw * 0.65
          );
          sunGlow.addColorStop(0, 'rgba(255, 230, 180, 0.45)');
          sunGlow.addColorStop(0.25, 'rgba(224, 168, 60, 0.2)');
          sunGlow.addColorStop(0.6, 'rgba(212, 110, 30, 0.05)');
          sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sunGlow;
          ctx.fillRect(0, 0, cw, ch);
          ctx.restore();
        }
      }

      /* =========================================================================
         STAGE 2 TRANSITION: Rapid vertical drop through atmosphere (0.24 -> 0.58)
         Volumetric golden clouds rushing upward past camera
         ========================================================================= */
      if (clouds && clouds.complete && p >= 0.18 && p <= 0.62) {
        // Clouds alpha curve: enters at 0.20, peaks around 0.35, fades by 0.58
        let cloudsAlpha = 0;
        if (p < 0.32) {
          cloudsAlpha = (p - 0.18) / 0.14;
        } else if (p <= 0.46) {
          cloudsAlpha = 1.0;
        } else {
          cloudsAlpha = 1 - (p - 0.46) / 0.14;
        }

        // Rapid vertical zoom & rush: clouds scale up quickly and slide up
        const descentT = (p - 0.20) / 0.35; // 0 to 1
        const cloudsScale = 1.05 + descentT * 0.8;
        const cloudsPanY = -descentT * (ch * 0.6) + mouseOffsetY * 0.8;
        const cloudsPanX = mouseOffsetX * 0.6;

        drawImageCover(ctx, clouds, cw, ch, cloudsScale, cloudsPanX, cloudsPanY, cloudsAlpha);

        // Motion blur vertical speed streaks during the dive
        if (p >= 0.26 && p <= 0.48) {
          const streakIntensity = Math.sin(((p - 0.26) / 0.22) * Math.PI);
          ctx.save();
          ctx.globalAlpha = streakIntensity * 0.28;
          ctx.strokeStyle = 'rgba(255, 235, 195, 0.6)';
          ctx.lineWidth = 1.2;

          for (let i = 0; i < 35; i++) {
            const rx = (Math.sin(i * 99.3 + time * 0.002) * 0.5 + 0.5) * cw;
            const ry = (Math.cos(i * 33.7 + time * 0.015) * 0.5 + 0.5) * ch;
            const len = 70 + Math.random() * 140;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + (mouse.x * 5), ry - len);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      /* =========================================================================
         STAGE 2: Towering skyscraper city skyline (0.40 -> 0.76)
         "One spire above the city"
         ========================================================================= */
      if (spire && spire.complete && p >= 0.38 && p <= 0.78) {
        // Spire alpha: fades in from 0.40 to 0.50, stays full until 0.66, fades out by 0.78
        let spireAlpha = 0;
        if (p < 0.52) {
          spireAlpha = (p - 0.38) / 0.14;
        } else if (p <= 0.64) {
          spireAlpha = 1.0;
        } else {
          spireAlpha = 1 - (p - 0.64) / 0.14;
        }

        // Glide towards the pinnacle spire
        const spireProgress = (p - 0.40) / 0.35;
        const spireScale = 1.08 + spireProgress * 0.25;
        // Camera smoothly glides down the towers towards the residential penthouse level
        const spirePanY = spireProgress * (ch * 0.18) + mouseOffsetY * 0.7;
        const spirePanX = mouseOffsetX * 0.7;

        drawImageCover(ctx, spire, cw, ch, spireScale, spirePanX, spirePanY, spireAlpha);

        // Architectural apex glint (morning sun reflection on bronze/glass spire tip)
        if (spireAlpha > 0.4) {
          ctx.save();
          const glintAlpha = spireAlpha * (0.35 + Math.sin(time * 0.003) * 0.12);
          ctx.globalAlpha = Math.max(0, glintAlpha);
          const apexGlow = ctx.createRadialGradient(
            cw * 0.49 + mouseOffsetX * 0.7,
            ch * 0.36 + spirePanY,
            2,
            cw * 0.49 + mouseOffsetX * 0.7,
            ch * 0.36 + spirePanY,
            120
          );
          apexGlow.addColorStop(0, 'rgba(255, 245, 210, 0.8)');
          apexGlow.addColorStop(0.3, 'rgba(235, 185, 75, 0.35)');
          apexGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = apexGlow;
          ctx.fillRect(0, 0, cw, ch);
          ctx.restore();
        }
      }

      /* =========================================================================
         STAGE 3: Smooth glide into luxury glass penthouse interior (0.64 -> 1.00)
         "Step inside the sky" & "Where the sky comes home"
         ========================================================================= */
      if (penthouse && penthouse.complete && p >= 0.62) {
        // Penthouse alpha: fades in from 0.62 to 0.76, then 1.0 until the bottom
        let penthouseAlpha = 0;
        if (p < 0.74) {
          penthouseAlpha = (p - 0.62) / 0.12;
        } else {
          penthouseAlpha = 1.0;
        }

        // Smooth camera glide: subtle luxury dolly pan inside the residence
        const pentProgress = (p - 0.68) / 0.32; // 0 to 1
        const pentScale = 1.12 - pentProgress * 0.08; // gently zooms out revealing full panorama
        const pentPanX = mouseOffsetX * 1.2 - pentProgress * 30;
        const pentPanY = mouseOffsetY * 0.9 + pentProgress * 15;

        drawImageCover(ctx, penthouse, cw, ch, pentScale, pentPanX, pentPanY, penthouseAlpha);

        // Warm architectural lighting bloom in the interior
        if (penthouseAlpha > 0.2) {
          ctx.save();
          ctx.globalAlpha = penthouseAlpha * 0.22;
          // Ambient warm cove glow along ceiling and fireplace
          const coveGlow = ctx.createLinearGradient(0, 0, 0, ch);
          coveGlow.addColorStop(0, 'rgba(242, 196, 110, 0.18)');
          coveGlow.addColorStop(0.4, 'rgba(224, 168, 60, 0.08)');
          coveGlow.addColorStop(1, 'rgba(15, 12, 18, 0.35)');
          ctx.fillStyle = coveGlow;
          ctx.fillRect(0, 0, cw, ch);
          ctx.restore();
        }
      }

      /* =========================================================================
         PARTICLE SYSTEM: Celestial stars, cloud wisps, and interior dust motes
         ========================================================================= */
      ctx.save();
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        if (p < 0.32) {
          // Space stars & orbital dust
          pt.x += pt.speedX;
          pt.y += pt.speedY;
          if (pt.x < 0) pt.x = 1;
          if (pt.x > 1) pt.x = 0;
          if (pt.y < 0) pt.y = 1;
          if (pt.y > 1) pt.y = 0;

          const px = pt.x * cw + mouseOffsetX * 0.2;
          const py = pt.y * ch + mouseOffsetY * 0.2;
          const starAlpha = pt.opacity * (1 - p / 0.32) * (0.7 + Math.sin(time * 0.002 + i) * 0.3);

          ctx.fillStyle = `rgba(255, 245, 230, ${starAlpha})`;
          ctx.fillRect(px, py, pt.size, pt.size);
        } else if (p >= 0.25 && p <= 0.68) {
          // Cloud mist particles rushing upward
          const diveSpeed = 0.003 + (p - 0.25) * 0.005;
          pt.y -= diveSpeed;
          if (pt.y < -0.1) {
            pt.y = 1.1;
            pt.x = Math.random();
          }
          const px = pt.x * cw + mouseOffsetX * 0.4;
          const py = pt.y * ch;
          const mistAlpha = 0.15 * Math.sin(((p - 0.25) / 0.43) * Math.PI);

          ctx.fillStyle = `rgba(255, 240, 210, ${mistAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, pt.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p > 0.68) {
          // Warm golden dust motes floating in penthouse sunbeam
          pt.x += Math.sin(time * 0.001 + i) * 0.0003;
          pt.y -= 0.00015;
          if (pt.y < 0) pt.y = 1;

          const px = pt.x * cw + mouseOffsetX * 0.8;
          const py = pt.y * ch + mouseOffsetY * 0.8;
          const moteAlpha = pt.opacity * 0.35 * Math.min(1, (p - 0.68) / 0.1);

          ctx.fillStyle = `rgba(245, 210, 140, ${moteAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, pt.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Cinematic Vignette (subtle luxury edge falloff)
      ctx.save();
      const vignette = ctx.createRadialGradient(
        cw * 0.5,
        ch * 0.5,
        Math.min(cw, ch) * 0.45,
        cw * 0.5,
        ch * 0.5,
        Math.max(cw, ch) * 0.85
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(6, 7, 9, 0.58)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [scrollProgress, onStageChange, drawImageCover]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060709]" id="cinematic-canvas-container">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        id="cinematic-canvas"
      />

      {/* Elegant initial loading veil */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#060709] flex flex-col items-center justify-center text-[#d4af37] z-20 transition-opacity duration-1000">
          <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 border-t-[#d4af37] animate-spin mb-4" />
          <span className="text-[11px] tracking-[0.35em] uppercase font-sans text-[#f4efe8]/80 font-medium">
            INITIALIZING SKY SEQUENCE
          </span>
        </div>
      )}
    </div>
  );
};
