# Changelog

All notable changes to Core Breach. Format based on [Keep a Changelog](https://keepachangelog.com).

## [1.0.0] - 2026-11-12

First public release.

### Added

- First-person shooter with three enemy types (Crystal, Prism, Knot), endless waves and a best-score table
- Radar, kill feed, hit markers, damage vignette and score pop-ups
- Pickups: ammo boxes and health gems
- Fully synthesised sound, with no audio files
- Offline play through a service worker
- Unit tests for collision, AI steering, waves, scoring, storage and seeded map generation
- GitHub Actions: CI on Node 22 and 24, Netlify deploys with pull-request previews, tagged releases
- Security headers and a strict Content Security Policy

### Changed

- Renamed from Neon Strike: AI Arena to Core Breach
- Rebuilt as ES modules with a single `config.js` for tuning
- Best score now saves as `coreBreach.best`; a score from the old build is moved over automatically

[1.0.0]: https://github.com/Zubair-hussain/Core-Breach/releases/tag/v1.0.0
