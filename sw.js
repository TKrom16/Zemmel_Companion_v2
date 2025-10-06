const CACHE_NAME = 'deadlands-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './powers.json',
  './edges.json',
  './hindrances.json',
  './traits.json',
  './icons/Logo.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(URLS_TO_CACHE);
        console.log('[SW] All resources cached');
      } catch (err) {
        console.warn('[SW] Some resources failed to cache:', err);
      }
      self.skipWaiting(); // Activate worker immediately
    })()
  );
});

// Activate event: take control of pages immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const clientsList = await clients.claim();
      console.log('[SW] Service Worker activated and controlling clients');
    })()
  );
});

// Fetch event: respond with cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(err => {
          console.warn('[SW] Fetch failed:', event.request.url, err);
          throw err;
        });
    })
  );
});
