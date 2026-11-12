import { getAudio } from './context.js';

/** Fast attack, exponential decay. */
function envelope(gain, t, attack, peak, decay) {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

/** Filtered noise: gunshots, explosions, clicks. */
export function noiseHit(t, dur, type, freq, peak, decay) {
  const a = getAudio();
  if (!a) return;
  const src = a.ctx.createBufferSource();
  src.buffer = a.noise;
  const filter = a.ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const gain = a.ctx.createGain();
  envelope(gain, t, 0.002, peak, decay);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(a.master);
  src.start(t);
  src.stop(t + dur);
}

/** A pitch sweep from f0 to f1: zaps, thumps, chimes. */
export function tone(t, type, f0, f1, peak, decay) {
  const a = getAudio();
  if (!a) return;
  const osc = a.ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f1, t + decay);
  const gain = a.ctx.createGain();
  envelope(gain, t, 0.003, peak, decay);
  osc.connect(gain);
  gain.connect(a.master);
  osc.start(t);
  osc.stop(t + decay + 0.05);
}

/** Current audio clock time, or null before audio starts. */
export const now = () => getAudio()?.ctx.currentTime ?? null;
