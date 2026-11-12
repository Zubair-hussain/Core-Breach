import { PLAYER, WAVES } from '../config.js';
import { initAudio } from '../audio/context.js';
import { sfx } from '../audio/sfx.js';
import { pitch, yaw } from '../core/player-rig.js';
import { clearBolts } from '../enemies/bolts.js';
import { clearEnemies } from '../enemies/spawn.js';
import { shake } from '../fx/shake.js';
import { lock, unlock } from '../input/pointer-lock.js';
import { clearPickups } from '../pickups/pickups.js';
import { banner } from '../ui/banner.js';
import { hurtFx } from '../ui/effects.js';
import { updateHud } from '../ui/hud.js';
import { hideGameOver, setBest, showGameOver, showHud, showMenu } from '../ui/menu.js';
import { state, resetState } from './state.js';
import { loadBest, saveBest } from './storage.js';
import { composeWave } from './waves.js';

let best = loadBest();
export const getBest = () => best;

export function pause(on) {
  state.paused = on;
  showMenu(on);
}

/** Clear the arena and put the player back in the middle. */
export function reset() {
  clearEnemies();
  clearBolts();
  clearPickups();
  resetState();
  yaw.position.set(0, PLAYER.height, 0);
  yaw.rotation.y = 0;
  pitch.rotation.x = 0;
  hideGameOver();
  updateHud();
}

/** PLAY, RESUME and PLAY AGAIN all land here. */
export function start() {
  initAudio();
  if (!state.running || state.over) reset();
  state.running = true;
  pause(false);
  showHud(true);
  lock();
}

export function nextWave() {
  state.wave++;
  state.toSpawn = composeWave(state.wave);
  state.spawnT = WAVES.firstSpawn;
  banner(`WAVE ${state.wave}`, `${state.toSpawn.length} AI CORES INBOUND`);
  sfx.wave();
  updateHud();
}

export function damage(amount) {
  if (state.over) return;
  state.hp -= amount;
  hurtFx();
  sfx.hurt();
  shake(0.08);
  updateHud();
  if (state.hp <= 0) gameOver();
}

export function gameOver() {
  state.over = true;
  state.running = false;
  if (state.score > best) {
    best = state.score;
    saveBest(best);
  }
  setBest(best);
  showHud(false);
  showGameOver(state);
  unlock();
}
