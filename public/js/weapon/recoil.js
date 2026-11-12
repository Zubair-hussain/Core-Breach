import { PLAYER } from '../config.js';
import { pitch, yaw } from '../core/player-rig.js';
import { rand } from '../utils/math.js';
import { GUN_POS, gun } from './viewmodel.js';

const CLIMB = 0.012;
const JITTER = 0.004;

/** Each shot lifts the aim a little, nudges it sideways and kicks the rifle back. */
export function kick() {
  pitch.rotation.x = Math.min(PLAYER.maxPitch, pitch.rotation.x + CLIMB);
  yaw.rotation.y += rand(-JITTER, JITTER);
  gsap.fromTo(gun.position, { z: GUN_POS.z + 0.08 }, { z: GUN_POS.z, duration: 0.09, ease: 'power2.out' });
}
