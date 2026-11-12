import { scene } from '../core/scene.js';
import { rand } from '../utils/math.js';
import { dotTexture } from './sprite.js';

const GRAVITY = 9;
const bursts = [];

/** Spray of glowing sparks at pos. Used for hits, explosions and bolt impacts. */
export function burst(pos, color, count = 26, speed = 6, life = 0.6, size = 0.12) {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  const velocities = [];
  for (let i = 0; i < count; i++) {
    p[i * 3] = pos.x;
    p[i * 3 + 1] = pos.y;
    p[i * 3 + 2] = pos.z;
    velocities.push(
      new THREE.Vector3(rand(-1, 1), rand(-0.3, 1.2), rand(-1, 1))
        .normalize()
        .multiplyScalar(rand(0.3, 1) * speed),
    );
  }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size: size * 2.2,
    map: dotTexture,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  bursts.push({ points, velocities, life, max: life });
}

/** Move sparks, fade them out and free their memory when done. */
export function updateBursts(dt) {
  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.life -= dt;
    const attr = b.points.geometry.attributes.position;
    for (let j = 0; j < b.velocities.length; j++) {
      const v = b.velocities[j];
      v.y -= GRAVITY * dt;
      attr.array[j * 3] += v.x * dt;
      attr.array[j * 3 + 1] += v.y * dt;
      attr.array[j * 3 + 2] += v.z * dt;
    }
    attr.needsUpdate = true;
    b.points.material.opacity = Math.max(0, b.life / b.max);
    if (b.life <= 0) {
      scene.remove(b.points);
      b.points.geometry.dispose();
      b.points.material.dispose();
      bursts.splice(i, 1);
    }
  }
}
