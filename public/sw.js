/**
 * Times Tables Quest - Service Worker
 * 
 * Provides offline capability by caching all app assets.
 * Strategy:
 * - Pre-cache static assets (HTML, icons, manifest)
 * - Runtime cache JS/CSS bundles on first load
 * - Cache-first for all assets (fast offline experience)
 */

const CACHE_NAME = 'times-tables-v2';

// Relative asset paths to pre-cache (will be prefixed with base path)
const ASSETS_TO_PRECACHE = [
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
      const urlsToCache = ASSETS_TO_PRECACHE.map((path) => {
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
          .filter((name) => name.startsWith('times-tables-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

/**
 * Check if request should be cached
 */
function shouldCache(request, response) {
  // Only cache successful GET requests
  if (request.method !== 'GET') return false;
  if (!response || response.status !== 200) return false;
  if (response.type === 'opaque') return false;
  
  // Cache JS, CSS, and assets
  const url = new URL(request.url);
  const isAsset = url.pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/);
  const isAppPage = url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  
  return isAsset || isAppPage;
}

// Fetch event - cache-first strategy with runtime caching
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Cache the response for future offline use
        if (shouldCache(event.request, response)) {
          const responseToCache = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache))
              .catch((error) => {
                // Ignore quota / cache errors but avoid unhandled rejections
                console.error('Service worker cache put failed:', error);
              })
          );
        }

        return response;
      }).catch(() => {
        // Network failed and no cache - return offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('index.html').then((offlinePage) => {
            if (offlinePage) {
              return offlinePage;
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
        }
        // For other requests, just fail
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
