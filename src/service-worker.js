const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    './static/*',
    'index.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .catch((error) => console.error('***', error))
    );
});

self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => fetch(event.request).then((response) => {
                    // Put a copy of the response in the runtime cache.
                    cache.put(event.request, response.clone()).then(() => response);
                }));
            })
        );
    }
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => cacheNames.filter((cacheName) => !currentCaches.includes(cacheName)))
            .then((cachesToDelete) => Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete))))
            .then(() => self.clients.claim())
    );
});
