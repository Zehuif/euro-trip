// Service worker: guarda la página y lo que se va viendo para usarlo sin internet.
// Los archivos propios (HTML, CSS, JS) van primero a internet, para recibir cambios; sin conexión se usa lo guardado.
// En la primera visita la página envía la lista de archivos que cargó (js/features/offline.js), así no hay que mantener una lista aquí.
const SHELL = 'europa27-shell-v2', RT = 'europa27-datos-v1';
const SHELL_URLS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers-2x.png'];

const cacheAll = urls => caches.open(SHELL).then(c => Promise.allSettled(urls.map(u => c.add(u))));

self.addEventListener('install', e => {
  e.waitUntil(cacheAll(SHELL_URLS).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== RT).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'precache' && Array.isArray(e.data.urls))
    e.waitUntil(cacheAll(e.data.urls.filter(u => new URL(u).origin === location.origin)));
});

const FRESH = /api\.open-meteo\.com/;  // el clima: primero internet, si no hay, lo último guardado

// Primero internet (y se guarda la respuesta); sin conexión, lo guardado
const networkFirst = (req, cacheName, key = req) => fetch(req).then(r => {
  if(r.ok){ const c = r.clone(); caches.open(cacheName).then(ca => ca.put(key, c)); }
  return r;
}).catch(() => caches.match(key));

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  if(req.mode === 'navigate'){ e.respondWith(networkFirst(req, SHELL, './index.html')); return; }
  if(url.origin === location.origin){ e.respondWith(networkFirst(req, SHELL)); return; }
  if(FRESH.test(url.host)){ e.respondWith(networkFirst(req, RT)); return; }

  // Todo lo demás (mapas, fotos, Wikipedia, rutas, fuentes): primero lo guardado
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if(r && (r.ok || r.type === 'opaque')){ const c = r.clone(); caches.open(RT).then(ca => ca.put(req, c)); }
    return r;
  })));
});
