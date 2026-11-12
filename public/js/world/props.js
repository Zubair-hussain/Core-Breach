import { ARENA } from '../config.js';
import { addBox, edgeOrange } from './arena.js';

const CRATES = 26;

/**
 * Low orange crates to duck behind. Uses the same generator as the city, after it,
 * so the whole map comes from one seed.
 * @param {() => number} rng
 */
export function buildProps(rng) {
  for (let i = 0; i < CRATES; i++) {
    const x = (rng() * 2 - 1) * (ARENA - 6);
    const z = (rng() * 2 - 1) * (ARENA - 6);
    if (Math.hypot(x, z) < 6) continue;
    const s = 1.3 + rng() * 0.8;
    addBox(s, s * 0.9, s, x, z, edgeOrange, 0x1a0f0a);
  }
}
