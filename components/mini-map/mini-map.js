// Mapas de paradas de cada día. Primero se dibuja un esquema en SVG (sirve sin internet);
// cuando el mapa aparece en pantalla se reemplaza por un mapa real con los recorridos a pie.
import { DSTOPS } from '../../js/data/day-stops.js';
import { hav, legText, stopLabels, gmaps, WALK_KM } from '../../js/lib/geo.js';
import { fmtD, plural } from '../../js/lib/format.js';
import { cssCol, escapeAttr } from '../../js/lib/dom.js';
import { newMap, pin } from '../../js/lib/leaflet-map.js';
import { footRoute } from '../../js/services/routing.js';

const CLS = [];  // grupos de paradas ya dibujados; el índice va en data-cl

function drawCluster(el, cl, col){
  const m = newMap(el); if(!m) return;
  const s = cl.s, lab = stopLabels(s), pts = s.map(p => [p[1], p[2]]);
  for(let i = 1; i < s.length; i++){
    if(hav(s[i - 1], s[i]) > WALK_KM){ L.polyline([pts[i - 1], pts[i]], {color:col, weight:4, dashArray:'2 9', lineCap:'round'}).addTo(m); continue; }
    const line = L.polyline([pts[i - 1], pts[i]], {color:col, weight:5, opacity:.85}).addTo(m);
    footRoute(pts[i - 1], pts[i]).then(g => { if(g && g.length > 1) line.setLatLngs(g); });
  }
  s.forEach((p, i) => L.marker(pts[i], {icon:pin(lab[i], col, !!p[3]), title:p[0]}).bindTooltip(`${lab[i]}. ${p[0]}`).addTo(m));
  m.fitBounds(L.latLngBounds(pts).pad(.25), {maxZoom:15});
}

function initMini(el){
  if(el.dataset.done || !window.L) return; el.dataset.done = '1';
  const col = cssCol(getComputedStyle(el).getPropertyValue('--c'));
  el.innerHTML = ''; drawCluster(el, CLS[+el.dataset.cl], col);
}

const obs = ('IntersectionObserver' in window) ? new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting) return; obs.unobserve(e.target); initMini(e.target);
}), {rootMargin:'300px'}) : null;

// Activa los mapas reales dentro de root (llamar después de insertar el HTML de dayMaps)
export function initMinis(root){
  root.querySelectorAll('.lmini[data-cl]:not([data-done])').forEach(el => obs ? obs.observe(el) : initMini(el));
}

// Esquema SVG de las paradas, a escala, con barra de distancia y norte
function sketchSVG(cl){
  const s = cl.s, W = 420, H = 220, pad = 28;
  const lat0 = s.reduce((a, p) => a + p[1], 0) / s.length, k = Math.cos(lat0 * Math.PI / 180);
  const xs = s.map(p => p[2] * k), ys = s.map(p => -p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sc = Math.min((W - 2 * pad) / Math.max(x1 - x0, 1e-4), (H - 2 * pad - 16) / Math.max(y1 - y0, 1e-4));
  const ox = (W - (x1 - x0) * sc) / 2, oy = (H - 16 - (y1 - y0) * sc) / 2;
  const P = s.map((p, i) => [ox + (xs[i] - x0) * sc, oy + (ys[i] - y0) * sc]);
  // separar puntos que quedan encima
  for(let it = 0; it < 30; it++) for(let i = 0; i < P.length; i++) for(let j = i + 1; j < P.length; j++){
    const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], d = Math.hypot(dx, dy);
    if(d < 24){ const m = (24 - d) / 2, ux = d ? dx / d : 1, uy = d ? dy / d : 0; P[i][0] -= ux * m; P[i][1] -= uy * m; P[j][0] += ux * m; P[j][1] += uy * m; }
  }
  const kmPerPx = 111.32 / sc;
  const nice = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100];
  const sb = nice.find(n => n / kmPerPx >= 50) || 100, sbPx = sb / kmPerPx;
  const labels = stopLabels(s);
  let g = '';
  for(let i = 1; i < P.length; i++){
    const far = hav(s[i - 1], s[i]) > WALK_KM;
    g += `<line x1="${P[i - 1][0].toFixed(1)}" y1="${P[i - 1][1].toFixed(1)}" x2="${P[i][0].toFixed(1)}" y2="${P[i][1].toFixed(1)}" stroke="var(--c)" stroke-width="${far ? 3 : 5}" stroke-linecap="round" ${far ? 'stroke-dasharray="2 8"' : ''}/>`;
  }
  P.forEach((q, i) => {
    const t = s[i][3], fill = t ? 'var(--surface)' : 'var(--c)', txt = t ? 'var(--c)' : 'var(--surface)';
    g += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="12" fill="${fill}" stroke="var(--c)" stroke-width="3"/><text x="${q[0].toFixed(1)}" y="${(q[1] + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="${txt}">${labels[i]}</text>`;
  });
  g += `<g transform="translate(${(W - 14 - sbPx).toFixed(1)},${H - 10})"><rect width="${sbPx.toFixed(1)}" height="4" fill="var(--muted)"/><text x="${(sbPx / 2).toFixed(1)}" y="-6" text-anchor="middle" font-size="12" fill="var(--muted)">${fmtD(sb)}</text></g>`;
  g += `<g transform="translate(20,24)" fill="var(--muted)"><path d="M0 -13 L6 5 L0 1 L-6 5Z"/><text y="18" text-anchor="middle" font-size="11">N</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="minisvg" role="img" aria-label="Mapa de paradas en ${cl.c}">${g}</svg>`;
}

function miniMap(cl){
  const s = cl.s, labels = stopLabels(s);
  let tot = 0;
  const li = s.map((p, i) => {
    let d = 'Punto de partida';
    if(i){ const km = hav(s[i - 1], p); tot += km; d = legText(km); }
    const t = p[3];
    return `<li><span class="nb${t ? ' o' : ''}">${labels[i]}</span><span class="nm">${t ? p[0] : `<button type="button" class="pl" data-q="${escapeAttr(p[0])}" data-c="${cl.c}">${p[0]}</button>`}</span><span class="p">${d}</span></li>`;
  }).join('');
  return `<div class="mini"><div class="minihd"><b>${cl.c}</b><span>${plural(s.filter(p => !p[3]).length, ' parada', ' paradas')}, ${fmtD(tot)} en total</span></div>
   <div class="lmini" data-cl="${CLS.push(cl) - 1}">${sketchSVG(cl)}</div>
   <ol class="legend2">${li}</ol>
   <a class="gm" href="${gmaps(cl)}" target="_blank" rel="noopener">Abrir esta ruta en la app de Google Maps</a></div>`;
}

// HTML con los mapas de paradas del día i
export const dayMaps = i => (DSTOPS[i] || []).map(miniMap).join('');
