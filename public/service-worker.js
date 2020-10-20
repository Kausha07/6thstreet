const clearCache = () => (
    Promise.all([
        // clear all caches
        caches.keys().then((cacheNames) => (
            Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            )
        )),
        // clear indexed DB
        new Promise((resolve) => {
            if (!indexedDB) {
                resolve();
            }

            const request = indexedDB.deleteDatabase(self.CACHE_NAME);
            request.onerror = () => resolve();
            request.onsuccess = () => resolve();
        })
    ])
);

self.addEventListener('activate', (event) => { // clears all caches on re-deploy
    event.waitUntil(clearCache());
});

self.CACHE_NAME = 'app-runtime-static';