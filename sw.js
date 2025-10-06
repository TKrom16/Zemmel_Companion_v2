const CACHE_NAME = 'deadlands-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './powers.json',
  './edges.json',
  './hindrances.json',
  './traits.json',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://raw.githubusercontent.com/TKrom16/Zemmel_Companion_DL/refs/heads/main/Logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
