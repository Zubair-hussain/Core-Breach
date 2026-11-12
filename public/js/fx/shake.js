import { camera } from '../core/scene.js';
import { rand } from '../utils/math.js';

/** Knock the camera off centre and let it spring back. power is in metres. */
export function shake(power) {
  gsap.fromTo(
    camera.position,
    { x: rand(-power, power), y: rand(-power, power) },
    { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1,0.4)' },
  );
}
