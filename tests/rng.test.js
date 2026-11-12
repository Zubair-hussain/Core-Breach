import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRng } from '../public/js/utils/rng.js';

test('the same seed gives the same sequence', () => {
  const a = createRng(1337);
  const b = createRng(1337);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
});

test('different seeds give different maps', () => {
  assert.notEqual(createRng(1)(), createRng(2)());
});

test('values stay between 0 and 1', () => {
  const rng = createRng(42);
  for (let i = 0; i < 10000; i++) {
    const v = rng();
    assert.ok(v > 0 && v < 1);
  }
});

test('the default map seed keeps its first value, so the city layout never changes by accident', () => {
  assert.equal(createRng(1337)(), (1337 * 16807) / 2147483647);
});

test('zero and negative seeds still produce a working generator', () => {
  for (const seed of [0, -5]) {
    const v = createRng(seed)();
    assert.ok(v > 0 && v < 1, `seed ${seed} gave ${v}`);
  }
});
