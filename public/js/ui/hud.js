import { PLAYER } from '../config.js';
import { state } from '../game/state.js';
import { $ } from '../utils/dom.js';

const LOW_HP = 35;
const LOW_AMMO = 5;

/** Write the current state into the HUD. Cheap enough to call after every change. */
export function updateHud() {
  $('score').textContent = state.score;
  $('kills').textContent = state.kills;
  $('wave').textContent = state.wave;

  const hp = Math.max(0, state.hp);
  $('hpText').textContent = Math.ceil(hp);
  const bar = $('hpBar');
  bar.style.width = (hp / PLAYER.maxHp) * 100 + '%';
  bar.classList.toggle('low', hp <= LOW_HP);

  $('mag').textContent = state.mag;
  $('mag').classList.toggle('low', state.mag <= LOW_AMMO);
  $('reserve').textContent = state.reserve;
}
