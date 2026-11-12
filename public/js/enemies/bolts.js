import { yaw } from '../core/player-rig.js';
import { scene } from '../core/scene.js';
import { sfx } from '../audio/sfx.js';
import { burst } from '../fx/particles.js';
import { rand } from '../utils/math.js';
import { insideSolid } from '../world/collision.js';

const BOLT_LIFE = 4;
const boltGeo = new THREE.SphereGeometry(0.16, 8, 6);

/** Energy bolts fired by crystals and knots. */
export const bolts = [];

/** Fire a bolt from a core at the player's chest, with some random spread. */
export function fireBolt(enemy) {
  const from = enemy.g.position.clone();
  const target = yaw.position.clone();
  target.y -= 0.3;
  const spread = enemy.T.spread;
  const dir = target.sub(from).normalize();
  dir.x += rand(-spread, spread);
  dir.y += rand(-spread, spread);
  dir.z += rand(-spread, spread);
  dir.normalize();
  const mesh = new THREE.Mesh(boltGeo, new THREE.MeshBasicMaterial({ color: enemy.T.color }));
  mesh.position.copy(from).addScaledVector(dir, 1.1);
  scene.add(mesh);
  bolts.push({ mesh, v: dir.multiplyScalar(enemy.T.boltSpeed), life: BOLT_LIFE, dmg: enemy.T.boltDamage });
  sfx.zap();
}

function removeBolt(i) {
  scene.remove(bolts[i].mesh);
  bolts[i].mesh.material.dispose();
  bolts.splice(i, 1);
}

/**
 * Move bolts and resolve hits.
 * @param {number} dt
 * @param {THREE.Vector3} player player eye position
 * @param {(damage: number) => void} onHitPlayer
 */
export function updateBolts(dt, player, onHitPlayer) {
  for (let i = bolts.length - 1; i >= 0; i--) {
    const b = bolts[i];
    b.mesh.position.addScaledVector(b.v, dt);
    b.life -= dt;
    const p = b.mesh.position;
    const hitPlayer =
      Math.hypot(p.x - player.x, p.z - player.z) < 0.6 && p.y > player.y - 1.8 && p.y < player.y + 0.3;
    if (hitPlayer) onHitPlayer(b.dmg);
    if (hitPlayer || b.life <= 0 || p.y < 0 || insideSolid(p.x, p.z, p.y)) {
      if (!hitPlayer) burst(p, b.mesh.material.color.getHex(), 8, 3, 0.25, 0.08);
      removeBolt(i);
    }
  }
}

export function clearBolts() {
  for (let i = bolts.length - 1; i >= 0; i--) removeBolt(i);
}
