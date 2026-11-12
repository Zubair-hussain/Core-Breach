import { $ } from '../utils/dom.js';

/** Drop the menu title in letter by letter. */
export function animateTitle() {
  const title = $('title');
  const text = title.textContent;
  title.textContent = '';
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch === ' ' ? ' ' : ch;
    title.appendChild(span);
  }
  title.setAttribute('aria-label', text);
  anime({
    targets: '#title .ch',
    translateY: [-60, 0],
    opacity: [0, 1],
    rotateZ: [-20, 0],
    delay: anime.stagger(55),
    duration: 900,
    easing: 'easeOutElastic(1, .6)',
  });
}
