import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from '../config.js';

function defaultStore() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // Some privacy modes throw on access.
    return null;
  }
}

/**
 * Read the best score. Moves a score saved by an older build to the current key.
 * @param {Storage|null} [store]
 */
export function loadBest(store = defaultStore()) {
  if (!store) return 0;
  try {
    let value = store.getItem(STORAGE_KEY);
    if (value === null) {
      for (const key of LEGACY_STORAGE_KEYS) {
        const old = store.getItem(key);
        if (old === null) continue;
        value = old;
        store.setItem(STORAGE_KEY, old);
        store.removeItem(key);
        break;
      }
    }
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

/** Save the best score. Returns false when storage is blocked. */
export function saveBest(score, store = defaultStore()) {
  if (!store) return false;
  try {
    store.setItem(STORAGE_KEY, String(Math.floor(score)));
    return true;
  } catch {
    return false;
  }
}
