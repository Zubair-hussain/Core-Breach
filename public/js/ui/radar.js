import { yaw } from '../core/player-rig.js';
import { enemies } from '../enemies/spawn.js';
import { toCss } from '../utils/color.js';
import { $ } from '../utils/dom.js';

const SIZE = 170;
const CENTER = SIZE / 2;
/** World metres shown from the centre to the edge of the radar. */
const RANGE = 30;

const ctx = $('radar').getContext('2d');

/** Sweep, rings, and a dot for every living core, rotated so up is where you face. */
export function drawRadar() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = 'rgba(25,227,255,.25)';
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, CENTER * 0.5, 0, Math.PI * 2);
  ctx.moveTo(0, CENTER);
  ctx.lineTo(SIZE, CENTER);
  ctx.moveTo(CENTER, 0);
  ctx.lineTo(CENTER, SIZE);
  ctx.stroke();

  const sweep = (performance.now() / 1000) % (Math.PI * 2);
  ctx.fillStyle = 'rgba(25,227,255,.18)';
  ctx.beginPath();
  ctx.moveTo(CENTER, CENTER);
  ctx.arc(CENTER, CENTER, CENTER, sweep, sweep + 0.5);
  ctx.fill();

  const cos = Math.cos(yaw.rotation.y);
  const sin = Math.sin(yaw.rotation.y);
  for (const e of enemies) {
    if (!e.alive) continue;
    const dx = e.g.position.x - yaw.position.x;
    const dz = e.g.position.z - yaw.position.z;
    let x = ((dx * cos - dz * sin) / RANGE) * CENTER;
    let y = ((dx * sin + dz * cos) / RANGE) * CENTER;
    const d = Math.hypot(x, y);
    if (d > CENTER - 6) {
      x *= (CENTER - 6) / d;
      y *= (CENTER - 6) / d;
    }
    ctx.fillStyle = toCss(e.T.color);
    ctx.beginPath();
    ctx.arc(CENTER + x, CENTER + y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(CENTER, CENTER - 7);
  ctx.lineTo(CENTER - 5, CENTER + 5);
  ctx.lineTo(CENTER + 5, CENTER + 5);
  ctx.fill();
}
