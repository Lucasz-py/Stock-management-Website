const CACHE_NAME = "abrazo-de-luz-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png",
  "/logoblanco.png",
  "/mandala.png",
];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cache abierto");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Error al cachear recursos:", error);
      })
  );
  self.skipWaiting();
});

// Activación - limpia cachés antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Eliminando caché antiguo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network First (para datos en tiempo real)
self.addEventListener("fetch", (event) => {
  // Ignorar requests que no sean GET
  if (event.request.method !== "GET") {
    return;
  }

  // Ignorar requests a Supabase (siempre deben ir a la red)
  if (event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red funciona, actualizar cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, intentar cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no hay cache, mostrar página offline
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
      })
  );
});
