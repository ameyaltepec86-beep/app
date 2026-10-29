// Guarda la página para que funcione sin internet.
const CACHE = "comodidad-v5";
const FILES = ["/", "/index.html", "/styles.css", "/app.js", "/favicon.svg", "/site.webmanifest",
  "/img/hero.jpg", "/img/plantillas.jpg", "/img/rodillera.jpg", "/img/pulsera.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Primero la red (para ver siempre lo último); si no hay conexión, usa la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("/"))));
});
