const CACHE_NAME = 'sabor-da-casa-v1';
const STATIC_ASSETS = [
  '/',
  '/cardapio',
  '/checkout',
  '/manifest.json',
];

// Instala o service worker e faz cache dos assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Limpa caches antigos
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
  self.clients.claim();
});

// Estratégia: Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requests que não são GET
  if (request.method !== 'GET') return;

  // Para imagens do Unsplash, usa Cache First
  if (url.hostname === 'images.unsplash.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // Retorna uma imagem placeholder se offline
            return new Response('', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // Para outros requests, Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clona a resposta para o cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
