/** Random float in [a, b). */
export const rand = (a, b) => a + Math.random() * (b - a);

/** Clamp v to the range [lo, hi]. */
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Distance between two points on the ground plane. */
export const dist2d = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
