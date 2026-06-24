// Service Worker for PWA

const CACHE_NAME = 'kuraline-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bir oyun eklendi!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'kuraline-notification',
    actions: [
      {
        action: 'explore',
        title: 'Oyunu Gör',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Kuralı Ne?', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

// Sync comments when back online
async function syncComments() {
  // Get pending comments from IndexedDB
  // Send them to server
  // This is a placeholder for actual implementation
  console.log('Syncing comments...');
}

// Periodic sync event (for updating content)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-games') {
    event.waitUntil(updateGames());
  }
});

async function updateGames() {
  // Fetch latest games from server
  // Update cache
  console.log('Updating games...');
}
