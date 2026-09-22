import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as a standalone app, hide the button
  if (isInstalled) {
    return null;
  }

  // Handle clicking the install button
  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General fallback guide
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'nav' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/50 bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#fbf8f2] text-[11px] font-sans tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)] ${className}`}
          title="Install Nirmal Chhaya Towers App on your Android or iOS device"
          id="pwa-install-nav-btn"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div
          className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0e14]/90 border border-[#d4af37]/30 backdrop-blur-md shadow-xl ${className}`}
          id="pwa-install-banner"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <p className="text-xs font-serif-luxury text-[#f4efe8]">Install Nirmal Chhaya</p>
              <p className="text-[10px] text-white/50">Instant launch &amp; offline access</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-full border border-[#d4af37] bg-[#d4af37]/20 text-[#fbf8f2] text-[10px] font-semibold tracking-wider uppercase cursor-pointer"
          >
            Get App
          </button>
        </div>
      )}

      {/* iOS Installation Instructions Sheet */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowIOSGuide(false)}
          id="pwa-ios-guide-modal"
        >
          <div
            className="relative w-full max-w-sm bg-[#0e1118] border border-[#d4af37]/40 rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.95)] my-2 mb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/[0.08] transition-colors focus:outline-none cursor-pointer"
              aria-label="Close install instructions"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/apple-touch-icon.png"
                alt="Nirmal Chhaya Towers Icon"
                className="w-12 h-12 rounded-xl border border-[#d4af37]/50 shadow-md"
              />
              <div>
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                  PWA INSTALLATION
                </span>
                <h3 className="text-lg font-serif-luxury text-[#f4efe8]">
                  Install on iPhone / iPad
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#c7bfb5] leading-relaxed mb-4">
              Add Nirmal Chhaya Towers to your home screen for full-screen immersive access without browser toolbars:
            </p>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="p-1.5 rounded-md bg-[#d4af37]/20 text-[#d4af37] shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div className="text-xs text-white/80">
                  <strong>Step 1:</strong> Tap the <span className="text-[#f4efe8] font-medium">Share</span> button in Safari&apos;s bottom navigation bar.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="p-1.5 rounded-md bg-[#d4af37]/20 text-[#d4af37] shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div className="text-xs text-white/80">
                  <strong>Step 2:</strong> Scroll down and select <span className="text-[#d4af37] font-medium">&quot;Add to Home Screen&quot;</span>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="p-1.5 rounded-md bg-[#d4af37]/20 text-[#d4af37] shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs text-white/80">
                  <strong>Step 3:</strong> Tap <span className="text-[#f4efe8] font-medium">&quot;Add&quot;</span> in the top right to complete installation.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl border border-[#d4af37] bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#fbf8f2] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </>
  );
};
