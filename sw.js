// Service Worker — caches app files for offline use
// When the app is "installed" or saved to home screen,
// this ensures it loads even without internet.

var CACHE_NAME = 'cecg-v1';
var FILES_TO_CACHE = [
    'index.html',
    'style.css',
    'js/event-bus.js',
    'js/tile-manager.js',
    'manifest.json'
];

// Install — cache all app files
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Activate — clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );
});

// Fetch — serve from cache first, fall back to network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
