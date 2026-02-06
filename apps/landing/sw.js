/**
 * Service Worker for SlideTheory
 * Provides caching, offline support, and performance optimization
 */

const CACHE_NAME = 'slidetheory-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/app-performance.js',
  '/styles.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Slide images - cache first, network fallback
  if (url.pathname.startsWith('/slides/')) {
    event.respondWith(cacheFirst(request, 24 * 60 * 60)); // 24 hour cache
    return;
  }
  
  // Static assets - stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Network first strategy - try network, fall back to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for API requests
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You are offline. Please check your connection.'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

/**
 * Cache first strategy - try cache, fall back to network
 */
async function cacheFirst(request, maxAge = 0) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh
    if (maxAge > 0) {
      const dateHeader = cachedResponse.headers.get('date');
      if (dateHeader) {
        const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
        if (age < maxAge) {
          return cachedResponse;
        }
      } else {
        return cachedResponse;
      }
    } else {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse; // Return stale cache if network fails
    }
    throw error;
  }
}

/**
 * Stale while revalidate strategy - serve cache, update in background
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('[SW] Network fetch failed:', error.message);
      return cachedResponse;
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    fetchPromise; // Trigger background update
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return fetchPromise;
}

/**
 * Background sync for offline slide generation
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'generate-slide') {
    event.waitUntil(syncGenerateSlide());
  }
});

async function syncGenerateSlide() {
  // Get queued requests from IndexedDB and retry
  console.log('[SW] Processing background sync for slide generation');
}

/**
 * Push notifications (future feature)
 */
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      badge: '/badge.png',
      data: data.url
    })
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
