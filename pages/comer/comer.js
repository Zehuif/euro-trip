// Dónde comer: pestañas por ciudad, filtros, platos típicos, tarjetas de restaurantes y su mapa.
import { EAT, DISHES, isTyp, FOOD_NAMES } from '../../js/data/restaurants.js';
import { $, cssCol, reduceMotion, whenVisible } from '../../js/lib/dom.js';
import { newMap, pin } from '../../js/lib/leaflet-map.js';
import { renderCityTabs, selectCityTab, cityColor } from '../../components/city-tabs/city-tabs.js';

const SWEET = /Pastelería|Heladería|Salón de té|Café|Postres|Panadería|Chocolatería/;
const norm = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const state = {city:'madrid', filter:'all', dish:null};
// El mapa se crea recién cuando la sección aparece en pantalla
let mapReady = false, map = null, layer = null, markers = [];

const FILTERS = {
  all: () => true,
  typ: r => isTyp(r),
  sweet: r => SWEET.test(r[1]),
  meal: r => !SWEET.test(r[1]),
  cheap: r => r[2] === '€'
};

function selectPlace(i){
  document.querySelectorAll('.rcard').forEach(c => c.classList.toggle('on', +c.dataset.i === i));
  markers.forEach((m, j) => m && m.setZIndexOffset(j === i ? 1000 : 0));
  if(map && markers[i]){ map.flyTo(markers[i].getLatLng(), Math.max(map.getZoom(), 15), {duration:reduceMotion ? 0 : .6}); markers[i].openTooltip(); }
}

const dishHTML = (k, dish) => {
  const dl = DISHES[k] || [];
  if(!dl.length) return '';
  return `<h3>Qué probar en ${FOOD_NAMES[k]}</h3><div class="chips2">${dl.map((d, j) => `<button type="button" data-d="${j}" aria-pressed="${j === state.dish}" title="${d[2]}">${d[0]}</button>`).join('')}</div>
    <p>${dish ? `<b>${dish[0]}:</b> ${dish[2]} Abajo aparecen los lugares donde lo sirven.` : 'Toquen un plato para ver qué es y dónde comerlo.'}</p>`;
};

const cardHTML = (k, r, i) => `<article class="rcard" data-i="${i}" tabindex="0">
    <span class="nb">${i + 1}</span>
    <h3>${r[0]}</h3>
    <div class="tags"><span class="pr">${r[2]}</span>${isTyp(r) ? '<span class="ty">Típico</span>' : ''}<span>${r[1]}</span><span>Cerca de: ${r[8]}</span></div>
    <p>${r[3]}</p>
    <div class="order">Pidan: <b>${r[4]}</b></div>
    <div class="addr">${r[5]}</div>
    <div class="acts"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r[0] + ', ' + r[5] + ', ' + FOOD_NAMES[k])}" target="_blank" rel="noopener">Cómo llegar ↗</a></div>
  </article>`;

function drawMap(k, col, ok, vis){
  if(!window.L || !mapReady) return;
  if(!map){ map = newMap($('cMap')); if(!map) return; layer = L.layerGroup().addTo(map); }
  map.invalidateSize(); layer.clearLayers();
  markers = EAT[k].map((r, i) => !ok(r) ? null : L.marker([r[6], r[7]], {icon:pin(String(i + 1), col), title:r[0]}).bindTooltip(r[0]).on('click', () => {
    selectPlace(i);
    const c = document.querySelector(`.rcard[data-i="${i}"]`); if(c) c.scrollIntoView({block:'nearest', behavior:reduceMotion ? 'auto' : 'smooth'});
  }).addTo(layer));
  const pts = (vis.length ? vis : EAT[k].map((r, i) => i)).map(i => [EAT[k][i][6], EAT[k][i][7]]);
  map.fitBounds(L.latLngBounds(pts).pad(.25), {maxZoom:15});
}

export function showCity(k){
  state.city = k;
  const col = cssCol(cityColor(k));
  $('cPanel').style.setProperty('--c', col);
  selectCityTab($('cTabs'), k, true);
  const dish = state.dish != null && DISHES[k] ? DISHES[k][state.dish] : null;
  const ok = r => FILTERS[state.filter](r) && (!dish || norm(r[4] + ' ' + r[3] + ' ' + r[0]).includes(norm(dish[1])));
  const cd = $('cDish');
  cd.style.setProperty('--c', col);
  cd.innerHTML = dishHTML(k, dish);
  const vis = EAT[k].map((r, i) => ok(r) ? i : -1).filter(i => i >= 0);
  $('cList').innerHTML = (vis.length ? '' : '<p class="cempty">No hay lugares con este filtro en esta ciudad.</p>')
    + EAT[k].map((r, i) => ok(r) ? cardHTML(k, r, i) : '').join('');
  drawMap(k, col, ok, vis);
}

export function initComer(){
  renderCityTabs($('cTabs'), Object.keys(EAT), k => { state.dish = null; showCity(k); }, k => EAT[k].length);

  $('cDish').addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    const j = +b.dataset.d; state.dish = state.dish === j ? null : j; showCity(state.city);
  });
  $('cFil').addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    state.filter = b.dataset.f;
    document.querySelectorAll('#cFil button').forEach(x => x.setAttribute('aria-pressed', x === b));
    showCity(state.city);
  });
  const list = $('cList');
  list.addEventListener('click', e => { if(e.target.closest('a')) return; const c = e.target.closest('.rcard'); if(c) selectPlace(+c.dataset.i); });
  list.addEventListener('keydown', e => { const c = e.target.closest('.rcard'); if(c && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); selectPlace(+c.dataset.i); } });

  // Enlaces «Dónde comer en <ciudad>» desde el itinerario y la portada (href="#comer" lleva a esta página)
  document.addEventListener('click', e => {
    const a = e.target.closest('a.eat[data-city]'); if(!a) return;
    mapReady = true; state.dish = null; showCity(a.dataset.city);
  });

  showCity(state.city);
  whenVisible($('comer'), () => { mapReady = true; showCity(state.city); });
}
