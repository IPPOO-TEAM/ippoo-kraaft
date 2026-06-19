// IPPOO KRAAFT — Service Worker
// Stratégie : stale-while-revalidate pour bundles JS/CSS et assets,
// network-first pour les documents HTML (fallback cache).

const CACHE = "ipk-admin-v1";
const STATIC_EXT = /\.(?:js|mjs|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|gif|ico)$/i;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok && response.type !== "opaque") {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function networkFirstDocument(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const fallback = await cache.match("/");
    return fallback || new Response("Hors-ligne", { status: 503, statusText: "Offline" });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(networkFirstDocument(req));
    return;
  }
  if (STATIC_EXT.test(url.pathname) || ["script", "style", "font", "image"].includes(req.destination)) {
    event.respondWith(staleWhileRevalidate(req));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
