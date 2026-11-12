/**
 * Movement decisions for the cores. Pure maths, no three.js.
 */

/**
 * Work out which way a core moves this frame.
 * Crystals stop and shoot inside their hold range; knots circle the player inside their flank range.
 * @param {object} type entry from TYPES
 * @param {number} dx player x minus core x
 * @param {number} dz player z minus core z
 * @param {number} side 1 or -1, the direction a knot circles
 */
export function steer(type, dx, dz, side) {
  const dist = Math.hypot(dx, dz) || 0.001;
  let mx = dx / dist;
  let mz = dz / dist;
  let speed = type.speed;
  if (type.holdRange && dist < type.holdRange) speed = 0;
  if (type.flankRange && dist < type.flankRange) {
    const ox = mx;
    mx = mx * 0.35 - mz * side;
    mz = mz * 0.35 + ox * side;
    const len = Math.hypot(mx, mz);
    mx /= len;
    mz /= len;
  }
  return { mx, mz, speed, dist };
}

/** Push pos away from every other position closer than minDist, so cores don't stack. */
export function separate(pos, others, minDist) {
  for (const o of others) {
    if (o === pos) continue;
    const ox = pos.x - o.x;
    const oz = pos.z - o.z;
    const d = Math.hypot(ox, oz);
    if (d > 0 && d < minDist) {
      pos.x += (ox / d) * (minDist - d) * 0.5;
      pos.z += (oz / d) * (minDist - d) * 0.5;
    }
  }
}
