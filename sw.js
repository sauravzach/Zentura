const CACHE_NAME = 'zentura-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/admin.html',
    '/styles.css',
    '/data.js',
    '/app.js',
    '/config.js',
    '/admin.js',
    '/assets/zentura-logo.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Stale-while-revalidate for assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
