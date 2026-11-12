import { COLORS } from '../config.js';

/** The world: city, cores, bolts and effects. */
export const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.background);
scene.fog = new THREE.FogExp2(COLORS.background, 0.02);

export const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 400);

/**
 * The rifle lives in its own scene, drawn after the world with a cleared depth buffer,
 * so it never clips into walls.
 */
export const gunScene = new THREE.Scene();
export const gunCam = new THREE.PerspectiveCamera(60, 1, 0.01, 10);
gunScene.add(gunCam, new THREE.AmbientLight(0x8fa8d8, 0.9));
const gunKey = new THREE.DirectionalLight(0xffffff, 0.9);
gunKey.position.set(1, 2, 1);
gunScene.add(gunKey);

scene.add(new THREE.AmbientLight(0x6f86b8, 0.6));
const moon = new THREE.DirectionalLight(0xbcd2ff, 0.7);
moon.position.set(30, 60, 20);
scene.add(moon);
