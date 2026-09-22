/**
 * Vibration API Haptic Feedback Engine
 * Provides subtle, tactile pulses for mobile immersion during
 * scroll-driven transitions between the three architectural stages:
 * - Orbit (Orbital Exosphere / Shivalik Horizon)
 * - Spire (Chandigarh Skyline & Architectural Descent)
 * - Penthouse (Sky Residence Sanctuary & Touchdown)
 */

export type StageName = 'orbit' | 'spire' | 'penthouse';

// Vibration patterns tuned specifically for luxurious, non-jarring tactile feel
export const HAPTIC_PATTERNS: Record<StageName, number | number[]> = {
  // Orbit: Whisper-light single pulse reflecting weightless celestial horizon
  orbit: [14],
  // Spire: Rhythmic dual pulse as the camera pierces through cloud deck into tower elevation
  spire: [18, 45, 14],
  // Penthouse: Crisp grounding double-pulse as you enter the private sky terrace
  penthouse: [22, 50, 20],
};

// Subtle micro-tick for UI controls and navigation buttons
export const UI_TAP_HAPTIC = [8];

let lastVibrationTimestamp = 0;
const VIBRATION_COOLDOWN_MS = 300; // Prevent jitter when user scrubs across threshold boundaries

/**
 * Check if the current browser environment and hardware support the Vibration API
 */
export function isVibrationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    typeof navigator.vibrate === 'function'
  );
}

/**
 * Check if haptic feedback is user-enabled (stored in localStorage)
 */
export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem('nirmal_chhaya_haptics_enabled');
    return stored !== null ? stored === 'true' : true;
  } catch {
    return true;
  }
}

/**
 * Update user preference for haptic feedback
 */
export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('nirmal_chhaya_haptics_enabled', String(enabled));
  } catch {
    // Ignore storage quota/privacy mode errors
  }
}

/**
 * Execute a subtle haptic pulse pattern safely
 */
export function triggerHaptic(pattern: number | number[]): boolean {
  if (!isVibrationSupported() || !isHapticsEnabled()) {
    return false;
  }

  const now = performance.now();
  if (now - lastVibrationTimestamp < VIBRATION_COOLDOWN_MS) {
    return false;
  }

  try {
    lastVibrationTimestamp = now;
    const success = navigator.vibrate(pattern);
    return success;
  } catch (err) {
    // Some mobile browsers may restrict vibrate if not focused or under strict sandbox
    console.debug('Haptic feedback suppressed or unsupported:', err);
    return false;
  }
}

/**
 * Trigger stage transition haptic pulse when descending or ascending
 */
export function triggerStageHaptic(
  newStage: StageName,
  previousStage?: StageName
): boolean {
  if (previousStage && newStage === previousStage) {
    return false;
  }

  const pattern = HAPTIC_PATTERNS[newStage];
  return triggerHaptic(pattern);
}

/**
 * Subtle micro-pulse for explicit UI taps (e.g. stage selector buttons)
 */
export function triggerTapHaptic(): boolean {
  return triggerHaptic(UI_TAP_HAPTIC);
}
