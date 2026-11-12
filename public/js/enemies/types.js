/**
 * The three rogue AI cores.
 * Geometry is created lazily, so this file can be imported without three.js (for tests).
 */
export const TYPES = {
  crystal: {
    name: 'CRYSTAL',
    color: 0xff8a4c,
    hp: 120,
    speed: 2.3,
    score: 150,
    size: 1.0,
    holdRange: 13,
    boltSpeed: 16,
    boltDamage: 12,
    spread: 0.03,
    cooldown: [1.6, 2.4],
    flatShading: true,
    geo: () => new THREE.IcosahedronGeometry(0.9, 1),
  },
  prism: {
    name: 'PRISM',
    color: 0x4a90ff,
    hp: 45,
    speed: 5.2,
    score: 80,
    size: 0.8,
    ramDamage: 10,
    ramRange: 1.6,
    ramCooldown: 0.9,
    flatShading: true,
    geo: () => new THREE.OctahedronGeometry(0.75, 0),
  },
  knot: {
    name: 'KNOT',
    color: 0x19d3a2,
    hp: 80,
    speed: 3.4,
    score: 120,
    size: 0.85,
    flankRange: 18,
    boltSpeed: 22,
    boltDamage: 7,
    spread: 0.06,
    burst: 3,
    burstGap: 0.15,
    cooldown: [2, 3],
    flatShading: false,
    geo: () => new THREE.TorusKnotGeometry(0.5, 0.17, 90, 12, 2, 3),
  },
};

export const TYPE_NAMES = Object.keys(TYPES);
