const CACHE_NAME = "deadlands-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/script.js",
  "/powers.json",
  "/edges.json",
  "/hindrances.json",
  "/traits.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
