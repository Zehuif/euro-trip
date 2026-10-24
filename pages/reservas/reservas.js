// Reservas: entradas obligatorias, recomendadas, tabla de trenes y vuelos, y tabla de alojamiento.
import { DAYS } from '../../js/data/days.js';
import { ST } from '../../js/data/stages.js';
import { LODGING } from '../../js/data/lodging.js';
import { BUY, siteFor } from '../../js/data/tickets.js';
import { money } from '../../js/data/bookings.js';
import { STATIONS, stationURL } from '../../js/data/stations.js';
import { $, ext } from '../../js/lib/dom.js';
import { STAYS } from '../../js/lib/stays.js';

const shortName = n => n.replace(/ \(.*\)$/, '');

function renderTickets(){
  const must = [], recs = [];
  DAYS.forEach(d => d.items.forEach(it => {
    if(it[2] === 'o' || it[2] === 'c'){
      const [site, when] = siteFor(it[0]), done = it[2] === 'c';
      must.push(`<div class="mcard${done ? ' done' : ''}"><div class="when">${d.wd} ${d.n} ${d.m}, ${d.city} (${d.ppl} personas)</div><h3>${shortName(it[0])}</h3><div class="row"><span>${site.includes('.') ? ext(site + ' ↗', 'https://' + site, '') : site}</span><b>${it[1]}</b></div><div class="buy">${done ? '✓ Ya comprada' : `Comprar: ${when}`}</div></div>`);
    }
    if(it[2] === 'r') recs.push(`${shortName(it[0])} (${d.n} ${d.m})`);
  }));
  $('mustlist').innerHTML = must.join('');
  $('reclist').innerHTML = `<b>También conviene reservar</b>, aunque se puede comprar en el lugar: ${recs.join(', ')}.`;
}

const stationLink = k => ext(STATIONS[k][0] + ' ↗', stationURL(k), 'stn');
const viaHTML = mv => mv.via ? `<small class="via">Pasando por ${mv.via.map(stationLink).join(', ')}</small>` : '';

function renderMoves(){
  $('moves').innerHTML = DAYS.filter(d => d.move).map(d =>
    `<tr style="--c:${ST[d.st].c}"><td><span class="dot"></span>${d.wd} ${d.n} ${d.m}</td><td>${d.move.route}${viaHTML(d.move)}</td><td>${stationLink(d.move.from)}</td><td>${stationLink(d.move.to)}</td><td>${d.move.op}</td><td>${d.move.dur}</td><td>${d.move.pr}</td><td>${(BUY[d.move.route] || []).map(l => ext(l[0], l[1], '')).join('<br>') || '—'}</td></tr>`).join('');
}

function renderLodging(){
  $('lodging').innerHTML = LODGING.map((l, i) => { const b = l[4];
    return `<tr style="--c:${ST[l[6]].c}"><td><span class="dot"></span>${l[0]}</td><td class="stay">Entrada <b>${STAYS[i].checkIn}</b><br>Salida <b>${STAYS[i].checkOut}</b></td><td><b>${b.n}</b><br>${ext(b.a + ' ↗', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(b.a), 'stn')}<br><small>${l[1]} · ${b.via}</small></td><td class="num">${l[2]}</td><td class="num">${l[3]}</td><td class="num">${b.todo ? '~' : ''}${money(b.amt, b.cur)}</td><td>${b.todo ? '<span class="ps-badge tie">Por reservar</span>' : b.paid ? '<span class="ps-badge yes">Pagado</span>' : `<span class="ps-badge no">Por pagar</span><br><small>Cancelación gratis hasta el ${b.cancel}</small>`}</td><td>${l[5]}</td></tr>`; }).join('');
}

export function initReservas(){
  renderTickets();
  renderMoves();
  renderLodging();
}
