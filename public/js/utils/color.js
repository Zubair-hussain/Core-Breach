/** Convert a three.js style hex number (0xff8a4c) to a CSS colour string (#ff8a4c). */
export const toCss = (hex) => '#' + (hex >>> 0).toString(16).padStart(6, '0');
