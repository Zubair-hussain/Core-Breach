import { $ } from '../utils/dom.js';

/** Floating text under the crosshair, such as "+150" or "+45 AMMO". */
export function pop(text) {
  const el = document.createElement('div');
  el.className = 'pop';
  el.textContent = text;
  $('pops').appendChild(el);
  anime({
    targets: el,
    translateY: [-10, -90],
    opacity: [1, 0],
    scale: [1.4, 1],
    duration: 900,
    easing: 'easeOutCubic',
    complete: () => el.remove(),
  });
}
