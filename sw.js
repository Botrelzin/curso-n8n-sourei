const CACHE = 'sourei-n8n-afcd28191eb9';
const ASSETS = [
  "./",
  "./index.html",
  "./src/app.js",
  "./src/course.js",
  "./src/styles.css",
  "./data/workflow-inventory.safe.json",
  "./data/workflow-examples.safe.json",
  "./manifest.webmanifest",
  "./public/icon.svg"
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
