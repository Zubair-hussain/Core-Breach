import { WAVES } from '../config.js';

/** Number of cores in a wave: 5, 7, 9 ... */
export const waveSize = (wave) => WAVES.base + wave * WAVES.perWave;

/**
 * Pick the enemy types for a wave.
 * Wave 1 has no tanks, so new players learn to aim first.
 * @param {number} wave
 * @param {() => number} [random]
 * @returns {string[]}
 */
export function composeWave(wave, random = Math.random) {
  const list = [];
  for (let i = 0; i < waveSize(wave); i++) {
    const r = random();
    if (wave < 2) list.push(r < 0.6 ? 'prism' : 'knot');
    else list.push(r < 0.3 ? 'crystal' : r < 0.65 ? 'prism' : 'knot');
  }
  return list;
}
