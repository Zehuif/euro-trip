// Service worker: guarda la página y lo que se va viendo para usarlo sin internet.
const SHELL = 'europa27-shell-v1', RT = 'europa27-datos-v1';
const SHELL_URLS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/layers-2x.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.allSettled(SHELL_URLS.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== RT).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const FRESH = /api\.open-meteo\.com/;  // el clima: primero internet, si no hay, lo último guardado

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // La página: primero internet (para recibir cambios), si no hay, la copia guardada
  if (req.mode === 'navigate' || (url.origin === location.origin && /\.html?$|\/$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(SHELL).then(ca => ca.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  if (FRESH.test(url.host)) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(RT).then(ca => ca.put(req, c)); return r; })
      .catch(() => caches.match(req)));
    return;
  }
  // Todo lo demás (mapas, fotos, Wikipedia, rutas, fuentes): primero lo guardado
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(RT).then(ca => ca.put(req, c)); }
    return r;
  })));
});
