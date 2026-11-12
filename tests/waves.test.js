import assert from 'node:assert/strict';
import { test } from 'node:test';
import { composeWave, waveSize } from '../public/js/game/waves.js';
import { TYPE_NAMES } from '../public/js/enemies/types.js';

test('each wave adds two cores', () => {
  assert.equal(waveSize(1), 5);
  assert.equal(waveSize(2), 7);
  assert.equal(waveSize(10), 23);
});

test('wave 1 never contains tanks', () => {
  for (let i = 0; i < 200; i++) assert.ok(!composeWave(1).includes('crystal'));
});

test('later waves can contain every type', () => {
  const seen = new Set();
  for (let i = 0; i < 200; i++) composeWave(4).forEach((t) => seen.add(t));
  assert.deepEqual([...seen].sort(), [...TYPE_NAMES].sort());
});

test('composeWave uses the random source it is given', () => {
  assert.deepEqual(
    composeWave(1, () => 0.1),
    Array(5).fill('prism'),
  );
  assert.deepEqual(
    composeWave(3, () => 0.1),
    Array(9).fill('crystal'),
  );
  assert.deepEqual(
    composeWave(3, () => 0.9),
    Array(9).fill('knot'),
  );
});

test('every name in a wave is a real enemy type', () => {
  for (const name of composeWave(8)) assert.ok(TYPE_NAMES.includes(name), name);
});
