import { ARENA } from '../config.js';
import { scene } from '../core/scene.js';
import { rand } from '../utils/math.js';

const COUNT = 1500;

/** Floating specks that give the air some depth. */
export function buildDust() {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    p[i * 3] = rand(-ARENA, ARENA);
    p[i * 3 + 1] = rand(0, 30);
    p[i * 3 + 2] = rand(-ARENA, ARENA);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const mat = new THREE.PointsMaterial({ color: 0x8fd8ff, size: 0.12, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(geo, mat));
}
