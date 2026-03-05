/* ===================================================
   MISide PWA — Service Worker
   Cache-first strategy for static assets
   =================================================== */

const CACHE = 'miside-v1';
const STATIC = [
    '/',
    '/index.html',
    '/personajes.html',
    '/lore.html',
    '/alpha.html',
    '/trailers.html',
    '/galeria.html',
    '/banda-sonora.html',
    '/mapa.html',
    '/404.html',
    '/terminos.html',
    '/manifest.json',
    '/css/style.css',
    '/css/mapa.css',
    '/css/404.css',
    '/css/pwa.css',
    '/js/script.js',
    '/js/mapa.js',
    '/js/404.js',
    '/js/pwa.js',
    '/favicon.png',
];

// Install — precache static assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
    );
});

// Activate — remove old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch — cache-first, network fallback
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    // Skip GLB files — always fetch fresh (too large to cache)
    if (e.request.url.includes('.glb')) return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(response => {
                const clone = response.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return response;
            });
        }).catch(() => caches.match('/index.html'))
    );
});


