/** Keys currently held down, by KeyboardEvent.code (KeyW, ShiftLeft, Space ...). */
export const keys = {};

const handlers = {};

/** Run fn once each time a key is pressed. */
export function onKey(code, fn) {
  handlers[code] = fn;
}

export const isSprinting = () => Boolean(keys.ShiftLeft || keys.ShiftRight);

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (!e.repeat && handlers[e.code]) handlers[e.code]();
  if (e.code === 'Space') e.preventDefault();
});
document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
// Release everything when the window loses focus, so the player doesn't keep running.
window.addEventListener('blur', () => {
  for (const code of Object.keys(keys)) keys[code] = false;
});
