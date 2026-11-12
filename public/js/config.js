/**
 * Gameplay tuning in one place.
 * Change a number here and every system that depends on it follows.
 */

/** Half the width of the square arena, in metres. */
export const ARENA = 60;

/** Seed for the city layout, so every player gets the same map. */
export const MAP_SEED = 1337;

export const PLAYER = {
  height: 1.7,
  radius: 0.6,
  walkSpeed: 6.5,
  sprintSpeed: 10.5,
  jumpVelocity: 6.5,
  gravity: 18,
  maxHp: 100,
  lookSensitivity: 0.0022,
  maxPitch: 1.45,
};

export const RIFLE = {
  magSize: 30,
  startReserve: 120,
  fireInterval: 0.095,
  emptyClickInterval: 0.25,
  damage: 22,
  range: 250,
  spread: 0.012,
  sprintSpread: 0.03,
};

export const WAVES = {
  firstDelay: 1.2,
  betweenDelay: 3,
  firstSpawn: 0.5,
  spawnInterval: 0.7,
  base: 3,
  perWave: 2,
  hpGrowth: 0.08,
  scoreGrowth: 0.1,
};

export const PICKUPS = {
  ammoChance: 0.35,
  healthChance: 0.25,
  ammoAmount: 45,
  healthAmount: 30,
  lifetime: 20,
  radius: 1.5,
};

export const ENEMY = {
  radius: 0.9,
  hoverHeight: 1.6,
  minSpacing: 1.8,
  attackRange: 45,
  minSpawnDistance: 22,
};

/** localStorage key for the best score. */
export const STORAGE_KEY = 'coreBreach.best';

/** Keys used by earlier builds, migrated on first load. */
export const LEGACY_STORAGE_KEYS = ['neonStrikeBest'];

export const COLORS = {
  background: 0x04070f,
  cyan: 0x19e3ff,
  orange: 0xff8a4c,
  tracer: 0xffd36a,
  flash: 0xffb060,
  ammo: 0xffc83d,
  health: 0x19d3a2,
};
