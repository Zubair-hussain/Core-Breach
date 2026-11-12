# Third-party libraries

These files are vendored so the game runs without a build step or a CDN. Each keeps its own license.

| File | Library | Version | License |
| --- | --- | --- | --- |
| `three.min.js` | [three.js](https://threejs.org) | r128 | MIT |
| `gsap.min.js` | [GSAP](https://gsap.com) | 3.12.5 | GSAP standard license (free) |
| `anime.min.js` | [anime.js](https://animejs.com) | 3.2.1 | MIT |

To upgrade one, replace the file, run `npm test` and `npm start`, and play a few waves before opening a pull request.
