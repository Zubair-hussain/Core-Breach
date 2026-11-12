/**
 * Offline support.
 * Pages: network first, so a new deploy shows up straight away; the cache is the fallback.
 * Everything else: cache first, refreshed in the background.
 * Bump VERSION to drop old caches.
 */
const VERSION = 'v1';
const CACHE = `core-breach-${VERSION}`;
const SHELL = [
  '/',
  '/index.html',
  '/lib/three.min.js',
  '/lib/gsap.min.js',
  '/lib/anime.min.js',
  '/js/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() => caches.match(request).then((hit) => hit || caches.match('/index.html')));
}

function staleWhileRevalidate(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((hit) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => hit);
      return hit || network;
    }),
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(request.mode === 'navigate' ? networkFirst(request) : staleWhileRevalidate(request));
});
