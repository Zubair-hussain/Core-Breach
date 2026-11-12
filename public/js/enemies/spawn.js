import { ARENA, ENEMY } from '../config.js';
import { yaw } from '../core/player-rig.js';
import { scene } from '../core/scene.js';
import { enemyHp } from '../game/scoring.js';
import { state } from '../game/state.js';
import { rand } from '../utils/math.js';
import { insideSolid } from '../world/collision.js';
import { TYPES } from './types.js';

/** Every core in the current run, alive or playing its death animation. */
export const enemies = [];

/** Core bodies the rifle ray can hit. */
export const hitMeshes = [];

/** A spot near the edge of the arena, clear of buildings and not right next to the player. */
function spawnPoint() {
  let x = 0;
  let z = 0;
  for (let tries = 0; tries < 40; tries++) {
    const a = rand(0, Math.PI * 2);
    const r = rand(ARENA * 0.55, ARENA - 4);
    x = Math.cos(a) * r;
    z = Math.sin(a) * r;
    const blocked = insideSolid(x, z, 0, 1.5);
    const tooClose = Math.hypot(x - yaw.position.x, z - yaw.position.z) < ENEMY.minSpawnDistance;
    if (!blocked && !tooClose) break;
  }
  return { x, z };
}

/** Build a core: body, wireframe shell, spinning ring, health bar and glow. */
export function spawnEnemy(type) {
  const T = TYPES[type];
  const { x, z } = spawnPoint();
  const group = new THREE.Group();
  group.position.set(x, ENEMY.hoverHeight, z);

  const geo = T.geo();
  const body = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: T.color,
      emissive: T.color,
      emissiveIntensity: 0.25,
      metalness: 0.5,
      roughness: 0.3,
      flatShading: T.flatShading,
    }),
  );
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
  );
  wire.scale.setScalar(1.04);
  body.add(wire);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.25 * T.size, 0.03, 6, 48),
    new THREE.MeshBasicMaterial({ color: T.color }),
  );
  ring.rotation.x = Math.PI / 2;

  const hpBar = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.08),
    new THREE.MeshBasicMaterial({ color: T.color, depthTest: false }),
  );
  hpBar.position.y = 1.4;
  hpBar.renderOrder = 10;

  group.add(body, ring, hpBar, new THREE.PointLight(T.color, 1.2, 8));
  scene.add(group);

  const hp = enemyHp(T.hp, state.wave);
  const enemy = {
    type,
    T,
    g: group,
    body,
    ring,
    hpBar,
    hp,
    max: hp,
    cd: rand(1, 2.5),
    burst: 0,
    side: Math.random() < 0.5 ? -1 : 1,
    ph: rand(0, 6),
    alive: true,
  };
  body.userData.enemy = enemy;
  hitMeshes.push(body);
  enemies.push(enemy);
  gsap.from(group.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.6, ease: 'back.out(2)' });
  return enemy;
}

export const anyAlive = () => enemies.some((e) => e.alive);

export function clearEnemies() {
  for (const e of enemies) scene.remove(e.g);
  enemies.length = 0;
  hitMeshes.length = 0;
}
