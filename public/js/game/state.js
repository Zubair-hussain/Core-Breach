import { PLAYER, RIFLE, WAVES } from '../config.js';

const fresh = () => ({
  paused: false,
  over: false,
  hp: PLAYER.maxHp,
  mag: RIFLE.magSize,
  reserve: RIFLE.startReserve,
  reloading: false,
  score: 0,
  kills: 0,
  wave: 0,
  toSpawn: [],
  spawnT: 0,
  waveDelay: WAVES.firstDelay,
  fireCd: 0,
  mouseDown: false,
  vy: 0,
  grounded: true,
});

/** The single mutable game state shared by every system. */
export const state = { running: false, ...fresh() };

/** Put everything back to the start of a run. Leaves `running` alone. */
export function resetState() {
  Object.assign(state, fresh());
}
