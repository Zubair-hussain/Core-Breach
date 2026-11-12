import { COLORS } from '../config.js';
import { camera, gunCam } from '../core/scene.js';
import { dotTexture } from '../fx/sprite.js';
import { rand } from '../utils/math.js';

/** Resting position of the rifle in front of the camera. */
export const GUN_POS = new THREE.Vector3(0.22, -0.21, -0.56);

/** The rifle, built from boxes and a cylinder. */
export const gun = new THREE.Group();

const dark = new THREE.MeshStandardMaterial({ color: 0x141b2b, metalness: 0.7, roughness: 0.35 });
const glow = new THREE.MeshBasicMaterial({ color: COLORS.cyan });

function part(geo, mat, x, y, z) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  gun.add(m);
  return m;
}

part(new THREE.BoxGeometry(0.12, 0.14, 0.62), dark, 0, 0, 0);
part(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 10), dark, 0, 0.02, -0.48).rotation.x = Math.PI / 2;
part(new THREE.BoxGeometry(0.08, 0.18, 0.09), dark, 0, -0.13, 0.12).rotation.x = 0.3;
/** The magazine drops out during a reload. */
export const magazine = part(new THREE.BoxGeometry(0.07, 0.2, 0.1), dark, 0, -0.15, -0.12);
for (const sx of [-0.062, 0.062]) part(new THREE.BoxGeometry(0.006, 0.02, 0.42), glow, sx, 0.02, -0.05);
part(new THREE.BoxGeometry(0.03, 0.03, 0.03), glow, 0, 0.1, -0.25);
part(new THREE.BoxGeometry(0.05, 0.05, 0.1), dark, 0, 0.1, 0.05);

gun.position.copy(GUN_POS);
gun.scale.setScalar(0.62);
gunCam.add(gun);

// Muzzle flash: a sprite on the rifle plus two lights, one for the rifle scene and one for the world.
const flash = new THREE.Mesh(
  new THREE.PlaneGeometry(0.35, 0.35),
  new THREE.MeshBasicMaterial({
    color: 0xffc070,
    map: dotTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
flash.position.set(0, 0.02, -0.72);
gun.add(flash);
const flashLight = new THREE.PointLight(COLORS.flash, 0, 12);
flashLight.position.set(0, 0, -0.8);
gun.add(flashLight);
const worldFlash = new THREE.PointLight(COLORS.flash, 0, 14);
camera.add(worldFlash);

export function muzzleFlash() {
  flash.material.opacity = 1;
  flash.rotation.z = rand(0, 6);
  flashLight.intensity = 3;
  worldFlash.intensity = 3;
}

/** Fade the flash a little every frame. */
export function decayFlash() {
  flash.material.opacity *= 0.55;
  flashLight.intensity *= 0.5;
  worldFlash.intensity *= 0.5;
}

/** Walk bob, and lower the rifle while sprinting. */
export function swayGun(bob, sprinting) {
  gun.position.x = GUN_POS.x + Math.sin(bob) * 0.012;
  gun.position.y = GUN_POS.y + Math.abs(Math.cos(bob)) * 0.012 - (sprinting ? 0.04 : 0);
}
