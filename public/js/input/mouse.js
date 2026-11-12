import { PLAYER } from '../config.js';
import { pitch, yaw } from '../core/player-rig.js';
import { canvas } from '../core/renderer.js';
import { state } from '../game/state.js';
import { clamp } from '../utils/math.js';
import { isLocked, lock } from './pointer-lock.js';

document.addEventListener('mousemove', (e) => {
  if (!isLocked() || !state.running) return;
  yaw.rotation.y -= e.movementX * PLAYER.lookSensitivity;
  pitch.rotation.x = clamp(
    pitch.rotation.x - e.movementY * PLAYER.lookSensitivity,
    -PLAYER.maxPitch,
    PLAYER.maxPitch,
  );
});

canvas.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  // The first click after the mouse was released only grabs it again, it doesn't shoot.
  if (state.running && !isLocked()) {
    lock();
    return;
  }
  state.mouseDown = true;
});

document.addEventListener('mouseup', () => {
  state.mouseDown = false;
});
