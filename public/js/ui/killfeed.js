import { toCss } from '../utils/color.js';
import { $ } from '../utils/dom.js';

const MAX_ROWS = 5;

/** Add a row to the kill feed in the top right. Old rows fade out on their own. */
export function feed(text, color) {
  const list = $('feed');
  const row = document.createElement('div');
  row.className = 'kill';
  row.textContent = text;
  row.style.borderColor = toCss(color);
  list.prepend(row);
  anime({ targets: row, translateX: [80, 0], opacity: [0, 1], duration: 400, easing: 'easeOutExpo' });
  anime({
    targets: row,
    opacity: 0,
    delay: 2600,
    duration: 500,
    easing: 'linear',
    complete: () => row.remove(),
  });
  while (list.children.length > MAX_ROWS) list.lastChild.remove();
}
