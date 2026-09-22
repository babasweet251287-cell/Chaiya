import React, { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from './components/Navigation';
import { CinematicCanvas } from './components/CinematicCanvas';
import { ScrollStoryOverlay } from './components/ScrollStoryOverlay';
import { ScrollIndicator } from './components/ScrollIndicator';
import { TelemetryHUD } from './components/TelemetryHUD';
import { PrivateViewingModal } from './components/PrivateViewingModal';
import { ArchitecturalSpecsModal } from './components/ArchitecturalSpecsModal';
import { ChandigarhMapsExplorer } from './components/ChandigarhMapsExplorer';
import { updateAudioAltitude } from './utils/audio';
import { triggerStageHaptic, triggerTapHaptic } from './utils/haptics';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<'orbit' | 'spire' | 'penthouse'>('orbit');
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isMapsOpen, setIsMapsOpen] = useState(false);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const prevScrollStageRef = useRef<'orbit' | 'spire' | 'penthouse'>('orbit');
  const isInitialMount = useRef(true);

  // Initialize GSAP ScrollTrigger
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    // Create the master scroll trigger pinned to the window
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6, // Smooth dampening for jank-free scrubbing
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        updateAudioAltitude(p);

        // Immediate scroll-driven stage transition haptics
        let stage: 'orbit' | 'spire' | 'penthouse' = 'orbit';
        if (p < 0.32) {
          stage = 'orbit';
        } else if (p < 0.70) {
          stage = 'spire';
        } else {
          stage = 'penthouse';
        }

        if (prevScrollStageRef.current !== stage) {
          const prev = prevScrollStageRef.current;
          prevScrollStageRef.current = stage;
          if (!isInitialMount.current) {
            triggerStageHaptic(stage, prev);
          }
          isInitialMount.current = false;
        }
      }
    });

    // Handle initial scroll value
    setScrollProgress(trigger.progress || 0);

    return () => {
      trigger.kill();
    };
  }, []);

  // Stage updates from canvas/scroll
  const handleStageChange = useCallback((stage: 'orbit' | 'spire' | 'penthouse') => {
    setCurrentStage((prev) => {
      if (prev !== stage && !isInitialMount.current) {
        triggerStageHaptic(stage, prev);
      }
      return stage;
    });
  }, []);

  // Programmatic navigation to specific stages
  const navigateToStage = (stage: 'orbit' | 'spire' | 'penthouse' | 'details') => {
    triggerTapHaptic();
    if (stage === 'details') {
      setIsSpecsOpen(true);
      return;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let targetP = 0;
    if (stage === 'orbit') targetP = 0.02;
    if (stage === 'spire') targetP = 0.48;
    if (stage === 'penthouse') targetP = 0.85;

    window.scrollTo({
      top: targetP * maxScroll,
      behavior: 'smooth'
    });
  };

  // Scroll down by next stage increment
  const handleScrollNext = () => {
    triggerTapHaptic();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let nextProgress = scrollProgress + 0.28;
    if (nextProgress > 1) nextProgress = 1;

    window.scrollTo({
      top: nextProgress * maxScroll,
      behavior: 'smooth'
    });
  };

  const handleScrollToTop = () => {
    triggerTapHaptic();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-[#060709] text-[#f4efe8] min-h-screen selection:bg-[#d4af37]/30 selection:text-[#fbf8f2]" id="app-root">
      {/* Fixed Glassmorphic Navigation Header */}
      <Navigation
        onOpenViewing={() => setIsViewingOpen(true)}
        onOpenMaps={() => setIsMapsOpen(true)}
        onNavigateToStage={navigateToStage}
        currentStage={currentStage}
      />

      {/* Full-screen High-Resolution Cinematic Canvas Sequence */}
      <CinematicCanvas
        scrollProgress={scrollProgress}
        onStageChange={handleStageChange}
      />

      {/* Storytelling Typographic Overlays (Orbit -> Atmosphere/Spire -> Luxury Penthouse) */}
      <ScrollStoryOverlay
        scrollProgress={scrollProgress}
        onOpenViewing={() => setIsViewingOpen(true)}
        onExplorePlans={() => setIsSpecsOpen(true)}
        onOpenMaps={() => setIsMapsOpen(true)}
      />

      {/* Telemetry Altitude & Compass HUD */}
      <TelemetryHUD
        scrollProgress={scrollProgress}
        currentStage={currentStage}
      />

      {/* Fixed "SCROLL TO DESCEND" indicator with subtle fading movement */}
      <ScrollIndicator
        scrollProgress={scrollProgress}
        onScrollNext={handleScrollNext}
        onScrollToTop={handleScrollToTop}
      />

      {/* Chandigarh Live Maps Grounding Intelligence Explorer */}
      <ChandigarhMapsExplorer
        isOpen={isMapsOpen}
        onClose={() => setIsMapsOpen(false)}
        onOpenViewing={() => setIsViewingOpen(true)}
      />

      {/* Private Viewing Booking Modal */}
      <PrivateViewingModal
        isOpen={isViewingOpen}
        onClose={() => setIsViewingOpen(false)}
      />

      {/* Architectural Specifications Modal */}
      <ArchitecturalSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        onOpenViewing={() => setIsViewingOpen(true)}
        onOpenMaps={() => setIsMapsOpen(true)}
      />

      {/* Virtual Scroll Track: gives ample height for silky-smooth GSAP ScrollTrigger scrubbing */}
      <div
        ref={scrollTrackRef}
        className="relative pointer-events-none w-full"
        style={{ height: '550vh' }}
        id="scroll-track"
        aria-hidden="true"
      />
    </div>
  );
}
