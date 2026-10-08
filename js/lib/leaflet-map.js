// Mapas reales con Leaflet (window.L, cargado en index.html). Mapas base gratuitos y sin clave:
// si uno falla, se pasa al siguiente.
// Opcional: con una clave gratuita de MapTiler (cloud.maptiler.com) pegada aquí, se usa ese mapa primero.
const MAPTILER_KEY = '';

export const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
export const ESRI_REF = ESRI.replace('services/', 'services/Reference/');

const BASES = [
  ...(MAPTILER_KEY ? [{n:'Calles (MapTiler)', u:`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, a:'&copy; MapTiler &copy; OpenStreetMap', o:{tileSize:512, zoomOffset:-1}}] : []),
  {n:'Calles', u:ESRI + 'World_Street_Map/MapServer/tile/{z}/{y}/{x}', a:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap'},
  {n:'Calles (OpenStreetMap)', u:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', a:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'},
  {n:'Relieve', u:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', a:'&copy; OpenStreetMap, SRTM &copy; OpenTopoMap', o:{subdomains:'abc', maxZoom:17}}
];
const SAT = {n:'Satélite', u:ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', a:'Tiles &copy; Esri &mdash; Maxar, Earthstar Geographics'};

// URLs de los mosaicos que usa la vista satélite con nombres (para guardarlos sin internet)
export const satelliteTileURLs = (z, x, y) => [
  `${ESRI}World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  `${ESRI_REF}World_Transportation/MapServer/tile/${z}/${y}/${x}`,
  `${ESRI_REF}World_Boundaries_and_Places/MapServer/tile/${z}/${y}/${x}`
];

const mkLayer = b => L.tileLayer(b.u, Object.assign({attribution:b.a, maxZoom:19}, b.o || {}));
const LABELS = () => L.layerGroup([
  L.tileLayer(ESRI_REF + 'World_Transportation/MapServer/tile/{z}/{y}/{x}', {maxZoom:19}),
  L.tileLayer(ESRI_REF + 'World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {maxZoom:19})]);

const ALLMAPS = [];
export const invalidateAllMaps = () => ALLMAPS.forEach(m => { try { m.invalidateSize(); } catch(e){} });

// Crea un mapa en el elemento. Satélite por defecto; streets = true para empezar con calles.
export function newMap(el, streets){
  if(!window.L){ el.innerHTML = '<p style="padding:14px">No se pudo cargar el mapa. Revisen la conexión a internet.</p>'; return null; }
  const m = L.map(el, {scrollWheelZoom:false}); ALLMAPS.push(m);
  const ORDER = streets ? [...BASES, SAT] : [SAT, ...BASES];
  let idx = 0, errs = 0, cur = mkLayer(ORDER[0]).addTo(m);
  const labels = LABELS(); if(!streets) labels.addTo(m);
  const watch = layer => layer.on('tileerror', () => {
    if(++errs < 4 || idx >= ORDER.length - 1) return;
    m.removeLayer(cur); idx++; errs = 0; cur = mkLayer(ORDER[idx]).addTo(m); watch(cur);
  });
  watch(cur);
  const base = {[ORDER[0].n]:cur}; ORDER.slice(1).forEach(b => base[b.n] = mkLayer(b));
  L.control.layers(base, {'Nombres y calles':labels}, {position:'topright'}).addTo(m);
  return m;
}

// Marcador circular con texto (número o nombre de ciudad)
export const pin = (txt, col, hollow, big) => L.divIcon({className:'', html:`<span class="pin${hollow ? ' o' : ''}${big ? ' big' : ''}" style="--c:${col}">${txt}</span>`, iconSize:null, iconAnchor:big ? [0, 13] : [13, 13]});

// Curva entre dos puntos [lat, lng] para dibujar vuelos
export function arc(a, b){
  const out = [], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  const c = [mx + Math.hypot(dx, dy) * .18, my - dx * .18];
  for(let t = 0; t <= 1.001; t += .05) out.push([(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]);
  return out;
}
