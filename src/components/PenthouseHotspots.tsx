import React, { useState, useEffect } from 'react';
import { PENTHOUSE_HOTSPOTS } from '../data/hotspots';
import { Hotspot } from '../types';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PenthouseHotspotsProps {
  isVisible: boolean;
}

export const PenthouseHotspots: React.FC<PenthouseHotspotsProps> = ({ isVisible }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Lock background scroll when detail modal is active
  useEffect(() => {
    if (activeHotspot) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [activeHotspot]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-700"
      id="penthouse-hotspots-layer"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Hotspot Markers */}
      {PENTHOUSE_HOTSPOTS.map((spot) => (
        <div
          key={spot.id}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        >
          <button
            onClick={() => setActiveHotspot(spot)}
            className="group relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label={`Explore ${spot.title}`}
          >
            {/* Outer pulsing wave */}
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#d4af37] opacity-30 group-hover:opacity-60" />
            
            {/* Inner ring */}
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0c10]/90 border border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-125 transition-transform duration-300">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            </span>

            {/* Label preview tooltip on hover (desktop only) */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:group-hover:flex flex-col bg-[#0e1016]/95 border border-[#d4af37]/40 px-3 py-1.5 rounded shadow-2xl pointer-events-none whitespace-nowrap z-30">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#d4af37] font-sans">
                {spot.subtitle}
              </span>
              <span className="text-[12px] font-serif-luxury text-[#f4efe8]">
                {spot.title}
              </span>
            </div>
          </button>
        </div>
      ))}

      {/* Active Hotspot Detail Modal / Popover */}
      {activeHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md pointer-events-auto animate-fade-in overscroll-contain"
          onClick={() => setActiveHotspot(null)}
        >
          <div
            className="relative max-w-md w-full bg-[#0e1016] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-7 lg:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.9)] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain my-auto"
            onClick={(e) => e.stopPropagation()}
            id="hotspot-detail-card"
          >
            {/* Close button with >= 44x44px touch area */}
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 min-w-[44px] min-h-[44px] p-2 text-white/50 hover:text-white rounded-full hover:bg-white/[0.06] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close detail"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#d4af37] mb-2 pr-8">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-[9.5px] font-sans font-semibold tracking-[0.25em] uppercase truncate">
                {activeHotspot.subtitle}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#f4efe8] mb-2.5">
              {activeHotspot.title}
            </h3>

            <p className="text-[#c7bfb5] text-xs sm:text-sm leading-relaxed mb-4 font-sans">
              {activeHotspot.description}
            </p>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#e6ddcf] text-xs leading-relaxed mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>{activeHotspot.detail}</span>
            </div>

            <button
              onClick={() => setActiveHotspot(null)}
              className="w-full min-h-[44px] py-2.5 rounded-xl border border-[#d4af37]/60 bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#fbf8f2] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
