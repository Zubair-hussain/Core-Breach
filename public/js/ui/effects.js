/** Short screen effects driven by anime.js. */

/** The X that flashes on the crosshair when a round lands. */
export function hitmark() {
  anime.remove('#hitmark');
  anime({ targets: '#hitmark', opacity: [1, 0], scale: [1.5, 1], duration: 260, easing: 'easeOutQuad' });
}

/** Red vignette when the player takes damage. */
export function hurtFx() {
  anime.remove('#dmg');
  anime({ targets: '#dmg', opacity: [0.85, 0], duration: 600, easing: 'easeOutQuad' });
}

/** Blinking "RELOADING" under the ammo counter. */
export function flashReloadText() {
  anime({ targets: '#reloadTxt', opacity: [0, 1, 0, 1, 0], duration: 1500, easing: 'linear' });
}
