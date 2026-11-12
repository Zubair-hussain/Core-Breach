import assert from 'node:assert/strict';
import { test } from 'node:test';
import { enemyHp, killScore } from '../public/js/game/scoring.js';

test('wave 1 uses base values', () => {
  assert.equal(enemyHp(100, 1), 100);
  assert.equal(killScore(150, 1), 150);
});

test('health grows 8% per wave', () => {
  assert.ok(Math.abs(enemyHp(100, 6) - 140) < 1e-9);
});

test('kill score grows 10% per wave and is a whole number', () => {
  assert.equal(killScore(80, 3), 96);
  assert.equal(killScore(45, 4), 59);
  assert.ok(Number.isInteger(killScore(77, 7)));
});

test('wave 0 is treated as wave 1', () => {
  assert.equal(enemyHp(100, 0), 100);
  assert.equal(killScore(100, 0), 100);
});
