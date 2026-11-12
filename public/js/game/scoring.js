import { WAVES } from '../config.js';

/** Enemy health grows by 8% per wave. */
export const enemyHp = (base, wave) => base * (1 + (Math.max(1, wave) - 1) * WAVES.hpGrowth);

/** Kill points grow by 10% per wave, rounded to whole points. */
export const killScore = (base, wave) => Math.round(base * (1 + (Math.max(1, wave) - 1) * WAVES.scoreGrowth));
