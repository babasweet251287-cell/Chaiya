import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, MapPin, Smartphone } from 'lucide-react';
import { initAmbientAudio, stopAmbientAudio } from '../utils/audio';
import {
  isVibrationSupported,
  isHapticsEnabled,
  setHapticsEnabled,
  triggerTapHaptic
} from '../utils/haptics';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationProps {
  onOpenViewing: () => void;
  onOpenMaps: () => void;
  onNavigateToStage: (stage: 'orbit' | 'spire' | 'penthouse' | 'details') => void;
  currentStage: 'orbit' | 'spire' | 'penthouse';
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenViewing,
  onOpenMaps,
  onNavigateToStage,
  currentStage
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vibrationSupported, setVibrationSupported] = useState(false);
  const [hapticsActive, setHapticsActive] = useState(true);

  useEffect(() => {
    setVibrationSupported(isVibrationSupported());
    setHapticsActive(isHapticsEnabled());
  }, []);

  const toggleAudio = () => {
    triggerTapHaptic();
    if (isAudioPlaying) {
      stopAmbientAudio();
      setIsAudioPlaying(false);
    } else {
      const started = initAmbientAudio();
      setIsAudioPlaying(started);
    }
  };

  const toggleHaptics = () => {
    const nextState = !hapticsActive;
    setHapticsEnabled(nextState);
    setHapticsActive(nextState);
    if (nextState) {
      triggerTapHaptic();
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 glass-nav border-b border-white/[0.07] pt-[env(safe-area-inset-top)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <button
            onClick={() => onNavigateToStage('orbit')}
            className="flex items-center gap-2.5 sm:gap-3.5 group text-left cursor-pointer focus:outline-none min-h-[44px]"
            id="brand-logo-btn"
          >
            <div className="w-8 h-8 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#0e1016]/80 group-hover:border-[#d4af37] transition-colors shrink-0">
              <div className="w-1.5 h-3.5 bg-gradient-to-b from-[#f9f5e8] to-[#d4af37] rounded-sm transform rotate-45 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-display-luxury tracking-[0.18em] sm:tracking-[0.22em] text-[12.5px] sm:text-[14.5px] font-semibold text-[#f4efe8] group-hover:text-[#d4af37] transition-colors truncate">
                NIRMAL CHHAYA
              </span>
              <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.26em] sm:tracking-[0.32em] text-[#d4af37]/90 font-medium">
                CHANDIGARH RESIDENCES
              </span>
            </div>
          </button>

          {/* Desktop Brand Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" id="desktop-nav-links">
            <button
              onClick={() => onNavigateToStage('orbit')}
              className={`text-[11px] xl:text-[11.5px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                currentStage === 'orbit'
                  ? 'text-[#d4af37] font-semibold'
                  : 'text-[#f4efe8]/70 hover:text-[#f4efe8]'
              }`}
              id="nav-link-orbit"
            >
              Horizon
            </button>
            <button
              onClick={() => onNavigateToStage('spire')}
              className={`text-[11px] xl:text-[11.5px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                currentStage === 'spire'
                  ? 'text-[#d4af37] font-semibold'
                  : 'text-[#f4efe8]/70 hover:text-[#f4efe8]'
              }`}
              id="nav-link-spire"
            >
              The Towers
            </button>
            <button
              onClick={() => onNavigateToStage('penthouse')}
              className={`text-[11px] xl:text-[11.5px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                currentStage === 'penthouse'
                  ? 'text-[#d4af37] font-semibold'
                  : 'text-[#f4efe8]/70 hover:text-[#f4efe8]'
              }`}
              id="nav-link-penthouse"
            >
              Penthouse
            </button>
            <button
              onClick={() => onNavigateToStage('details')}
              className="text-[11px] xl:text-[11.5px] tracking-[0.2em] uppercase text-[#f4efe8]/70 hover:text-[#f4efe8] transition-colors cursor-pointer"
              id="nav-link-architecture"
            >
              Architecture
            </button>
            <button
              onClick={onOpenMaps}
              className="px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 text-[#f4efe8] text-[10.5px] tracking-[0.18em] uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.15)]"
              id="nav-link-maps"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Chandigarh Guide</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton variant="nav" />
          </nav>

          {/* Right Controls: Ambient Soundscape, PWA & Private Viewing CTA */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Quick Map Button for mobile & tablet */}
            <button
              onClick={onOpenMaps}
              className="lg:hidden min-w-[40px] min-h-[40px] p-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 flex items-center justify-center transition-all cursor-pointer"
              title="Open Chandigarh Maps Guide"
              id="quick-maps-btn"
              aria-label="Open Chandigarh Maps Guide"
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleAudio}
              className="min-w-[40px] min-h-[40px] p-2 rounded-full border border-white/[0.12] text-[#f4efe8]/80 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all bg-[#0e1016]/40 cursor-pointer focus:outline-none flex items-center justify-center"
              title={isAudioPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
              id="ambient-sound-toggle-btn"
              aria-label="Toggle ambient soundscape"
            >
              {isAudioPlaying ? (
                <div className="flex items-center gap-1.5 px-0.5">
                  <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
                  <span className="text-[8.5px] tracking-[0.2em] uppercase text-[#d4af37] hidden sm:inline">
                    LIVE
                  </span>
                </div>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Haptic Feedback Indicator/Toggle */}
            {vibrationSupported && (
              <button
                onClick={toggleHaptics}
                className={`min-w-[40px] min-h-[40px] p-2 rounded-full border transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
                  hapticsActive
                    ? 'border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10'
                    : 'border-white/[0.12] text-[#f4efe8]/40 hover:text-[#f4efe8]/70 bg-[#0e1016]/40'
                }`}
                title={hapticsActive ? 'Disable haptic pulses' : 'Enable haptic pulses'}
                id="haptics-toggle-btn"
                aria-label="Toggle haptic vibration feedback"
              >
                <Smartphone className={`w-4 h-4 ${hapticsActive ? 'animate-pulse' : ''}`} />
              </button>
            )}

            {/* Right-aligned "PRIVATE VIEWING" call-to-action button */}
            <button
              onClick={onOpenViewing}
              className="relative group overflow-hidden min-h-[40px] px-3.5 sm:px-5 lg:px-6 py-2 rounded-full border border-[#d4af37]/60 bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/5 hover:from-[#d4af37]/30 hover:to-[#d4af37]/15 text-[#f9f5e8] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.12)] flex items-center justify-center"
              id="nav-private-viewing-cta"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.2em] sm:tracking-[0.26em] uppercase whitespace-nowrap">
                  VIEWING
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>

            {/* Mobile menu hamburger toggle with >= 44x44px touch area */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] p-2 text-[#f4efe8]/80 hover:text-white flex items-center justify-center cursor-pointer"
              id="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu - Full 100dvh safe area */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#060709]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between px-6 sm:px-8 pt-[max(5.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain"
          id="mobile-menu-drawer"
        >
          <div className="flex flex-col gap-4">
            <span className="text-[9.5px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              NAVIGATION MENU
            </span>

            <button
              onClick={() => {
                onNavigateToStage('orbit');
                setMobileMenuOpen(false);
              }}
              className="min-h-[44px] text-left text-lg font-serif-luxury text-[#f4efe8] py-2.5 border-b border-white/[0.08] flex items-center justify-between"
            >
              <span>Stage I: Beyond The Horizon</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Orbit</span>
            </button>

            <button
              onClick={() => {
                onNavigateToStage('spire');
                setMobileMenuOpen(false);
              }}
              className="min-h-[44px] text-left text-lg font-serif-luxury text-[#f4efe8] py-2.5 border-b border-white/[0.08] flex items-center justify-between"
            >
              <span>Stage II: Nirmal Chhaya Towers</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Towers</span>
            </button>

            <button
              onClick={() => {
                onNavigateToStage('penthouse');
                setMobileMenuOpen(false);
              }}
              className="min-h-[44px] text-left text-lg font-serif-luxury text-[#f4efe8] py-2.5 border-b border-white/[0.08] flex items-center justify-between"
            >
              <span>Stage III: The Crown Penthouse</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Penthouse</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMaps();
              }}
              className="min-h-[44px] text-left text-lg font-serif-luxury text-[#d4af37] py-2.5 border-b border-white/[0.08] flex items-center justify-between"
            >
              <span>Chandigarh Guide &amp; Maps</span>
              <MapPin className="w-4 h-4 text-[#d4af37]" />
            </button>

            <button
              onClick={() => {
                onNavigateToStage('details');
                setMobileMenuOpen(false);
              }}
              className="min-h-[44px] text-left text-lg font-serif-luxury text-[#f4efe8] py-2.5 border-b border-white/[0.08] flex items-center justify-between"
            >
              <span>Architectural Monograph</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Specs</span>
            </button>
          </div>

          {/* Bottom Actions inside mobile drawer */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.08]">
            {/* Mobile Haptic Setting */}
            {vibrationSupported && (
              <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#d4af37]" />
                  <div className="flex flex-col">
                    <span className="text-xs font-sans font-medium text-[#f4efe8]">
                      Haptic Descent Feedback
                    </span>
                    <span className="text-[9.5px] text-white/50">
                      Vibration pulses on stage transitions
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleHaptics}
                  className={`px-3 py-1 rounded-full text-[9.5px] font-mono font-medium tracking-wider transition-all cursor-pointer ${
                    hapticsActive
                      ? 'bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-white/10 text-white/40 border border-white/10'
                  }`}
                  id="drawer-haptics-toggle"
                >
                  {hapticsActive ? 'ACTIVE' : 'MUTED'}
                </button>
              </div>
            )}

            {/* PWA Install Button Banner */}
            <PWAInstallButton variant="banner" />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenViewing();
              }}
              className="w-full min-h-[48px] py-3.5 rounded-full border border-[#d4af37] bg-[#d4af37]/20 hover:bg-[#d4af37]/35 active:scale-98 text-[#fbf8f2] text-xs font-semibold tracking-[0.24em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center cursor-pointer"
            >
              REQUEST PRIVATE VIEWING
            </button>
          </div>
        </div>
      )}
    </>
  );
};
