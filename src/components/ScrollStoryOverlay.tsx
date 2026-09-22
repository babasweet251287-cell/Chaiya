import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Building, Layers, Eye, MapPin } from 'lucide-react';
import { PenthouseHotspots } from './PenthouseHotspots';
import { OrbitWeatherWidget } from './OrbitWeatherWidget';

interface ScrollStoryOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onOpenViewing: () => void;
  onExplorePlans: () => void;
  onOpenMaps: () => void;
}

export const ScrollStoryOverlay: React.FC<ScrollStoryOverlayProps> = ({
  scrollProgress,
  onOpenViewing,
  onExplorePlans,
  onOpenMaps
}) => {
  /* =========================================================================
     Opacity & Transform Math for Smooth Transitions
     ========================================================================= */

  // Stage 1: Earth orbit ("Beyond the horizon")
  // Active: 0.00 -> 0.28
  let stage1Opacity = 0;
  let stage1Y = 0;
  if (scrollProgress < 0.18) {
    stage1Opacity = 1;
    stage1Y = -scrollProgress * 60;
  } else if (scrollProgress <= 0.28) {
    stage1Opacity = 1 - (scrollProgress - 0.18) / 0.10;
    stage1Y = -(scrollProgress - 0.18) * 120 - 10;
  }

  // Stage 2: Spire above city ("One spire above the city")
  // Active: 0.36 -> 0.65
  let stage2Opacity = 0;
  let stage2Y = 0;
  if (scrollProgress >= 0.32 && scrollProgress < 0.42) {
    stage2Opacity = (scrollProgress - 0.32) / 0.10;
    stage2Y = 40 - stage2Opacity * 40;
  } else if (scrollProgress >= 0.42 && scrollProgress <= 0.58) {
    stage2Opacity = 1;
    stage2Y = 0;
  } else if (scrollProgress > 0.58 && scrollProgress <= 0.68) {
    stage2Opacity = 1 - (scrollProgress - 0.58) / 0.10;
    stage2Y = -(scrollProgress - 0.58) * 80;
  }

  // Stage 3A: Penthouse intro ("Step inside the sky")
  // Active: 0.70 -> 0.85
  let stage3AOpacity = 0;
  let stage3AY = 0;
  if (scrollProgress >= 0.66 && scrollProgress < 0.74) {
    stage3AOpacity = (scrollProgress - 0.66) / 0.08;
    stage3AY = 30 - stage3AOpacity * 30;
  } else if (scrollProgress >= 0.74 && scrollProgress <= 0.82) {
    stage3AOpacity = 1;
    stage3AY = 0;
  } else if (scrollProgress > 0.82 && scrollProgress <= 0.88) {
    stage3AOpacity = 1 - (scrollProgress - 0.82) / 0.06;
    stage3AY = -(scrollProgress - 0.82) * 60;
  }

  // Stage 3B: Penthouse finale ("Where the sky comes home")
  // Active: 0.87 -> 1.00
  let stage3BOpacity = 0;
  let stage3BY = 0;
  if (scrollProgress >= 0.85 && scrollProgress < 0.92) {
    stage3BOpacity = (scrollProgress - 0.85) / 0.07;
    stage3BY = 40 - stage3BOpacity * 40;
  } else if (scrollProgress >= 0.92) {
    stage3BOpacity = 1;
    stage3BY = 0;
  }

  const showHotspots = scrollProgress >= 0.70 && scrollProgress <= 0.96;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" id="story-overlay-container">
      {/* Interactive Penthouse Hotspots on the canvas */}
      <PenthouseHotspots isVisible={showHotspots} />

      {/* =======================================================================
          STAGE 1 OVERLAY: "Beyond the horizon"
          ======================================================================= */}
      {stage1Opacity > 0.01 && (
        <div
          style={{
            opacity: Math.max(0, Math.min(1, stage1Opacity)),
            transform: `translateY(${stage1Y}px)`,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 pointer-events-auto"
          id="stage-1-story"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12 w-full pt-16 sm:pt-0">
            {/* Main Stage 1 Typography */}
            <div className="max-w-2xl">
              {/* Minimalist uppercase sans-serif subtext */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="w-8 h-[1px] bg-[#d4af37]" />
                <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.38em] text-[#d4af37]">
                  STAGE I // CHANDIGARH HORIZON &amp; SHIVALIK FOOTHILLS
                </span>
              </div>

              {/* High-contrast elegant serif headline: "Beyond the horizon" */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif-luxury font-normal text-[#fcf9f2] tracking-tight leading-[1.05] mb-4 sm:mb-6 drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                Beyond the <br />
                <span className="italic font-light text-gold-gradient">horizon</span>
              </h1>

              {/* Narrative text */}
              <p className="text-sm sm:text-base lg:text-lg text-[#ded6c9]/90 font-sans font-light leading-relaxed max-w-lg mb-6 sm:mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Where northern India&apos;s celestial sunrise meets the majestic Shivalik mountain ranges. A panoramic residential vantage point descending toward Chandigarh&apos;s planned architectural canopy.
              </p>

              {/* Technical metrics badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                <div className="flex flex-col">
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                    SHIVALIK RIDGE
                  </span>
                  <span className="text-lg sm:text-2xl font-serif-luxury text-[#f4efe8]">
                    PANORAMIC
                  </span>
                </div>
                <div className="w-[1px] h-7 sm:h-8 bg-white/[0.12]" />
                <div className="flex flex-col">
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                    TRICITY AIRSPACE
                  </span>
                  <span className="text-lg sm:text-2xl font-serif-luxury text-[#f4efe8]">
                    100% UNBROKEN
                  </span>
                </div>
                <div className="w-[1px] h-7 sm:h-8 bg-white/[0.12]" />
                <div className="flex flex-col">
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                    LIGHT SPECTRUM
                  </span>
                  <span className="text-lg sm:text-2xl font-serif-luxury text-[#f4efe8]">
                    GOLDEN DAWN
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time VIP Road Chandigarh Sky Weather Widget */}
            <div className="w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
              <OrbitWeatherWidget />
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STAGE 2 OVERLAY: "One spire above the city"
          ======================================================================= */}
      {stage2Opacity > 0.01 && (
        <div
          style={{
            opacity: Math.max(0, Math.min(1, stage2Opacity)),
            transform: `translateY(${stage2Y}px)`,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 flex flex-col justify-center items-start lg:items-end max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pointer-events-auto"
          id="stage-2-story"
        >
          <div className="max-w-xl text-left lg:text-right">
            {/* Minimalist uppercase sans-serif subtext */}
            <div className="flex items-center gap-3 mb-5 lg:justify-end">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.38em] text-[#d4af37]">
                STAGE II // NIRMAL CHHAYA TOWERS, VIP ROAD
              </span>
              <span className="w-8 h-[1px] bg-[#d4af37]" />
            </div>

            {/* High-contrast elegant serif headline: "One spire above the city" */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-normal text-[#fcf9f2] tracking-tight leading-[1.08] mb-6 drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
              One spire above <br />
              <span className="italic font-light text-gold-gradient">the city</span>
            </h2>

            {/* Narrative text */}
            <p className="text-base sm:text-lg text-[#ded6c9]/90 font-sans font-light leading-relaxed max-w-md ml-auto mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              A landmark gated development spanning 17.32 lush green acres on VIP Road, Zirakpur. Piercing the tricity horizon with sculpted high-rise towers and unobstructed Shivalik mountain views.
            </p>

            {/* Quick Maps Grounding badge button */}
            <div className="flex lg:justify-end mb-6">
              <button
                onClick={onOpenMaps}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141824]/90 border border-[#d4af37]/60 text-[#fbf8f2] hover:bg-[#d4af37]/20 text-[11px] font-sans tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                id="stage2-explore-maps-cta"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Chandigarh Airport & Connectivity // Live Maps</span>
              </button>
            </div>

            {/* Architectural specification metrics */}
            <div className="flex flex-wrap items-center gap-6 lg:justify-end pt-2">
              <div className="flex flex-col text-left lg:text-right">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                  DEVELOPMENT EXPANSE
                </span>
                <span className="text-xl sm:text-2xl font-serif-luxury text-[#f4efe8]">
                  17.32 ACRES
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.12]" />
              <div className="flex flex-col text-left lg:text-right">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                  AIRPORT COMMUTE
                </span>
                <span className="text-xl sm:text-2xl font-serif-luxury text-[#f4efe8]">
                  10 MINS (IXC)
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.12]" />
              <div className="flex flex-col text-left lg:text-right">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
                  MOUNTAIN VISTA
                </span>
                <span className="text-xl sm:text-2xl font-serif-luxury text-[#f4efe8]">
                  360° SHIVALIK
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STAGE 3A OVERLAY: "Step inside the sky"
          ======================================================================= */}
      {stage3AOpacity > 0.01 && (
        <div
          style={{
            opacity: Math.max(0, Math.min(1, stage3AOpacity)),
            transform: `translateY(${stage3AY}px)`,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 flex flex-col justify-start pt-28 sm:pt-36 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pointer-events-auto"
          id="stage-3a-story"
        >
          <div className="max-w-xl">
            {/* Minimalist uppercase sans-serif subtext */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.38em] text-[#d4af37]">
                STAGE III // NIRMAL CHHAYA SKY RESIDENCE
              </span>
            </div>

            {/* High-contrast elegant serif headline: "Step inside the sky" */}
            <h2 className="text-4xl sm:text-6xl font-serif-luxury font-normal text-[#fcf9f2] tracking-tight leading-[1.08] mb-4 drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
              Step inside <br />
              <span className="italic font-light text-gold-gradient">the sky</span>
            </h2>

            {/* Narrative text */}
            <p className="text-sm sm:text-base text-[#ded6c9]/90 font-sans font-light leading-relaxed max-w-md mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Expansive 3 &amp; 4 BHK curated luxury residences framed by floor-to-ceiling glass balconies. Immersed in fresh mountain air, lush landscaped greens, and golden dawn lighting.
            </p>

            {/* Hint for interactive hotspots */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e1016]/80 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click glowing pins on the residence to inspect architectural details</span>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STAGE 3B OVERLAY: "Where the sky comes home"
          ======================================================================= */}
      {stage3BOpacity > 0.01 && (
        <div
          style={{
            opacity: Math.max(0, Math.min(1, stage3BOpacity)),
            transform: `translateY(${stage3BY}px)`,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-6 sm:px-12 pointer-events-auto"
          id="stage-3b-story"
        >
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-[#d4af37]/30 shadow-[0_24px_80px_rgba(0,0,0,0.85)] max-w-2xl w-full">
            {/* Minimalist uppercase sans-serif subtext */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.38em] text-[#d4af37]">
                NIRMAL CHHAYA TOWERS // CHANDIGARH
              </span>
              <span className="w-6 h-[1px] bg-[#d4af37]" />
            </div>

            {/* High-contrast elegant serif headline: "Where the sky comes home" */}
            <h2 className="text-4xl sm:text-6xl font-serif-luxury font-normal text-[#fcf9f2] tracking-tight leading-[1.1] mb-5">
              Where the sky <br />
              <span className="italic font-light text-gold-gradient">comes home</span>
            </h2>

            {/* Narrative text */}
            <p className="text-sm sm:text-base text-[#ded6c9] font-sans font-light leading-relaxed max-w-lg mx-auto mb-8">
              An unrepeatable sanctuary on VIP Road, Zirakpur, blending supreme Chandigarh accessibility with peaceful, panoramic Shivalik foothill living.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onOpenViewing}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#d4af37] bg-gradient-to-r from-[#d4af37]/30 to-[#d4af37]/15 hover:from-[#d4af37]/50 hover:to-[#d4af37]/25 text-[#fbf8f2] text-xs font-semibold tracking-[0.24em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.25)] cursor-pointer"
                id="cta-stage3-private-viewing"
              >
                REQUEST PRIVATE VIEWING
              </button>

              <button
                onClick={onOpenMaps}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#d4af37]/60 hover:border-[#d4af37] bg-[#141824]/90 text-[#fbf8f2] text-xs font-medium tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.12)]"
                id="cta-stage3-explore-maps"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>CHANDIGARH LIVE MAPS</span>
              </button>

              <button
                onClick={onExplorePlans}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/[0.15] hover:border-white/[0.4] bg-white/[0.04] text-white/90 text-xs font-medium tracking-[0.2em] uppercase transition-all cursor-pointer"
                id="cta-stage3-explore-plans"
              >
                SPECIFICATIONS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
