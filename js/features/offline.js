// Modo sin internet: registra el service worker (sw.js) y descarga de una vez mapas, recorridos, fotos e información.
import { DSTOPS } from '../data/day-stops.js';
import { EAT } from '../data/restaurants.js';
import { $ } from '../lib/dom.js';
import { hav, WALK_KM, tilesFor, bboxOf } from '../lib/geo.js';
import { satelliteTileURLs } from '../lib/leaflet-map.js';
import { osrmURL } from '../services/routing.js';
import { wikiQ, wikiURL } from '../services/wikipedia.js';

const canSW = 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);
const fmtN = n => n.toLocaleString('es-CL');

function offlineURLs(){
  const tiles = new Set(), routes = new Set(), wiki = new Set();
  const addArea = (pts, z0, z1) => {
    const b = bboxOf(pts), span = Math.max(b[2] - b[0], b[3] - b[1]);
    const zz1 = span > .5 ? Math.min(z1, 11) : span > .15 ? Math.min(z1, 13) : z1;
    tilesFor(b, Math.min(z0, zz1), zz1).forEach(([z, x, y]) => satelliteTileURLs(z, x, y).forEach(u => tiles.add(u)));
  };
  DSTOPS.flat().forEach(cl => {
    addArea(cl.s.map(p => [p[1], p[2]]), 13, 15);
    for(let i = 1; i < cl.s.length; i++) if(hav(cl.s[i - 1], cl.s[i]) <= WALK_KM) routes.add(osrmURL([cl.s[i - 1][1], cl.s[i - 1][2]], [cl.s[i][1], cl.s[i][2]]));
  });
  Object.values(EAT).forEach(list => addArea(list.map(r => [r[6], r[7]]), 13, 15));
  document.querySelectorAll('button.pl').forEach(b => wiki.add(wikiQ(b.dataset.q)));
  return {tiles:[...tiles], routes:[...routes], wiki:[...wiki]};
}

// Ejecuta fn sobre cada elemento con `conc` tareas en paralelo; los errores se ignoran
async function runPool(items, fn, conc, onStep){
  let i = 0, done = 0;
  await Promise.all(Array.from({length:conc}, async () => {
    while(i < items.length){ const it = items[i++]; try { await fn(it); } catch(e){} onStep(++done); }
  }));
}

async function download(U, n, btn){
  btn.disabled = true; await navigator.serviceWorker.ready;
  const bar = $('offBar'), txt = $('offTxt'); let total = n, got = 0;
  const step = () => { got++; if(got % 10 === 0 || got === total){ bar.style.width = (got / total * 100).toFixed(1) + '%'; txt.textContent = `Guardando… ${fmtN(got)} de ${fmtN(total)}`; } };
  const thumbs = new Set();
  await runPool(U.wiki, async q => { const r = await fetch(wikiURL(q)); const j = await r.clone().json(); const pg = Object.values((j.query || {}).pages || {})[0]; if(pg && pg.thumbnail) thumbs.add(pg.thumbnail.source); }, 4, step);
  document.querySelectorAll('.illus img').forEach(im => thumbs.add(im.src));
  total += thumbs.size;
  await runPool([...thumbs], u => fetch(u, {mode:'no-cors'}), 6, step);
  await runPool(U.routes, u => fetch(u), 3, step);
  await runPool(U.tiles, u => fetch(u, {mode:'no-cors'}), 8, step);
  bar.style.width = '100%';
  txt.innerHTML = '✅ Listo. Este teléfono ya tiene el viaje guardado: funciona aunque no haya señal. Para que se vea como app, usen «Agregar a la pantalla de inicio» en el navegador.';
  try { if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
}

function renderBox(box){
  if(!canSW){
    box.innerHTML = `<b>Este modo funciona cuando la página está publicada en internet</b> (por ejemplo en Netlify o GitHub Pages), no al abrir el archivo directo desde el computador. Una vez publicada, abran el link en el teléfono y vuelvan a tocar este botón.`;
    return;
  }
  const U = offlineURLs(), n = U.tiles.length + U.routes.length + U.wiki.length, mb = Math.round(U.tiles.length * 0.012 + U.wiki.length * 0.12);
  box.innerHTML = `<b>Guardar el viaje en este teléfono</b><br>Se guardan los mapas de cada día y de restaurantes (vista satélite), los recorridos a pie, la información de cada lugar y sus fotos: unas ${fmtN(n)} descargas, cerca de ${mb} MB. Háganlo con Wi-Fi, una vez por teléfono, antes de viajar.
    <div class="bar"><i id="offBar"></i></div><div id="offTxt" class="netst">Listo para empezar.</div><button type="button" id="offGo">Descargar ahora</button>`;
  $('offGo').addEventListener('click', ev => download(U, n, ev.currentTarget));
}

// Muestra u oculta el cuadro de descarga (botón de la portada)
export function toggleOfflineBox(){
  const box = $('offBox');
  box.hidden = !box.hidden;
  if(!box.hidden) renderBox(box);
}

// Abre el cuadro de descarga y lo muestra en pantalla (desde el menú o el pie). Se llama después de ir a la portada.
export function revealOfflineBox(){
  const box = $('offBox');
  if(box.hidden) toggleOfflineBox();
  setTimeout(() => box.scrollIntoView({block:'center'}), 80);
}

export function initOffline(){
  const netSt = $('netSt');
  const paint = () => { netSt.textContent = navigator.onLine ? '' : '● Sin conexión: mostrando lo guardado en este teléfono'; };
  addEventListener('online', paint); addEventListener('offline', paint); paint();
  if(!canSW) return;
  const firstVisit = !navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(reg => {
      // En la primera visita los archivos se cargaron antes de que existiera el service worker: se le pide guardarlos
      if(!firstVisit || !reg.active) return;
      const urls = performance.getEntriesByType('resource').map(r => r.name).filter(u => u.startsWith(location.origin));
      reg.active.postMessage({type:'precache', urls});
    })
    .catch(() => {});
}
