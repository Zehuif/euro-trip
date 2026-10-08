// Mapa del viaje día por día: mapa SVG de Europa con la ruta (acerca con animación) y, opcional, mapa real (Leaflet).
import { DAYS } from '../../js/data/days.js';
import { ST } from '../../js/data/stages.js';
import { DSTOPS } from '../../js/data/day-stops.js';
import { PT, LL, NAMES, MAIN, DAY_ROUTES } from '../../js/data/geo.js';
import { $, cssCol, stripScroll, reduceMotion } from '../../js/lib/dom.js';
import { newMap, pin, arc } from '../../js/lib/leaflet-map.js';
import { fetchText } from '../../js/core/include.js';
import { go } from '../../js/core/router.js';
import { dayMaps, initMinis } from '../../components/mini-map/mini-map.js';

const FULL = [0, 0, 1000, 640];               // viewBox completo del mapa SVG
const LABEL_LEFT = new Set(['lisboa', 'toledo', 'pisa', 'lucerna', 'delfos']);  // nombres a la izquierda del punto

let cur = -1;                                  // día mostrado (-1 = todo el viaje)
let vb = FULL.slice(), anim = null;
let activeKeys = [], activeCol = 'var(--ink)';
let realOn = false, realMap = null, realLayer = null;

// ---------- Rutas en el SVG ----------
const segMode = (r, i) => Array.isArray(r.m) ? r.m[i] : r.m;
const segPath = (a, b, m) => {
  const [x1, y1] = PT[a], [x2, y2] = PT[b];
  if(m === 'f'){ const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); return `M${x1} ${y1}Q${mx + dy * .18} ${my - Math.abs(dx) * .18 - len * .05} ${x2} ${y2}`; }
  return `M${x1} ${y1}L${x2} ${y2}`;
};
const routePath = r => {
  if(r.p.length < 2) return '';
  let d = '';
  for(let i = 0; i < r.p.length - 1; i++){ const s = segPath(r.p[i], r.p[i + 1], r.m); d += i === 0 ? s : s.replace(/^M[^LQ]*/, ''); }
  return d;
};
const routeSvg = (r, col, dash) => {
  if(r.p.length < 2) return '';
  if(!Array.isArray(r.m)) return `<path d="${routePath(r)}" stroke="${col}"${r.m === 'f' ? ` stroke-dasharray="${dash}"` : ''}/>`;
  let o = '';
  for(let i = 0; i < r.p.length - 1; i++){ const m = segMode(r, i); o += `<path d="${segPath(r.p[i], r.p[i + 1], m)}" stroke="${col}"${m === 'f' ? ` stroke-dasharray="${dash}"` : ''}/>`; }
  return o;
};

// ---------- Cámara (viewBox animado) ----------
function setVB(t){
  cancelAnimationFrame(anim);
  const mapEl = $('map'), from = vb.slice(), t0 = performance.now(), dur = reduceMotion ? 0 : 700;
  const step = now => {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
    vb = from.map((v, j) => v + (t[j] - v) * e);
    mapEl.setAttribute('viewBox', vb.map(v => v.toFixed(1)).join(' '));
    drawDots();
    if(k < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}

// viewBox que encuadra las ciudades indicadas
function fit(keys){
  const xs = keys.map(k => PT[k][0]), ys = keys.map(k => PT[k][1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let w = Math.max(x1 - x0, 0) * 1.5 + 60, hh = Math.max(y1 - y0, 0) * 1.5 + 60;
  w = Math.max(w, 140); if(w / hh < 1000 / 640) w = hh * 1000 / 640; hh = w * 640 / 1000;
  w = Math.min(w, 1000); hh = Math.min(hh, 640);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return [Math.max(0, Math.min(1000 - w, cx - w / 2)), Math.max(0, Math.min(640 - hh, cy - hh / 2)), w, hh];
}

// Puntos y nombres de ciudades, con tamaño constante en pantalla aunque cambie el zoom
function drawDots(){
  const s = vb[2] / 1000, r = 5.5 * s, fs = 15 * s, sw = 4 * s;
  const show = new Set([...MAIN, ...activeKeys]);
  let out = '';
  Object.keys(PT).forEach(k => {
    const on = activeKeys.includes(k); if(!on && !show.has(k)) return;
    const [x, y] = PT[k], left = LABEL_LEFT.has(k);
    out += `<circle cx="${x}" cy="${y}" r="${on ? r * 1.4 : r}" fill="${on ? 'var(--surface)' : 'var(--muted)'}" stroke="${on ? activeCol : 'var(--surface)'}" stroke-width="${on ? sw * .8 : sw * .4}"/>`;
    out += `<text x="${x + (left ? -1 : 1) * r * 2}" y="${y + fs * .35}" font-size="${on ? fs * 1.15 : fs}" stroke-width="${sw}" text-anchor="${left ? 'end' : 'start'}" class="${on ? 'on' : ''}">${NAMES[k]}</text>`;
  });
  $('mDots').innerHTML = out;
}

// ---------- Mapa real ----------
function routeLayer(r, col, grp, dashOnly){
  const ks = r.p;
  for(let j = 0; j < ks.length - 1; j++){
    const a = LL[ks[j]], b = LL[ks[j + 1]], f = segMode(r, j) === 'f';
    L.polyline(f ? arc(a, b) : [a, b], {color:col, weight:dashOnly ? 3 : 5, opacity:dashOnly ? .6 : .9, dashArray:f ? '8 8' : null, lineCap:'round'}).addTo(grp);
  }
}

function updateRealMap(){
  if(!realOn) return;
  if(!realMap){ realMap = newMap($('lMain')); if(!realMap) return; realLayer = L.layerGroup().addTo(realMap); }
  realMap.invalidateSize(); realLayer.clearLayers();
  let keys;
  if(cur < 0){
    DAY_ROUTES.forEach((r, i) => routeLayer(r, cssCol(ST[DAYS[i].st].c), realLayer, true));
    keys = MAIN;
    MAIN.forEach(k => L.marker(LL[k], {icon:pin(NAMES[k], '#566275', false, true)}).addTo(realLayer));
  } else {
    const r = DAY_ROUTES[cur], col = cssCol(ST[DAYS[cur].st].c);
    routeLayer(r, col, realLayer, false);
    keys = [...new Set(r.p)];
    keys.forEach((k, j) => L.marker(LL[k], {icon:pin(NAMES[k], col, j > 0 && j < keys.length - 1, true)}).addTo(realLayer));
    (DSTOPS[cur] || []).forEach(cl => cl.s.forEach(p => { if(!p[3]) L.circleMarker([p[1], p[2]], {radius:5, color:'#fff', weight:2, fillColor:col, fillOpacity:1}).bindTooltip(p[0]).addTo(realLayer); }));
  }
  const pts = keys.map(k => LL[k]);
  if(cur >= 0 && keys.length === 1) (DSTOPS[cur] || []).forEach(cl => cl.s.forEach(p => pts.push([p[1], p[2]])));
  realMap.fitBounds(L.latLngBounds(pts).pad(.2), {maxZoom:14});
}

// ---------- Selección de día ----------
const markChip = i => document.querySelectorAll('#mChips button').forEach(b => b.setAttribute('aria-current', +b.dataset.i === i ? 'true' : 'false'));

// Muestra el día i en el mapa; con scroll = true además abre la página del mapa
export function showDay(i, scroll){
  cur = i;
  const d = DAYS[i], r = DAY_ROUTES[i], col = ST[d.st].c;
  activeKeys = [...new Set(r.p)]; activeCol = col;
  $('mAct').innerHTML = routeSvg(r, col, '10 10');
  setVB(fit(r.p.length > 1 ? r.p : [r.p[0]])); updateRealMap();

  const mode = Array.isArray(r.m) ? 'En avión y tren' : r.m === 'f' ? 'En avión' : r.m === 't' ? 'En tren' : 'Día en la ciudad';
  const path = r.p.length > 1 ? r.p.filter((k, j) => r.p.indexOf(k) === j || j === r.p.length - 1).map(k => NAMES[k]).join(' → ') : d.city;
  $('mTitle').textContent = `${d.wd} ${d.n} ${d.m}: ${path}`;
  $('mSub').textContent = `Día ${i + 1} de ${DAYS.length}. ${mode}. ${d.ppl} personas.`;

  const info = $('mInfo'); info.style.setProperty('--c', col);
  info.innerHTML = (d.move ? `<div class="mv"><strong>${d.move.t}.</strong> ${d.move.op}; ${d.move.dur}; ${d.move.pr}.</div>` : '')
    + `<div class="hl">Destinos del día:</div><div class="minis">${dayMaps(i)}</div><a href="#d${i}">Ver el detalle del día</a>`;
  initMinis(info);

  markChip(i);
  const chip = document.querySelector(`#mChips button[data-i="${i}"]`); if(chip) stripScroll(chip);
  if(scroll) go('#/mapa');
}

function showAll(){
  cur = -1; activeKeys = []; $('mAct').innerHTML = '';
  setVB(FULL); updateRealMap();
  $('mTitle').textContent = 'Todo el viaje';
  $('mSub').textContent = '34 días, de Madrid a Madrid. Elijan un día para acercarse.';
  $('mInfo').innerHTML = '<div class="hl">Azul: grupo de 6. Verde: grupo de 7. Ámbar: grupo de 4.</div>';
  markChip(-1);
}

// Contornos de los países (archivo aparte por su tamaño)
async function loadLand(){
  try{
    const svg = new DOMParser().parseFromString(await fetchText('assets/europe-land.svg'), 'image/svg+xml');
    $('mLand').append(...svg.documentElement.children);
  }catch(e){}
}

export function initMapa(){
  loadLand();
  $('mAllRoute').innerHTML = DAY_ROUTES.map((r, i) => routeSvg(r, ST[DAYS[i].st].c, '6 6')).join('');
  $('mChips').innerHTML = DAYS.map((d, i) => `<button type="button" data-i="${i}" style="--c:${ST[d.st].c}" aria-label="${d.wd} ${d.n} ${d.m}, ${d.city}">${d.n}<small>${d.m}</small></button>`).join('');

  $('mChips').addEventListener('click', e => { const b = e.target.closest('button'); if(b) showDay(+b.dataset.i); });
  $('mPrev').addEventListener('click', () => showDay(cur <= 0 ? DAYS.length - 1 : cur - 1));
  $('mNext').addEventListener('click', () => showDay(cur >= DAYS.length - 1 ? 0 : cur + 1));
  $('mAll').addEventListener('click', showAll);
  $('mG').addEventListener('click', e => {
    realOn = !realOn; e.currentTarget.setAttribute('aria-pressed', realOn);
    $('mapbox').classList.toggle('g', realOn); updateRealMap();
  });
  showAll();
}
