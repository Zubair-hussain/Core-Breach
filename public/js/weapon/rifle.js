import { COLORS, RIFLE } from '../config.js';
import { camera } from '../core/scene.js';
import { sfx } from '../audio/sfx.js';
import { hitEnemy } from '../enemies/combat.js';
import { hitMeshes } from '../enemies/spawn.js';
import { burst } from '../fx/particles.js';
import { tracer } from '../fx/tracers.js';
import { state } from '../game/state.js';
import { flashReloadText } from '../ui/effects.js';
import { updateHud } from '../ui/hud.js';
import { rand } from '../utils/math.js';
import { wallMeshes } from '../world/arena.js';
import { kick } from './recoil.js';
import { gun, magazine, muzzleFlash } from './viewmodel.js';

const ray = new THREE.Raycaster();
const aim = new THREE.Vector2();
const muzzleOffset = new THREE.Vector3(0.2, -0.16, -0.9);

/** Fire one round. Hitscan: the ray decides the hit instantly, the tracer is only visual. */
export function shoot(sprinting) {
  if (state.reloading) return;
  if (state.mag <= 0) {
    sfx.click();
    state.fireCd = RIFLE.emptyClickInterval;
    if (state.reserve > 0) reload();
    return;
  }
  state.mag--;
  state.fireCd = RIFLE.fireInterval;
  sfx.gun();
  kick();
  muzzleFlash();

  const spread = sprinting ? RIFLE.sprintSpread : RIFLE.spread;
  aim.set(rand(-spread, spread), rand(-spread, spread));
  ray.setFromCamera(aim, camera);
  ray.far = RIFLE.range;
  const hits = ray.intersectObjects(hitMeshes.concat(wallMeshes), false);
  const muzzle = camera.localToWorld(muzzleOffset.clone());
  const end = hits.length ? hits[0].point : ray.ray.at(120, new THREE.Vector3());
  tracer(muzzle, end);

  if (hits.length) {
    const enemy = hits[0].object.userData.enemy;
    if (enemy && enemy.alive) hitEnemy(enemy, hits[0].point);
    else burst(hits[0].point, COLORS.cyan, 8, 3, 0.25, 0.07);
  }
  updateHud();
}

/** Tilt the rifle, swap the magazine and top up from the reserve. */
export function reload() {
  if (state.reloading || state.mag === RIFLE.magSize || state.reserve === 0 || !state.running) return;
  state.reloading = true;
  sfx.reload();
  flashReloadText();
  gsap
    .timeline()
    .to(gun.rotation, { x: -0.6, z: 0.4, duration: 0.3, ease: 'power2.out' })
    .to(magazine.position, { y: -0.5, duration: 0.25 }, 0.2)
    .to(magazine.position, { y: -0.15, duration: 0.3, ease: 'back.out(2)' }, 0.85)
    .to(gun.rotation, { x: 0, z: 0, duration: 0.35, ease: 'power2.inOut' }, 1.15)
    .call(() => {
      const take = Math.min(RIFLE.magSize - state.mag, state.reserve);
      state.mag += take;
      state.reserve -= take;
      state.reloading = false;
      updateHud();
    });
}
