import assert from 'node:assert/strict';
import { test } from 'node:test';
import { separate, steer } from '../public/js/enemies/ai.js';
import { TYPES } from '../public/js/enemies/types.js';

const near = (a, b) => Math.abs(a - b) < 1e-9;

test('a prism heads straight for the player', () => {
  const { mx, mz, speed, dist } = steer(TYPES.prism, 10, 0, 1);
  assert.ok(near(mx, 1) && near(mz, 0));
  assert.equal(speed, TYPES.prism.speed);
  assert.equal(dist, 10);
});

test('a crystal stops inside its hold range and keeps shooting', () => {
  assert.equal(steer(TYPES.crystal, 5, 0, 1).speed, 0);
  assert.equal(steer(TYPES.crystal, 30, 0, 1).speed, TYPES.crystal.speed);
});

test('a knot circles the player when close', () => {
  const far = steer(TYPES.knot, 0, 40, 1);
  const close = steer(TYPES.knot, 0, 10, 1);
  assert.ok(near(far.mx, 0), 'far away it walks straight in');
  assert.ok(Math.abs(close.mx) > 0.9, 'up close it moves mostly sideways');
  assert.ok(near(Math.hypot(close.mx, close.mz), 1), 'direction stays normalised');
});

test('the knot side flag picks the circling direction', () => {
  const left = steer(TYPES.knot, 0, 10, 1);
  const right = steer(TYPES.knot, 0, 10, -1);
  assert.ok(Math.sign(left.mx) !== Math.sign(right.mx));
});

test('steer survives a core sitting exactly on the player', () => {
  const { mx, mz } = steer(TYPES.prism, 0, 0, 1);
  assert.ok(Number.isFinite(mx) && Number.isFinite(mz));
});

test('separate pushes overlapping cores apart', () => {
  const a = { x: 0, z: 0 };
  const b = { x: 1, z: 0 };
  separate(a, [a, b], 1.8);
  assert.ok(a.x < 0, `expected a to move left, got ${a.x}`);
});

test('separate ignores cores that are far enough apart', () => {
  const a = { x: 0, z: 0 };
  separate(a, [a, { x: 5, z: 0 }], 1.8);
  assert.deepEqual(a, { x: 0, z: 0 });
});
