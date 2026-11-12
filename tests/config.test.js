import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ARENA,
  ENEMY,
  LEGACY_STORAGE_KEYS,
  PICKUPS,
  PLAYER,
  RIFLE,
  STORAGE_KEY,
  WAVES,
} from '../public/js/config.js';

test('sprinting is faster than walking', () => {
  assert.ok(PLAYER.sprintSpeed > PLAYER.walkSpeed);
});

test('the spawn ring fits inside the arena and can be far enough from the player', () => {
  const inner = ARENA * 0.55;
  const outer = ARENA - 4;
  assert.ok(outer > inner);
  assert.ok(ENEMY.minSpawnDistance < inner + outer, 'no spawn point could ever be far enough away');
});

test('the fire interval is longer than one frame at 120 Hz, so no shots are dropped', () => {
  assert.ok(RIFLE.fireInterval > 1 / 120);
});

test('aiming while sprinting is less accurate', () => {
  assert.ok(RIFLE.sprintSpread > RIFLE.spread);
});

test('pickup chances are probabilities', () => {
  for (const p of [PICKUPS.ammoChance, PICKUPS.healthChance]) assert.ok(p >= 0 && p <= 1);
});

test('waves get harder, not easier', () => {
  assert.ok(WAVES.perWave > 0 && WAVES.hpGrowth > 0 && WAVES.scoreGrowth > 0);
});

test('the storage key changed with the rename and the old one is migrated', () => {
  assert.equal(STORAGE_KEY, 'coreBreach.best');
  assert.ok(LEGACY_STORAGE_KEYS.includes('neonStrikeBest'));
});
