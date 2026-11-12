import { pitch, yaw } from '../core/player-rig.js';

const RADIUS = 30;
const SPEED = 0.05;

/** Slow orbit over the city while the menu is open. */
export function attract(t) {
  yaw.position.set(Math.sin(t * SPEED) * RADIUS, 9, Math.cos(t * SPEED) * RADIUS);
  yaw.rotation.y = t * SPEED;
  pitch.rotation.x = -0.25;
}
