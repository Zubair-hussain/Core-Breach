import { noiseHit, now, tone } from './synth.js';

/** Wrap a sound so it does nothing until audio has started. */
const sound = (play) => () => {
  const t = now();
  if (t !== null) play(t);
};

/** Every sound in the game, synthesised live. No audio files. */
export const sfx = {
  gun: sound((t) => {
    noiseHit(t, 0.25, 'lowpass', 3200, 0.9, 0.12);
    tone(t, 'sine', 160, 45, 0.8, 0.12);
  }),
  zap: sound((t) => tone(t, 'square', 900, 180, 0.12, 0.16)),
  hit: sound((t) => tone(t, 'sine', 1500, 1200, 0.25, 0.05)),
  hurt: sound((t) => tone(t, 'sawtooth', 220, 90, 0.25, 0.2)),
  boom: sound((t) => {
    noiseHit(t, 1.2, 'lowpass', 500, 0.9, 0.8);
    tone(t, 'sine', 90, 30, 0.9, 0.6);
  }),
  reload: sound((t) => {
    noiseHit(t, 0.06, 'highpass', 2500, 0.5, 0.04);
    noiseHit(t + 0.9, 0.06, 'highpass', 2000, 0.6, 0.05);
    noiseHit(t + 1.3, 0.06, 'highpass', 3000, 0.6, 0.04);
  }),
  click: sound((t) => noiseHit(t, 0.04, 'highpass', 4000, 0.3, 0.03)),
  pickup: sound((t) => {
    tone(t, 'sine', 660, 990, 0.3, 0.15);
    tone(t + 0.08, 'sine', 990, 1320, 0.25, 0.15);
  }),
  wave: sound((t) => {
    [523, 659, 784].forEach((f, i) => tone(t + i * 0.12, 'triangle', f, f, 0.25, 0.3));
  }),
};
