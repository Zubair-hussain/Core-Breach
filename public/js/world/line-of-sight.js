import { wallMeshes } from './arena.js';

const ray = new THREE.Raycaster();
const dir = new THREE.Vector3();

/** True when nothing solid sits between two points. Cores only shoot when they can see you. */
export function lineOfSight(from, to) {
  dir.copy(to).sub(from);
  const dist = dir.length();
  dir.normalize();
  ray.set(from, dir);
  ray.far = dist;
  return ray.intersectObjects(wallMeshes, false).length === 0;
}
