// Web Audio API Synthesized Vedic Sound Effects
let audioCtx = null;
let isAudioEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled) {
  isAudioEnabled = enabled;
}

export function getSoundEnabled() {
  return isAudioEnabled;
}

/**
 * Play a resonant Tibetan Singing Bowl / Temple Bell chime
 */
export function playTempleChime() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fundamental frequency for Om chime ~ 136.1 Hz (Cosmic frequency of Earth) or pleasant high bell 528 Hz (Solfeggio Love/Miracle frequency)
    const baseFreq = 528;

    // Harmonic partials for rich bell/bowl resonance
    const partials = [
      { f: baseFreq, gain: 0.35, decay: 2.8 },
      { f: baseFreq * 1.5, gain: 0.2, decay: 2.2 },
      { f: baseFreq * 2.01, gain: 0.15, decay: 1.8 },
      { f: baseFreq * 2.76, gain: 0.08, decay: 1.4 },
      { f: baseFreq * 3.48, gain: 0.04, decay: 1.0 }
    ];

    partials.forEach(({ f, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (e) {
    // Graceful fallback if audio is blocked
    console.debug("Audio play issue", e);
  }
}

/**
 * Play gentle celestial shimmer on Kundli revelation
 */
export function playCelestialShimmer() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73]; // Auspicious pentatonic shimmer
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 1.2);
    });
  } catch (e) {
    console.debug("Celestial shimmer issue", e);
  }
}

/**
 * Play subtle soft click for button interactions
 */
export function playSoftClick() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.debug("Soft click issue", e);
  }
}
