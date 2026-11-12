import { ARENA, COLORS } from '../config.js';
import { scene } from '../core/scene.js';
import { addSolid } from './collision.js';

/** Every mesh bullets and line-of-sight checks can hit. */
export const wallMeshes = [];

export const edgeCyan = new THREE.LineBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.6 });
export const edgeOrange = new THREE.LineBasicMaterial({
  color: COLORS.orange,
  transparent: true,
  opacity: 0.85,
});

/** Add a solid box with glowing edges, and register it for collision. */
export function addBox(w, h, d, x, z, edge = edgeCyan, fill = 0x0a1222) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: fill, roughness: 0.7, metalness: 0.2 }),
  );
  mesh.position.set(x, h / 2, z);
  scene.add(mesh);
  wallMeshes.push(mesh);
  const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge);
  lines.position.copy(mesh.position);
  scene.add(lines);
  addSolid({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, h });
}

/** Ground, grid and the four perimeter walls. */
export function buildArena() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x070b16, roughness: 0.9 }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  wallMeshes.push(ground);

  const grid = new THREE.GridHelper(ARENA * 2, 60, COLORS.cyan, 0x0f2a44);
  grid.position.y = 0.02;
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  scene.add(grid);

  addBox(ARENA * 2, 6, 1, 0, -ARENA);
  addBox(ARENA * 2, 6, 1, 0, ARENA);
  addBox(1, 6, ARENA * 2, -ARENA, 0);
  addBox(1, 6, ARENA * 2, ARENA, 0);
}
