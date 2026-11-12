import { COLORS, PICKUPS, PLAYER } from '../config.js';
import { scene } from '../core/scene.js';
import { sfx } from '../audio/sfx.js';
import { state } from '../game/state.js';
import { updateHud } from '../ui/hud.js';
import { pop } from '../ui/popups.js';

const pickups = [];

/** Drop an ammo box or a health gem where a core died. */
export function spawnPickup(kind, pos) {
  const color = kind === 'ammo' ? COLORS.ammo : COLORS.health;
  const geo = kind === 'ammo' ? new THREE.BoxGeometry(0.5, 0.35, 0.35) : new THREE.OctahedronGeometry(0.35);
  const group = new THREE.Group();
  group.add(
    new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 })),
    new THREE.PointLight(color, 1, 5),
  );
  group.position.set(pos.x, 0.6, pos.z);
  scene.add(group);
  pickups.push({ group, kind, life: PICKUPS.lifetime });
}

function collect(p) {
  if (p.kind === 'ammo') {
    state.reserve += PICKUPS.ammoAmount;
    pop(`+${PICKUPS.ammoAmount} AMMO`);
  } else {
    state.hp = Math.min(PLAYER.maxHp, state.hp + PICKUPS.healthAmount);
    pop(`+${PICKUPS.healthAmount} HP`);
  }
  sfx.pickup();
  updateHud();
}

/** Spin and bob pickups, collect the ones the player walks over, expire old ones. */
export function updatePickups(dt, t, player) {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.group.rotation.y += dt * 2;
    p.group.position.y = 0.6 + Math.sin(t * 3) * 0.15;
    p.life -= dt;
    const near = Math.hypot(p.group.position.x - player.x, p.group.position.z - player.z) < PICKUPS.radius;
    if (near) collect(p);
    if (near || p.life <= 0) {
      scene.remove(p.group);
      pickups.splice(i, 1);
    }
  }
}

export function clearPickups() {
  for (const p of pickups) scene.remove(p.group);
  pickups.length = 0;
}
