import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TYPE_NAMES, TYPES } from '../public/js/enemies/types.js';

test('there are three core types', () => {
  assert.deepEqual(TYPE_NAMES, ['crystal', 'prism', 'knot']);
});

test('every type has the stats the game reads', () => {
  for (const [key, t] of Object.entries(TYPES)) {
    for (const field of ['name', 'color', 'hp', 'speed', 'score', 'size']) {
      assert.ok(t[field] !== undefined, `${key} is missing ${field}`);
    }
    assert.equal(typeof t.geo, 'function', `${key} needs a geometry factory`);
  }
});

test('each type attacks in exactly one way', () => {
  for (const [key, t] of Object.entries(TYPES)) {
    const shoots = Boolean(t.boltDamage);
    const rams = Boolean(t.ramDamage);
    assert.ok(shoots !== rams, `${key} must either shoot or ram`);
    if (shoots) {
      assert.ok(Array.isArray(t.cooldown) && t.cooldown.length === 2, `${key} needs a cooldown range`);
      assert.ok(t.boltSpeed > 0 && t.spread >= 0);
    }
  }
});

test('the roles stay distinct: tank is toughest, prism is fastest', () => {
  const byHp = [...TYPE_NAMES].sort((a, b) => TYPES[b].hp - TYPES[a].hp);
  const bySpeed = [...TYPE_NAMES].sort((a, b) => TYPES[b].speed - TYPES[a].speed);
  assert.equal(byHp[0], 'crystal');
  assert.equal(bySpeed[0], 'prism');
});
