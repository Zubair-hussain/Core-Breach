# Contributing to Core Breach

Thanks for helping. This is a small project, so the process is short.

## Set up

```bash
git clone https://github.com/Zubair-hussain/Core-Breach.git
cd Core-Breach
npm install
npm start        # http://localhost:8080
```

You need Node.js 22 or newer.

## Before you open a pull request

```bash
npm run ci
```

That runs lint, the Prettier check, the unit tests and the asset check, the same steps CI runs. Run `npm run format` to fix formatting automatically.

Then play at least three waves with your change. Unit tests can't tell you whether something feels right.

## Ground rules

- **No asset files.** Models are built from three.js shapes and sounds are synthesised. This keeps the game tiny and copyright-free. If you need a new look or sound, generate it in code.
- **Tuning numbers live in `public/js/config.js`.** Don't hide magic numbers inside functions.
- **Keep logic testable.** Put maths and rules in files that don't import three.js (like `enemies/ai.js` or `game/waves.js`) and add a test for them in `tests/`.
- **One concern per pull request.** Small changes are reviewed faster.
- **No new dependencies** without a good reason. The game has no runtime dependencies and no build step, and that is a feature.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org): `feat(weapon): add shotgun`, `fix(audio): resume context after tab switch`, `docs: explain wave scaling`. Reference the issue when there is one: `fix: reload cancel bug (#14)`.

## Branches

`_Prod` is the production branch. Every push to it is deployed. Open pull requests against `_Prod` from a branch named after what it does (`feat/shotgun`, `fix/radar-rotation`).

## Reporting bugs

Use the [bug report form](https://github.com/Zubair-hussain/Core-Breach/issues/new/choose). Include your browser, your operating system, and any red errors from the console (F12).

## Questions and ideas

Start a thread in [Discussions](https://github.com/Zubair-hussain/Core-Breach/discussions).
