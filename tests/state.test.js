import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PLAYER, RIFLE } from '../public/js/config.js';
import { resetState, state } from '../public/js/game/state.js';

test('a new run starts with full health and a full magazine', () => {
  resetState();
  assert.equal(state.hp, PLAYER.maxHp);
  assert.equal(state.mag, RIFLE.magSize);
  assert.equal(state.reserve, RIFLE.startReserve);
  assert.equal(state.score, 0);
  assert.equal(state.wave, 0);
});

test('resetState clears a finished run', () => {
  Object.assign(state, { hp: -4, score: 900, kills: 12, wave: 5, over: true, toSpawn: ['knot'] });
  resetState();
  assert.equal(state.over, false);
  assert.equal(state.kills, 0);
  assert.deepEqual(state.toSpawn, []);
});

test('resetState does not touch the running flag', () => {
  state.running = true;
  resetState();
  assert.equal(state.running, true);
  state.running = false;
});

test('each reset gets its own spawn queue', () => {
  resetState();
  const first = state.toSpawn;
  resetState();
  assert.notEqual(state.toSpawn, first);
});
