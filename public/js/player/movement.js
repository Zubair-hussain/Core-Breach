import { PLAYER } from '../config.js';
import { yaw } from '../core/player-rig.js';
import { state } from '../game/state.js';
import { isSprinting, keys } from '../input/keyboard.js';
import { collide } from '../world/collision.js';

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
let bob = 0;

/**
 * Walk, sprint, jump and fall. Movement is relative to where the player faces.
 * @returns {{moving: boolean, sprinting: boolean, bob: number}}
 */
export function updateMovement(dt) {
  const sprinting = isSprinting();
  const speed = sprinting ? PLAYER.sprintSpeed : PLAYER.walkSpeed;
  forward.set(-Math.sin(yaw.rotation.y), 0, -Math.cos(yaw.rotation.y));
  right.set(-forward.z, 0, forward.x);

  move.set(0, 0, 0);
  if (keys.KeyW || keys.ArrowUp) move.add(forward);
  if (keys.KeyS || keys.ArrowDown) move.sub(forward);
  if (keys.KeyD || keys.ArrowRight) move.add(right);
  if (keys.KeyA || keys.ArrowLeft) move.sub(right);
  const moving = move.lengthSq() > 0;
  // Normalise so diagonal movement isn't faster.
  if (moving) move.normalize().multiplyScalar(speed * dt);
  yaw.position.add(move);
  collide(yaw.position, PLAYER.radius);

  if (keys.Space && state.grounded) {
    state.vy = PLAYER.jumpVelocity;
    state.grounded = false;
  }
  state.vy -= PLAYER.gravity * dt;
  yaw.position.y += state.vy * dt;
  if (yaw.position.y <= PLAYER.height) {
    yaw.position.y = PLAYER.height;
    state.vy = 0;
    state.grounded = true;
  }

  if (moving && state.grounded) bob += dt * (sprinting ? 13 : 9);
  return { moving, sprinting, bob };
}
