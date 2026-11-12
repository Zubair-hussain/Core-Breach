/**
 * Core Breach: a browser FPS.
 * three.js draws the world, GSAP moves the rifle and camera, anime.js animates the HUD.
 * Every model, texture and sound is generated in code. There are no asset files.
 */
import { MAP_SEED } from './config.js';
import { startLoop } from './core/loop.js';
import { enemies } from './enemies/spawn.js';
import { getBest, pause, start } from './game/flow.js';
import { state } from './game/state.js';
import { onKey } from './input/keyboard.js';
import './input/mouse.js';
import { onPointerUnlock } from './input/pointer-lock.js';
import { registerServiceWorker } from './pwa.js';
import { updateHud } from './ui/hud.js';
import { setBest } from './ui/menu.js';
import { animateTitle } from './ui/title.js';
import { $ } from './utils/dom.js';
import { createRng } from './utils/rng.js';
import { reload } from './weapon/rifle.js';
import { buildArena } from './world/arena.js';
import { buildCity } from './world/city.js';
import { buildDust } from './world/dust.js';
import { buildProps } from './world/props.js';

// One seed builds the whole map, so every player fights in the same city.
const rng = createRng(MAP_SEED);
buildArena();
buildCity(rng);
buildProps(rng);
buildDust();

onKey('KeyR', reload);
onPointerUnlock(() => {
  if (state.running && !state.over) pause(true);
});
$('play').addEventListener('click', start);
$('again').addEventListener('click', start);

setBest(getBest());
animateTitle();
updateHud();
startLoop();
registerServiceWorker();
document.body.classList.add('ready');

// Handy for debugging from the browser console.
window.__coreBreach = { state, enemies, start };
