/**
 * Times Tables Quest - Service Worker
 * 
 * Provides offline capability by caching all app assets.
 * Uses a cache-first strategy for static assets.
 */

const CACHE_NAME = 'times-tables-v1';

// Relative asset paths (will be prefixed with base path)
const ASSETS_TO_CACHE = [
  '',                     // app root
  'index.html',
  'manifest.json',
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'apple-touch-icon.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Derive base path from service worker scope
      const scopeUrl = new URL(self.registration.scope);
      const basePath = scopeUrl.pathname.replace(/\/$/, '');
      
      // Build full URLs with base path
      const urlsToCache = ASSETS_TO_CACHE.map((path) => {
        if (!path) {
          return basePath + '/';
        }
        return basePath + '/' + path;
      });
      
      return cache.addAll(urlsToCache);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-ok responses or opaque responses
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
