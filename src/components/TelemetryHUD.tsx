import React from 'react';
import { Compass, Navigation2 } from 'lucide-react';

interface TelemetryHUDProps {
  scrollProgress: number; // 0.0 to 1.0
  currentStage: 'orbit' | 'spire' | 'penthouse';
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  scrollProgress,
  currentStage
}) => {
  // Compute realistic altitude
  let altitudeMeters = 0;
  let altitudeFeet = 0;
  let stageLabel = 'ORBITAL EXOSPHERE';

  if (scrollProgress < 0.25) {
    const t = scrollProgress / 0.25;
    altitudeMeters = Math.round(420000 - t * 380000);
    altitudeFeet = Math.round(altitudeMeters * 3.28084);
    stageLabel = 'ORBITAL EXOSPHERE';
  } else if (scrollProgress < 0.65) {
    const t = (scrollProgress - 0.25) / 0.4;
    altitudeMeters = Math.round(40000 - t * 39558);
    altitudeFeet = Math.round(altitudeMeters * 3.28084);
    stageLabel = 'ATMOSPHERIC DESCENT';
  } else {
    const t = (scrollProgress - 0.65) / 0.35;
    altitudeMeters = Math.round(442 - t * 27);
    altitudeFeet = Math.round(altitudeMeters * 3.28084);
    stageLabel = 'NIRMAL CHHAYA TOWERS // VIP ROAD';
  }

  return (
    <aside
      className="hidden lg:flex fixed left-8 bottom-8 z-30 flex-col gap-2 font-mono text-[10px] text-[#f4efe8]/70 pointer-events-none select-none"
      aria-label="Descent Telemetry"
      id="telemetry-hud"
    >
      <div className="flex items-center gap-2 text-[#d4af37]">
        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '30s' }} />
        <span className="tracking-[0.25em] uppercase text-[9px] font-sans font-semibold">
          {stageLabel}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 bg-[#0a0c10]/60 backdrop-blur-md border border-white/[0.08] px-3.5 py-2.5 rounded-lg">
        <div className="flex items-baseline justify-between gap-6">
          <span className="text-white/40 tracking-wider">ELEVATION:</span>
          <span className="text-[#f9f5e8] font-bold tracking-widest text-[11px]">
            {altitudeFeet.toLocaleString()} FT
            <span className="text-white/40 ml-1.5 font-normal text-[9.5px]">({altitudeMeters.toLocaleString()}M)</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-6">
          <span className="text-white/40 tracking-wider">COORDINATES:</span>
          <span className="text-[#d4af37]/90 tracking-wider">30°38&apos;29&quot;N 76°49&apos;13&quot;E (Chandigarh)</span>
        </div>

        <div className="flex items-baseline justify-between gap-6">
          <span className="text-white/40 tracking-wider">VISIBILITY:</span>
          <span className="text-[#f4efe8]/80 tracking-wider">SHIVALIK RANGE // UNBROKEN</span>
        </div>
      </div>
    </aside>
  );
};
