import { ENEMY } from '../config.js';
import { yaw } from '../core/player-rig.js';
import { camera } from '../core/scene.js';
import { rand } from '../utils/math.js';
import { collide } from '../world/collision.js';
import { lineOfSight } from '../world/line-of-sight.js';
import { separate, steer } from './ai.js';
import { fireBolt } from './bolts.js';
import { enemies } from './spawn.js';

const camQuat = new THREE.Quaternion();

/** Ram the player at close range, then bounce back. Prisms only. */
function ram(e, dist, mx, mz, damage) {
  if (dist < e.T.ramRange && e.cd <= 0) {
    damage(e.T.ramDamage);
    e.cd = e.T.ramCooldown;
    e.g.position.x -= mx * 3;
    e.g.position.z -= mz * 3;
  }
}

/** Shoot single bolts (crystal) or bursts (knot) when the player is in sight. */
function shoot(e, dist, player) {
  if (e.cd > 0 || dist >= ENEMY.attackRange || !lineOfSight(e.g.position, player)) return;
  fireBolt(e);
  if (!e.T.burst) {
    e.cd = rand(...e.T.cooldown);
    return;
  }
  e.burst++;
  if (e.burst >= e.T.burst) {
    e.burst = 0;
    e.cd = rand(...e.T.cooldown);
  } else {
    e.cd = e.T.burstGap;
  }
}

/**
 * Move, animate and fire every living core.
 * @param {number} dt
 * @param {number} t elapsed seconds
 * @param {(damage: number) => void} damage
 */
export function updateEnemies(dt, t, damage) {
  const player = yaw.position;
  const alive = enemies.filter((e) => e.alive);
  const positions = alive.map((e) => e.g.position);
  camera.getWorldQuaternion(camQuat);

  for (const e of alive) {
    const pos = e.g.position;
    const { mx, mz, speed, dist } = steer(e.T, player.x - pos.x, player.z - pos.z, e.side);
    if (e.T.flankRange && Math.random() < dt * 0.3) e.side *= -1;
    pos.x += mx * speed * dt;
    pos.z += mz * speed * dt;
    separate(pos, positions, ENEMY.minSpacing);
    collide(pos, ENEMY.radius);

    pos.y = ENEMY.hoverHeight + Math.sin(t * 2 + e.ph) * 0.25;
    e.body.rotation.x += dt * 0.8;
    e.body.rotation.y += dt * 1.3;
    e.ring.rotation.z += dt * 2;
    e.hpBar.scale.x = Math.max(0.01, e.hp / e.max);
    e.hpBar.quaternion.copy(camQuat);

    e.cd -= dt;
    if (e.T.ramDamage) ram(e, dist, mx, mz, damage);
    else shoot(e, dist, player);
  }

  // Drop cores whose death animation has finished.
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (!enemies[i].alive && !enemies[i].g.parent) enemies.splice(i, 1);
  }
}
