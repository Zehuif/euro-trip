// Navegación por hash: «#/mapa» abre una página; «#d5» o «#comer» abre la página que contiene ese elemento y baja hasta él.
import { pageById } from './pages.js';
import { invalidateAllMaps } from '../lib/leaflet-map.js';

let curPage = null;

export function go(hash){ if(location.hash === hash) route(); else location.hash = hash; }

function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  let page = 'inicio', target = null;
  if(h.startsWith('/')) page = h.slice(1) || 'inicio';
  else if(h){ const el = document.getElementById(h); const pg = el && el.closest('.page'); if(pg){ page = pg.dataset.page; target = el; } }
  if(!pageById(page)) page = 'inicio';
  const changed = page !== curPage; curPage = page;

  document.querySelectorAll('.page').forEach(p => p.hidden = p.dataset.page !== page);
  document.querySelectorAll('[data-p]').forEach(a => { if(a.dataset.p === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const more = document.getElementById('moreBtn');
  if(more && !pageById(page).tab) more.setAttribute('aria-current', 'page');
  document.title = (page === 'inicio' ? '' : pageById(page).title + ' · ') + 'Europa en familia 2027';
  const sheet = document.getElementById('moreSheet'); if(sheet && sheet.open) sheet.close();

  // Los mapas creados en una página oculta necesitan recalcular su tamaño al mostrarse
  setTimeout(invalidateAllMaps, 60);
  if(target && target.previousElementSibling) target.scrollIntoView();
  else if(changed || !target) window.scrollTo(0, 0);
}

export function startRouter(){
  addEventListener('hashchange', route);
  route();
}
