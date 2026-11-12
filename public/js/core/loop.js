import { WAVES } from '../config.js';
import { updateBolts } from '../enemies/bolts.js';
import { anyAlive, spawnEnemy } from '../enemies/spawn.js';
import { updateEnemies } from '../enemies/update.js';
import { attract } from '../fx/attract-camera.js';
import { updateBursts } from '../fx/particles.js';
import { updateTracers } from '../fx/tracers.js';
import { damage, nextWave } from '../game/flow.js';
import { state } from '../game/state.js';
import { isLocked } from '../input/pointer-lock.js';
import { updatePickups } from '../pickups/pickups.js';
import { updateMovement } from '../player/movement.js';
import { drawRadar } from '../ui/radar.js';
import { shoot } from '../weapon/rifle.js';
import { decayFlash, swayGun } from '../weapon/viewmodel.js';
import { yaw } from './player-rig.js';
import { render } from './renderer.js';

/** Longest step we simulate, so a background tab doesn't teleport everything on return. */
const MAX_DT = 0.05;
const clock = new THREE.Clock();

/** Spawn queued cores one by one; start the next wave once the arena is clear. */
function updateWaves(dt) {
  if (state.toSpawn.length) {
    state.spawnT -= dt;
    if (state.spawnT <= 0) {
      spawnEnemy(state.toSpawn.pop());
      state.spawnT = WAVES.spawnInterval;
    }
  } else if (!anyAlive()) {
    state.waveDelay -= dt;
    if (state.waveDelay <= 0) {
      nextWave();
      state.waveDelay = WAVES.betweenDelay;
    }
  }
}

function update(dt, t) {
  const { moving, sprinting, bob } = updateMovement(dt);
  swayGun(bob, sprinting && moving);
  decayFlash();

  state.fireCd -= dt;
  if (state.mouseDown && isLocked() && state.fireCd <= 0) shoot(sprinting);

  updateWaves(dt);
  updateEnemies(dt, t, damage);
  updateBolts(dt, yaw.position, damage);
  updatePickups(dt, t, yaw.position);
}

function frame() {
  const dt = Math.min(clock.getDelta(), MAX_DT);
  const t = clock.elapsedTime;
  if (state.running && !state.paused) {
    update(dt, t);
    drawRadar();
  } else if (!state.running && !state.over) {
    attract(t);
  }
  updateBursts(dt);
  updateTracers(dt);
  render(state.running);
  requestAnimationFrame(frame);
}

export function startLoop() {
  requestAnimationFrame(frame);
}
