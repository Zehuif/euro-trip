// Piezas HTML de un día del itinerario, compartidas por la página Itinerario y la tarjeta «Hoy» de la portada.
import { TICKETS, NOMAP, BUY } from '../../js/data/tickets.js';
import { DSTOPS } from '../../js/data/day-stops.js';
import { ext, escapeAttr } from '../../js/lib/dom.js';
import { hav, gmaps } from '../../js/lib/geo.js';
import { fmtD } from '../../js/lib/format.js';

// Nombre del lugar: botón que abre la información de Wikipedia, más enlaces oficiales de entradas si los hay
export function placeHTML(name, city){
  const t = TICKETS.find(x => name.startsWith(x[0]));
  const nm = NOMAP.test(name) ? name : `<button type="button" class="pl" data-q="${escapeAttr(name)}" data-c="${city}">${name}</button>`;
  return nm + (t ? t[1].map(l => ext(l[0] + ' ↗', l[1], 'tk')).join('') : '');
}

export const buyHTML = mv => {
  const b = BUY[mv.route];
  return b ? `<div class="buylinks">Comprar pasajes: ${b.map(l => ext(l[0] + ' ↗', l[1], 'tk')).join('')}</div>` : '';
};

// Aviso del último día en una ciudad: del alojamiento a la estación o aeropuerto de salida (grupo dep de js/data/day-stops.js)
export function departHTML(i){
  const cl = (DSTOPS[i] || []).find(c => c.dep); if(!cl) return '';
  const s = cl.s, km = s.slice(1).reduce((a, p, j) => a + hav(s[j], p), 0);
  return `<div class="depart">🧳 <strong>Último día en ${cl.c}.</strong> Salgan del alojamiento hacia <b>${s[s.length - 1][0]}</b> (${fmtD(km)}). ${ext('Cómo llegar ↗', gmaps(cl), '')}</div>`;
}

// Traslado del día
export const moveHTML = mv => mv
  ? `<div class="move"><strong>${mv.t}</strong>${mv.d} <span>(${mv.dur}; ${mv.pr})</span>${buyHTML(mv)}</div>`
  : '';

const BADGE = {o:'<span class="badge o">Comprar antes</span>', r:'<span class="badge r">Mejor reservar</span>'};

// Lista de lugares del día con precio y marca de reserva
export const itemsHTML = d => `<ul class="items">${d.items.map(it =>
  `<li class="${it[2] || ''}"><span>${placeHTML(it[0], d.city)}${BADGE[it[2]] || ''}</span><span class="p">${it[1]}</span></li>`).join('')}</ul>`;
