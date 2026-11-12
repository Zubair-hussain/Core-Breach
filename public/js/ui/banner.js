import { $ } from '../utils/dom.js';

/**
 * Big centred message, for example "WAVE 3".
 * @param {string} title
 * @param {string} [subtitle]
 */
export function banner(title, subtitle = '') {
  const el = $('banner');
  el.textContent = title;
  if (subtitle) {
    const small = document.createElement('small');
    small.textContent = subtitle;
    el.appendChild(small);
  }
  anime.remove(el);
  anime
    .timeline({ targets: el })
    .add({
      opacity: [0, 1],
      translateY: [30, 0],
      letterSpacing: ['24px', '8px'],
      duration: 600,
      easing: 'easeOutExpo',
    })
    .add({ opacity: 0, translateY: -20, duration: 500, easing: 'easeInQuad', delay: 1300 });
}
