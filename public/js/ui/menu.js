import { $ } from '../utils/dom.js';

/** Show or hide the main menu. While a run is paused the button reads RESUME. */
export function showMenu(paused) {
  $('menu').classList.toggle('hidden', !paused);
  $('play').textContent = paused ? 'RESUME' : 'PLAY';
}

export function showHud(visible) {
  $('hud').classList.toggle('hidden', !visible);
}

export function setBest(score) {
  $('best').textContent = score;
}

export function showGameOver({ score, wave, kills }) {
  $('finalScore').textContent = score;
  $('finalWave').textContent = wave;
  $('finalKills').textContent = kills;
  $('over').classList.remove('hidden');
  anime({ targets: '#over .box', scale: [0.8, 1], opacity: [0, 1], duration: 700, easing: 'easeOutBack' });
  $('again').focus();
}

export function hideGameOver() {
  $('over').classList.add('hidden');
}
