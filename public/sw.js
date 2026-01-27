const CACHE_NAME = '120minut-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
];

// Установка Service Worker
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

// Активация Service Worker
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

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем запросы к API и внешним ресурсам
  if (
    url.origin !== location.origin ||
    url.pathname.startsWith('/backend/') ||
    url.hostname.includes('poehali.dev') ||
    url.hostname.includes('yandex') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Стратегия: Network First, потом Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Клонируем ответ для кэша
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Если сеть недоступна, возвращаем из кэша
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }

          // Если это HTML-страница, возвращаем главную из кэша
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }

          // Для других ресурсов возвращаем offline-заглушку
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Push-уведомления (опционально)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '120 МИНУТ';
  const options = {
    body: data.body || 'Новое уведомление',
    icon: 'https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/8251a8b2-9b61-4cee-9e68-aae6e7ec6e96.jpg',
    badge: 'https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/8251a8b2-9b61-4cee-9e68-aae6e7ec6e96.jpg',
    vibrate: [200, 100, 200],
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
