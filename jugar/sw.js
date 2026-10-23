// Generado por tools/build_site.py: juegos sin internet después de la primera visita.
const CACHE = 'caja-4421245507b2';
const FILES = ['./', 'manifest.webmanifest', 'pwa.js', '../js/guard.js', '../fonts/fonts.css', '../favicon.svg', '../icon-192.png', '../icon-512.png', '../fonts/bagel-fat-one-latin-1.woff2', '../fonts/bagel-fat-one-latin-ext-0.woff2', '../fonts/nunito-latin-3.woff2', '../fonts/nunito-latin-ext-2.woff2', '../fonts/press-start-2p-latin-5.woff2', '../fonts/press-start-2p-latin-ext-4.woff2'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/api/')) return;   // la API siempre va a la red
  if (req.mode === 'navigate') {   // la página: primero la red (para tener la última versión) y si no hay, la copia guardada
    e.respondWith(Promise.race([fetch(req), new Promise((_, no) => setTimeout(no, 4000))])
      .then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put('./', c)); return r; })
      .catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; })));
});
