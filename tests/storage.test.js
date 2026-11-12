import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STORAGE_KEY } from '../public/js/config.js';
import { loadBest, saveBest } from '../public/js/game/storage.js';

function memoryStore(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    data,
  };
}

const blockedStore = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
};

test('loadBest returns 0 for a new player', () => {
  assert.equal(loadBest(memoryStore()), 0);
});

test('saveBest then loadBest round-trips the score', () => {
  const store = memoryStore();
  assert.equal(saveBest(4210, store), true);
  assert.equal(loadBest(store), 4210);
});

test('a best score from the old build is moved to the new key', () => {
  const store = memoryStore({ neonStrikeBest: '3150' });
  assert.equal(loadBest(store), 3150);
  assert.equal(store.data.get(STORAGE_KEY), '3150');
  assert.equal(store.data.has('neonStrikeBest'), false);
});

test('the new key wins over a leftover old key', () => {
  const store = memoryStore({ [STORAGE_KEY]: '900', neonStrikeBest: '100' });
  assert.equal(loadBest(store), 900);
});

test('junk values read as 0', () => {
  assert.equal(loadBest(memoryStore({ [STORAGE_KEY]: 'abc' })), 0);
  assert.equal(loadBest(memoryStore({ [STORAGE_KEY]: '-50' })), 0);
});

test('blocked storage never crashes the game', () => {
  assert.equal(loadBest(blockedStore), 0);
  assert.equal(saveBest(100, blockedStore), false);
  assert.equal(loadBest(null), 0);
  assert.equal(saveBest(100, null), false);
});
