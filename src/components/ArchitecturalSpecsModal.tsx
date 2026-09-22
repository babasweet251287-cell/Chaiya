import React, { useState, useEffect } from 'react';
import { X, Building2, Wind, Shield, Compass, Sparkles, Check, MapPin, Trees, Car } from 'lucide-react';

interface ArchitecturalSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenViewing: () => void;
  onOpenMaps?: () => void;
}

export const ArchitecturalSpecsModal: React.FC<ArchitecturalSpecsModalProps> = ({
  isOpen,
  onClose,
  onOpenViewing,
  onOpenMaps
}) => {
  const [activeTab, setActiveTab] = useState<'township' | 'residences' | 'connectivity' | 'amenities'>('township');

  // Prevent background scroll on mobile / iOS
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain"
      onClick={onClose}
      id="architectural-specs-modal"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0c0e14] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_24px_90px_rgba(0,0,0,0.95)] my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6 shrink-0 pt-[max(0.25rem,env(safe-area-inset-top))]">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] mb-1.5">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="text-[9.5px] sm:text-[10px] font-sans font-semibold tracking-[0.25em] uppercase truncate">
                NIRMAL CHHAYA TOWERS // ARCHITECTURAL MONOGRAPH
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif-luxury text-[#f4efe8]">
              The Engineering of Nirmal Chhaya
            </h2>
            <p className="text-[11px] sm:text-xs text-white/60 mt-1">
              VIP Road, Zirakpur, Chandigarh Tricity (Punjab, India) — 17.32-Acre Masterplanned Township
            </p>
          </div>

          {/* Close Button with >= 44x44px touch target */}
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] p-2 text-white/50 hover:text-white rounded-full hover:bg-white/[0.08] transition-colors focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Close specifications"
            id="close-specs-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Horizontal scroll with thumb touch spacing */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 sm:mb-6 border-b border-white/[0.1] shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('township')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs tracking-[0.15em] uppercase font-sans transition-all shrink-0 cursor-pointer ${
              activeTab === 'township'
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#fbf8f2] font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Township &amp; Form
          </button>
          <button
            onClick={() => setActiveTab('residences')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs tracking-[0.15em] uppercase font-sans transition-all shrink-0 cursor-pointer ${
              activeTab === 'residences'
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#fbf8f2] font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Sky Residences
          </button>
          <button
            onClick={() => setActiveTab('connectivity')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs tracking-[0.15em] uppercase font-sans transition-all shrink-0 cursor-pointer ${
              activeTab === 'connectivity'
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#fbf8f2] font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Location &amp; Maps
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs tracking-[0.15em] uppercase font-sans transition-all shrink-0 cursor-pointer ${
              activeTab === 'amenities'
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#fbf8f2] font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Amenities
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overscroll-contain pr-1 sm:pr-2">
          {activeTab === 'township' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] tracking-wider uppercase font-semibold">
                    Structural Integrity
                  </span>
                </div>
                <h4 className="font-serif-luxury text-lg sm:text-xl text-[#f4efe8] mb-2">
                  Seismic Zone IV Engineered RCC Frame
                </h4>
                <p className="text-xs text-[#c7bfb5] leading-relaxed mb-3">
                  Engineered strictly in compliance with Indian Standards IS 1893 &amp; IS 13920 for ductile detailing against severe seismic vibration and cyclonic wind shear forces.
                </p>
                <ul className="space-y-1.5 text-[11.5px] text-white/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Fe 550D TMT reinforcement steel bars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>M35/M40 high-grade ready-mix concrete</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Raft foundation anchored into dense silt stratum</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <Wind className="w-4 h-4" />
                  <span className="text-[10px] tracking-wider uppercase font-semibold">
                    Aerodynamic &amp; Environmental
                  </span>
                </div>
                <h4 className="font-serif-luxury text-lg sm:text-xl text-[#f4efe8] mb-2">
                  Micro-Climate &amp; Natural Cross-Ventilation
                </h4>
                <p className="text-xs text-[#c7bfb5] leading-relaxed mb-3">
                  Optimized orientation harnesses prevailing Himalayan breezes coming off the Shivaliks while deflecting intense summer afternoon thermal radiation.
                </p>
                <ul className="space-y-1.5 text-[11.5px] text-white/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Double-glazed soundproof acoustic glass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Thermal break powder-coated aluminum framing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>High solar-reflectance indexed (SRI) terrace finish</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'residences' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d4af37] text-[10px] tracking-widest uppercase font-semibold">
                    PENTHOUSE COLLECTION
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#d4af37]/20 text-[#d4af37]">
                    Top Floors
                  </span>
                </div>
                <h4 className="font-serif-luxury text-lg sm:text-xl text-[#f4efe8] mb-2">
                  The Crown Penthouse (4 BHK + Private Deck)
                </h4>
                <p className="text-xs text-[#c7bfb5] leading-relaxed mb-3">
                  Expansive double-height living spaces, panoramic corner glass wrap-around balconies, private sky deck, and servant quarter with independent access.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70 pt-2 border-t border-white/[0.08]">
                  <div>Ceiling Height: <strong className="text-white">11.5 ft clear</strong></div>
                  <div>Balcony: <strong className="text-white">8 ft deep sky deck</strong></div>
                  <div>Facing: <strong className="text-white">Shivalik Hills</strong></div>
                  <div>Finishes: <strong className="text-white">Italian Marble</strong></div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d4af37] text-[10px] tracking-widest uppercase font-semibold">
                    PREMIER COLLECTION
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.08] text-white/80">
                    Mid &amp; High Rise
                  </span>
                </div>
                <h4 className="font-serif-luxury text-lg sm:text-xl text-[#f4efe8] mb-2">
                  Luxury 3 &amp; 4 BHK Sky Residences
                </h4>
                <p className="text-xs text-[#c7bfb5] leading-relaxed mb-3">
                  3-side open layout ensuring uninterrupted views of central landscaped greens and city nightscapes. Modular kitchen with branded German fittings.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70 pt-2 border-t border-white/[0.08]">
                  <div>Layout: <strong className="text-white">3-Side Open</strong></div>
                  <div>Elevators: <strong className="text-white">High-Speed OTIS</strong></div>
                  <div>Power: <strong className="text-white">100% DG Backup</strong></div>
                  <div>Security: <strong className="text-white">3-Tier Biometric</strong></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connectivity' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/90 border border-white/[0.08]">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] tracking-widest uppercase font-semibold">
                    Prime VIP Road Corridor Location
                  </span>
                </div>
                <p className="text-xs text-[#c7bfb5] leading-relaxed mb-4">
                  Situated directly on VIP Road in Zirakpur, the epicenter of Chandigarh&apos;s southern expansion corridor with immediate multi-lane access to highway arteries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[#d4af37] font-semibold text-[11px] mb-1">Transit &amp; Aviation</div>
                    <p className="text-white/70 text-[11px]">
                      Shaheed Bhagat Singh Intl Airport: <strong>10-12 mins</strong> via PR7 Ring Road.<br />
                      Chandigarh Railway Station: <strong>18 mins</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[#d4af37] font-semibold text-[11px] mb-1">Commerce &amp; Lifestyle</div>
                    <p className="text-white/70 text-[11px]">
                      Elante Mall &amp; Phase 1: <strong>15 mins</strong>.<br />
                      Sector 17 Plaza City Center: <strong>20 mins</strong>.<br />
                      VIP Road High Street: <strong>0 mins walk</strong>.
                    </p>
                  </div>
                </div>

                {onOpenMaps && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMaps();
                    }}
                    className="w-full mt-4 min-h-[44px] py-3 rounded-xl border border-[#d4af37] bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#fbf8f2] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span>LAUNCH CHANDIGARH LIVE MAPS GUIDE</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <h5 className="font-serif-luxury text-base sm:text-lg text-[#f4efe8] mb-1.5">
                  Clubhouse &amp; Aquatics
                </h5>
                <p className="text-xs text-[#c7bfb5] leading-relaxed">
                  State-of-the-art resident clubhouse with swimming pool, badminton &amp; squash courts, wellness gymnasium, and banquet hall.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <h5 className="font-serif-luxury text-base sm:text-lg text-[#f4efe8] mb-1.5">
                  Lush Landscaped Parks
                </h5>
                <p className="text-xs text-[#c7bfb5] leading-relaxed">
                  Dedicated children play areas, elder-friendly reflexology walking tracks, tree-lined gazebos, and open lawns for morning yoga.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#141822]/80 border border-white/[0.08]">
                <h5 className="font-serif-luxury text-base sm:text-lg text-[#f4efe8] mb-1.5">
                  Sustainable Infrastructure
                </h5>
                <p className="text-xs text-[#c7bfb5] leading-relaxed">
                  Rainwater harvesting, EV charging bays, 24/7 treated water supply, underground cabling, and sewage treatment plant (STP).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <span className="text-[11px] text-white/50 text-center sm:text-left">
            VIP Road, Zirakpur, Chandigarh Tricity (Punjab, India)
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenMaps && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMaps();
                }}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-full border border-white/[0.2] hover:border-[#d4af37] text-white text-xs font-medium tracking-wider uppercase transition-all flex items-center justify-center cursor-pointer"
              >
                Chandigarh Map
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenViewing();
              }}
              className="flex-1 sm:flex-none min-h-[44px] px-6 sm:px-8 py-2.5 rounded-full border border-[#d4af37] bg-gradient-to-r from-[#d4af37]/30 to-[#d4af37]/15 hover:from-[#d4af37]/45 active:scale-95 text-[#fbf8f2] text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center cursor-pointer"
            >
              SCHEDULE VISIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
