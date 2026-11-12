/**
 * Axis-aligned boxes the player, enemies and bolts collide with.
 * Kept free of three.js so it can be unit tested in Node.
 * @typedef {{minX:number, maxX:number, minZ:number, maxZ:number, h:number}} Solid
 */

/** @type {Solid[]} */
export const solids = [];

export function addSolid(solid) {
  solids.push(solid);
}

/** True when the point (x, y, z) is inside any solid, grown by pad on each side. */
export function insideSolid(x, z, y = 0, pad = 0, list = solids) {
  for (const s of list) {
    if (x > s.minX - pad && x < s.maxX + pad && z > s.minZ - pad && z < s.maxZ + pad && y < s.h) return true;
  }
  return false;
}

/**
 * Push a circle of radius r out of every solid it overlaps.
 * Pushing along the shortest axis lets movement slide along walls.
 */
export function collide(pos, r, list = solids) {
  for (const s of list) {
    const cx = Math.max(s.minX, Math.min(pos.x, s.maxX));
    const cz = Math.max(s.minZ, Math.min(pos.z, s.maxZ));
    const dx = pos.x - cx;
    const dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    if (d2 > 1e-6) {
      const d = Math.sqrt(d2);
      const k = (r - d) / d;
      pos.x += dx * k;
      pos.z += dz * k;
    } else {
      // The centre is inside the box: leave by the nearest face.
      const px = Math.min(pos.x - s.minX, s.maxX - pos.x);
      const pz = Math.min(pos.z - s.minZ, s.maxZ - pos.z);
      if (px < pz) pos.x = pos.x - s.minX < s.maxX - pos.x ? s.minX - r : s.maxX + r;
      else pos.z = pos.z - s.minZ < s.maxZ - pos.z ? s.minZ - r : s.maxZ + r;
    }
  }
}
