// Reservas: entradas obligatorias, recomendadas, tabla de trenes y vuelos, y tabla de alojamiento.
import { DAYS } from '../../js/data/days.js';
import { ST } from '../../js/data/stages.js';
import { LODGING } from '../../js/data/lodging.js';
import { BUY, siteFor } from '../../js/data/tickets.js';
import { $, ext } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';

const shortName = n => n.replace(/ \(.*\)$/, '');

function renderTickets(){
  const must = [], recs = [];
  DAYS.forEach(d => d.items.forEach(it => {
    if(it[2] === 'o'){
      const [site, when] = siteFor(it[0]);
      must.push(`<div class="mcard"><div class="when">${d.wd} ${d.n} ${d.m}, ${d.city} (${d.ppl} personas)</div><h3>${shortName(it[0])}</h3><div class="row"><span>${site.includes('.') ? ext(site + ' ↗', 'https://' + site, '') : site}</span><b>${it[1]}</b></div><div class="buy">Comprar: ${when}</div></div>`);
    }
    if(it[2] === 'r') recs.push(`${shortName(it[0])} (${d.n} ${d.m})`);
  }));
  $('mustlist').innerHTML = must.join('');
  $('reclist').innerHTML = `<b>También conviene reservar</b>, aunque se puede comprar en el lugar: ${recs.join(', ')}.`;
}

function renderMoves(){
  $('moves').innerHTML = DAYS.filter(d => d.move).map(d =>
    `<tr style="--c:${ST[d.st].c}"><td><span class="dot"></span>${d.wd} ${d.n} ${d.m}</td><td>${d.move.route}</td><td>${d.move.op}</td><td>${d.move.dur}</td><td>${d.move.pr}</td><td>${(BUY[d.move.route] || []).map(l => ext(l[0], l[1], '')).join('<br>') || '—'}</td></tr>`).join('');
}

function renderLodging(){
  $('lodging').innerHTML = LODGING.map(l =>
    `<tr style="--c:${ST[l[6]].c}"><td><span class="dot"></span>${l[0]}</td><td><b>${l[1]}</b></td><td class="num">${l[2]}</td><td class="num">${l[3]}</td><td class="num">${eur(l[4][0])}–${eur(l[4][1])}</td><td>${l[5]}</td></tr>`).join('');
}

export function initReservas(){
  renderTickets();
  renderMoves();
  renderLodging();
}
