import { canvas } from '../core/renderer.js';

let locked = false;
let onUnlock = () => {};

export const isLocked = () => locked;

/** Called when the browser releases the mouse, for example when the player presses Esc. */
export function onPointerUnlock(fn) {
  onUnlock = fn;
}

/** Capture the mouse for aiming. Some browsers return a promise that rejects if the request is too early. */
export function lock() {
  try {
    const result = canvas.requestPointerLock();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    // Pointer lock not supported: the game still renders, aiming just won't work.
  }
}

export function unlock() {
  if (document.exitPointerLock) document.exitPointerLock();
}

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  if (!locked) onUnlock();
});
