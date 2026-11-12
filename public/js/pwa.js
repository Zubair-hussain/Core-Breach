/**
 * Register the service worker so the game loads offline after the first visit.
 * Skipped on localhost, so a stale cache never hides your latest edits while developing.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const { hostname, protocol } = window.location;
  if (protocol !== 'https:' || hostname === 'localhost' || hostname === '127.0.0.1') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is a bonus. The game works without it.
    });
  });
}
