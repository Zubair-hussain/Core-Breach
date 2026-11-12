import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collide, insideSolid } from '../public/js/world/collision.js';

const box = { minX: -1, maxX: 1, minZ: -1, maxZ: 1, h: 4 };
const list = [box];

test('insideSolid detects points inside a box', () => {
  assert.equal(insideSolid(0, 0, 0, 0, list), true);
  assert.equal(insideSolid(2, 0, 0, 0, list), false);
});

test('insideSolid lets bolts fly over low boxes', () => {
  assert.equal(insideSolid(0, 0, 5, 0, list), false);
});

test('insideSolid padding grows the box', () => {
  assert.equal(insideSolid(1.2, 0, 0, 0, list), false);
  assert.equal(insideSolid(1.2, 0, 0, 0.5, list), true);
});

test('collide pushes a circle out of a wall it touches', () => {
  const pos = { x: 1.3, z: 0 };
  collide(pos, 0.5, list);
  assert.ok(Math.abs(pos.x - 1.5) < 1e-9, `expected x = 1.5, got ${pos.x}`);
  assert.equal(pos.z, 0);
});

test('collide leaves a circle that is clear of every wall alone', () => {
  const pos = { x: 3, z: 3 };
  collide(pos, 0.5, list);
  assert.deepEqual(pos, { x: 3, z: 3 });
});

test('collide rescues a circle whose centre ended up inside a box', () => {
  const pos = { x: 0.9, z: 0 };
  // Centre inside: clamp point equals the centre, so the nearest face (+x) is used.
  collide(pos, 0.5, [{ ...box }]);
  assert.ok(pos.x >= 1.5 - 1e-9, `expected x >= 1.5, got ${pos.x}`);
});

test('collide lets the player slide along a wall', () => {
  const pos = { x: 1.3, z: 0.4 };
  collide(pos, 0.5, list);
  assert.ok(pos.x >= 1.5 - 1e-9);
  assert.equal(pos.z, 0.4);
});
