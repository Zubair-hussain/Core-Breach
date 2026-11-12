import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clamp, dist2d, rand } from '../public/js/utils/math.js';

test('rand stays inside its range', () => {
  for (let i = 0; i < 1000; i++) {
    const v = rand(-2, 5);
    assert.ok(v >= -2 && v < 5, `${v} out of range`);
  }
});

test('clamp limits values to the range', () => {
  assert.equal(clamp(5, 0, 1), 1);
  assert.equal(clamp(-5, 0, 1), 0);
  assert.equal(clamp(0.5, 0, 1), 0.5);
});

test('dist2d measures distance on the ground plane', () => {
  assert.equal(dist2d(0, 0, 3, 4), 5);
  assert.equal(dist2d(1, 1, 1, 1), 0);
});
