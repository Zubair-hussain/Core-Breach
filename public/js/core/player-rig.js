import { COLORS } from '../config.js';
import { camera, scene } from './scene.js';

/**
 * Player rig: yaw (turn left/right) holds pitch (look up/down), which holds the camera.
 * Splitting the two rotations avoids gimbal problems when looking around.
 */
export const yaw = new THREE.Object3D();
export const pitch = new THREE.Object3D();
yaw.add(pitch);
pitch.add(camera);
scene.add(yaw);

/** A soft light that follows the player so nearby walls stay readable. */
camera.add(new THREE.PointLight(COLORS.cyan, 0.9, 30));
