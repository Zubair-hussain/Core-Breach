# Architecture

Core Breach is plain ES modules with no bundler. three.js, GSAP and anime.js are loaded as classic scripts first and used as globals (`THREE`, `gsap`, `anime`); everything else is imported.

## A frame, step by step

`core/loop.js` runs once per animation frame:

1. Measure `dt`, capped at 50 ms so a background tab doesn't teleport everything on return.
2. If a run is active and not paused:
   - `player/movement.js` walks, sprints, jumps and applies gravity, then pushes the player out of walls.
   - The rifle sways, and fires when the mouse is held and the pointer is locked.
   - Wave logic spawns queued cores one at a time, then starts the next wave when the arena is clear.
   - `enemies/update.js` steers every living core, keeps them apart, and lets them ram or shoot.
   - `enemies/bolts.js` moves enemy bolts and checks hits against the player and walls.
   - `pickups/pickups.js` spins pickups and collects the ones you touch.
3. Otherwise, if no run has started, `fx/attract-camera.js` orbits the camera over the city for the menu.
4. Update particles and tracers.
5. `core/renderer.js` draws the world, clears the depth buffer, then draws the rifle on top.

## Why the rifle has its own scene

The rifle is drawn in a second scene with its own camera after the world. That way it can never poke into a wall when you stand close to one.

## Player rig

`yaw` (turn left and right) holds `pitch` (look up and down), which holds the camera. Keeping the two rotations on separate objects avoids the sideways roll you get from stacking them on one.

## Hits

Shooting is hitscan. `weapon/rifle.js` casts a ray from the camera with a little random spread (more while sprinting). The ray tests core bodies and wall meshes together, so a wall in front of a core blocks the shot. The yellow tracer is only a visual.

Cores check `world/line-of-sight.js` before firing, so they can't shoot you through buildings.

## The map

`utils/rng.js` is a seeded generator. `main.js` creates one and passes it to `world/city.js` and then `world/props.js`, so every player gets the identical city. A test locks the first value of seed 1337, so a refactor can't silently change the map.

## What's testable without a GPU

Anything that doesn't touch three.js is covered in `tests/`:

| Module                        | Why it's separate                          |
| ----------------------------- | ------------------------------------------ |
| `world/collision.js`          | Plain boxes and circles                    |
| `enemies/ai.js`               | Steering returns numbers, not meshes       |
| `enemies/types.js`            | Stats are data; geometry is created lazily |
| `game/waves.js`, `scoring.js` | Pure functions of the wave number          |
| `game/storage.js`             | Takes the storage object as an argument    |
| `game/state.js`, `config.js`  | Plain objects                              |

## Adding a new enemy

1. Add an entry to `TYPES` in `enemies/types.js`. Give it `ramDamage` to ram, or `boltDamage` plus `cooldown` to shoot.
2. Add its name to `composeWave` in `game/waves.js` where you want it to appear.
3. Add a swatch to the menu in `index.html` and `css/menu.css`.
4. `tests/types.test.js` will tell you if the stats are incomplete.

## Offline support

`sw.js` loads pages network first (so a new deploy shows immediately) and everything else cache first with a background refresh. It isn't registered on localhost, so a stale cache never hides your edits. Bump `VERSION` in `sw.js` to clear old caches.
