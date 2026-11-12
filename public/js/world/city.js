import { ARENA } from '../config.js';
import { addBox } from './arena.js';

const TOWERS = 34;
const SPAWN_CLEARING = 12;

/**
 * Seeded tower blocks. The centre stays clear so the player never spawns inside a building.
 * @param {() => number} rng seeded generator from createRng
 */
export function buildCity(rng) {
  for (let i = 0; i < TOWERS; i++) {
    const w = 4 + rng() * 8;
    const d = 4 + rng() * 8;
    const h = 4 + rng() * 22;
    const x = (rng() * 2 - 1) * (ARENA - 8);
    const z = (rng() * 2 - 1) * (ARENA - 8);
    if (Math.hypot(x, z) < SPAWN_CLEARING) continue;
    addBox(w, h, d, x, z);
  }
}
