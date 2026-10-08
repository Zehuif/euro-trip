// Itinerario: tarjeta por día agrupada por etapa, con filtro por etapa y marca de «reservas listas» guardada en el dispositivo.
import { DAYS } from '../../js/data/days.js';
import { ST, CN } from '../../js/data/stages.js';
import { ILL, KEYS } from '../../js/data/illustrations.js';
import { FOODCITY, FOOD_NAMES } from '../../js/data/restaurants.js';
import { $ } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';
import { readJSON, writeJSON } from '../../js/lib/storage.js';
import { fetchCityPhotos } from '../../js/services/wikipedia.js';
import { moveHTML, itemsHTML } from '../../components/day-card/day-card.js';
import { dayMaps, initMinis } from '../../components/mini-map/mini-map.js';
import { showDay } from '../mapa/mapa.js';

const DONE_KEY = 'eurotrip2027-done';
const done = readJSON(DONE_KEY, {});

const stageHead = st => `<div class="stage-head" data-st="${st}" style="--c:${ST[st].c}"><h3>${ST[st].name}</h3><span>${ST[st].desc}</span></div>`;

const eatLinks = city => {
  const fc = FOODCITY[city]; if(!fc) return '';
  return `<a class="eat" href="#comer" data-city="${fc}">Dónde comer en ${FOOD_NAMES[fc]} →</a><a class="eat tip" href="#tips" data-tip="${fc}">Tips de ${FOOD_NAMES[fc]} →</a>`;
};

function dayHTML(d, i, pic){
  const s = ST[d.st], id = 'd' + i;
  return `<article class="day${done[id] ? ' done' : ''}" data-st="${d.st}" id="${id}" style="--c:${s.c};--soft:${s.soft}">${pic}
    <div class="date"><span class="wd">${d.wd}</span><span class="n">${d.n}</span><span class="m">${d.m}</span><span class="ppl">${d.ppl} personas</span></div>
    <div class="body">
      <div class="title"><h4>${d.city}</h4><span class="flag"><span class="wx" data-wx="${i}"></span> ${CN[d.cc]}</span></div>
      ${moveHTML(d.move)}
      ${itemsHTML(d)}
      <div class="minis">${dayMaps(i)}</div>
      <div class="meta"><span>Dormir en <b>${d.sleep}</b></span>${eatLinks(d.city)}<span>Traslados y entradas: <b>~${eur(d.cost)}</b> por persona</span></div>
      <p class="tip">${d.tip}</p>
      <button type="button" class="tomap" data-i="${i}">Ver ruta en el mapa</button>
      <label class="check"><input type="checkbox" data-id="${id}" ${done[id] ? 'checked' : ''}> Reservas de este día listas</label>
    </div></article>`;
}

function renderDays(el){
  let lastSt = 0, lastKey = '', html = '';
  DAYS.forEach((d, i) => {
    if(d.st !== lastSt){ html += stageHead(d.st); lastSt = d.st; }
    // Ilustración solo en el primer día de cada ciudad
    const key = KEYS[d.city];
    const pic = (key && key !== lastKey && ILL[key]) ? `<div class="illus" data-k="${key}">${ILL[key]}</div>` : '';
    lastKey = key || lastKey;
    html += dayHTML(d, i, pic);
  });
  el.innerHTML = html;
  initMinis(el);
}

// Reemplaza las ilustraciones por fotos reales cuando hay internet (si la foto falla, vuelve la ilustración)
async function loadPhotos(){
  let photos;
  try { photos = await fetchCityPhotos(); } catch(e){ return; }
  document.querySelectorAll('.illus[data-k]').forEach(el => {
    const pg = photos[el.dataset.k]; if(!pg) return;
    const svg = el.innerHTML, label = (/aria-label="([^"]+)"/.exec(svg) || [])[1] || pg.title;
    el.innerHTML = `<figure><img src="${pg.thumbnail.source}" alt="${label}" loading="lazy"><figcaption><b>${label}</b><a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(pg.pageimage)}" target="_blank" rel="noopener">Foto: Wikimedia Commons</a></figcaption></figure>`;
    el.querySelector('img').addEventListener('error', () => { el.innerHTML = svg; });
  });
}

function initFilters(el){
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    const f = b.dataset.f;
    el.querySelectorAll('[data-st]').forEach(x => { x.style.display = (f === 'all' || x.dataset.st === f) ? '' : 'none'; });
  }));
}

export function initItinerario(){
  const el = $('days');
  renderDays(el);
  loadPhotos();
  initFilters(el);

  el.addEventListener('change', e => {
    const id = e.target.dataset.id; if(!id) return;
    done[id] = e.target.checked; writeJSON(DONE_KEY, done);
    $(id).classList.toggle('done', e.target.checked);
  });
  el.addEventListener('click', e => { const b = e.target.closest('.tomap'); if(b) showDay(+b.dataset.i, true); });
}
