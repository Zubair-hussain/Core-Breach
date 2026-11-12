const MODULUS = 2147483647;

/**
 * Park-Miller pseudo-random generator.
 * The same seed always produces the same sequence, which keeps the city layout identical for every player.
 * @param {number} seed
 * @returns {() => number} a function returning floats in (0, 1)
 */
export function createRng(seed) {
  let s = Math.floor(seed) % MODULUS;
  if (s <= 0) s += MODULUS - 1;
  return () => (s = (s * 16807) % MODULUS) / MODULUS;
}
