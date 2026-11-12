import { PICKUPS, RIFLE } from '../config.js';
import { yaw } from '../core/player-rig.js';
import { scene } from '../core/scene.js';
import { sfx } from '../audio/sfx.js';
import { burst } from '../fx/particles.js';
import { shake } from '../fx/shake.js';
import { killScore } from '../game/scoring.js';
import { state } from '../game/state.js';
import { spawnPickup } from '../pickups/pickups.js';
import { hitmark } from '../ui/effects.js';
import { updateHud } from '../ui/hud.js';
import { feed } from '../ui/killfeed.js';
import { pop } from '../ui/popups.js';
import { hitMeshes } from './spawn.js';

const SHAKE_RADIUS = 14;

/** A rifle round landed on a core. */
export function hitEnemy(enemy, point) {
  enemy.hp -= RIFLE.damage;
  hitmark();
  sfx.hit();
  burst(point, enemy.T.color, 10, 4, 0.3, 0.09);
  gsap.fromTo(enemy.body.material, { emissiveIntensity: 1.5 }, { emissiveIntensity: 0.25, duration: 0.2 });
  if (enemy.hp <= 0) killEnemy(enemy);
}

/** Explode a core, award points and maybe drop a pickup. */
export function killEnemy(enemy) {
  enemy.alive = false;
  const index = hitMeshes.indexOf(enemy.body);
  if (index >= 0) hitMeshes.splice(index, 1);

  const pos = enemy.g.position;
  burst(pos, enemy.T.color, 60, 9, 0.9, 0.16);
  burst(pos, 0xffffff, 20, 4, 0.5, 0.1);
  sfx.boom();
  const d = pos.distanceTo(yaw.position);
  if (d < SHAKE_RADIUS) shake(0.25 * (1 - d / SHAKE_RADIUS));
  gsap.to(enemy.g.scale, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => scene.remove(enemy.g),
  });

  const points = killScore(enemy.T.score, state.wave);
  state.score += points;
  state.kills++;
  pop('+' + points);
  feed(enemy.T.name + ' DESTROYED', enemy.T.color);

  if (Math.random() < PICKUPS.ammoChance) spawnPickup('ammo', pos);
  else if (Math.random() < PICKUPS.healthChance) spawnPickup('health', pos);
  updateHud();
}
