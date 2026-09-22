import React from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';

interface ScrollIndicatorProps {
  scrollProgress: number; // 0.0 to 1.0
  onScrollNext: () => void;
  onScrollToTop: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  scrollProgress,
  onScrollNext,
  onScrollToTop
}) => {
  const isNearEnd = scrollProgress > 0.92;
  const percentDisplay = Math.round(scrollProgress * 100);

  return (
    <div
      id="fixed-scroll-indicator"
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto transition-all duration-500"
    >
      {!isNearEnd ? (
        <button
          onClick={onScrollNext}
          className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
          id="scroll-to-descend-btn"
          aria-label="Scroll to descend through stages"
        >
          {/* Subtle glowing pill frame */}
          <div className="flex items-center gap-3 px-5 py-2 rounded-full glass-card border border-white/[0.1] group-hover:border-[#d4af37]/50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            {/* Animated pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]" />
            </span>

            {/* Exact requirement text: "SCROLL TO DESCEND" */}
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#f4efe8]/90 group-hover:text-[#d4af37] transition-colors whitespace-nowrap">
              SCROLL TO DESCEND
            </span>

            {/* Subtle percentage tracker */}
            <span className="text-[9.5px] font-mono tracking-widest text-[#d4af37]/70 border-l border-white/[0.12] pl-2.5">
              {percentDisplay}%
            </span>
          </div>

          {/* Vertical fading chevron indicator */}
          <div className="flex flex-col items-center text-[#d4af37]/80 group-hover:text-[#d4af37] transition-all duration-300 animate-bounce">
            <ChevronDown className="w-4 h-4 -mb-1 opacity-60" />
            <ChevronDown className="w-4 h-4 opacity-90" />
          </div>
        </button>
      ) : (
        <button
          onClick={onScrollToTop}
          className="group flex items-center gap-2.5 px-5 py-2 rounded-full glass-card border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.18)]"
          id="return-to-orbit-btn"
          aria-label="Return to orbit"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#d4af37] group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10.5px] font-sans font-medium tracking-[0.28em] uppercase text-[#f9f5e8]">
            ASCEND TO ORBIT
          </span>
        </button>
      )}
    </div>
  );
};
