// Web Audio API ambient architectural soundscape generator
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let droneOsc1: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let isAudioActive = false;

export function initAmbientAudio(): boolean {
  if (isAudioActive) {
    stopAmbientAudio();
    return false;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master volume limiter
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 3);
    masterGain.connect(audioCtx.destination);

    // Filter for warm ethereal space drone
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(220, audioCtx.currentTime);
    filterNode.connect(masterGain);

    // Warm deep sub drone (55Hz - A1)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
    droneOsc1.connect(filterNode);
    droneOsc1.start();

    // Fifth harmonic (165Hz - E3) with subtle detune for celestial shimmer
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(82.4, audioCtx.currentTime); // E2
    droneOsc2.detune.setValueAtTime(4, audioCtx.currentTime);
    
    const droneGain2 = audioCtx.createGain();
    droneGain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
    droneOsc2.connect(droneGain2);
    droneGain2.connect(filterNode);
    droneOsc2.start();

    // Gentle wind / atmospheric pink noise buffer
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(340, audioCtx.currentTime);
    noiseFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(masterGain);
    noiseNode.start();

    isAudioActive = true;
    return true;
  } catch (err) {
    console.warn('AudioContext initialization note:', err);
    return false;
  }
}

export function stopAmbientAudio(): void {
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        try {
          droneOsc1?.stop();
          droneOsc2?.stop();
          noiseNode?.stop();
          audioCtx?.close();
        } catch {
          // ignore
        }
        audioCtx = null;
        masterGain = null;
        isAudioActive = false;
      }, 1000);
    } catch {
      isAudioActive = false;
    }
  } else {
    isAudioActive = false;
  }
}

export function updateAudioAltitude(progress: number): void {
  if (!filterNode || !audioCtx) return;
  try {
    // Dynamic filter opening as you descend from vacuum of space to dense atmosphere and penthouse
    const freq = 180 + progress * 400;
    filterNode.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.2);
  } catch {
    // ignore
  }
}
