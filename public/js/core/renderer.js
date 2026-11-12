import { $ } from '../utils/dom.js';
import { camera, gunCam, gunScene, scene } from './scene.js';

export const canvas = $('game');

export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = gunCam.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  gunCam.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

/** Draw the world, then the rifle on top when it should be visible. */
export function render(withGun) {
  renderer.clear();
  renderer.render(scene, camera);
  if (withGun) {
    renderer.clearDepth();
    renderer.render(gunScene, gunCam);
  }
}
