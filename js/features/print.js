// Resumen imprimible: se arma un documento compacto en #printView y se imprime solo eso (ver styles/print.css).
import { DAYS } from '../data/days.js';
import { LODGING } from '../data/lodging.js';
import { EAT, FOOD_NAMES } from '../data/restaurants.js';
import { TIPS } from '../data/tips.js';
import { siteFor } from '../data/tickets.js';
import { STATIONS } from '../data/stations.js';
import { STAYS } from '../lib/stays.js';
import { avgTemp } from './weather.js';
import { escapeHTML as esc } from '../lib/dom.js';

function buildPrint(){
  let h = `<h1>Europa en familia: 9 de enero al 10 de febrero de 2027</h1><div class="muted">Etapa 1: 6 personas (9–16 ene) · Etapa 2: 7 personas (16 ene–2 feb) · Etapa 3: 4 personas (2–10 feb). Emergencias en todos los países: 112.</div>`;

  h += '<h2>Día a día</h2>';
  DAYS.forEach(d => {
    const t = avgTemp(d);
    h += `<div class="pd"><b class="d">${d.wd} ${d.n} ${d.m}</b><b>${esc(d.city)}</b> · ${d.ppl} personas · ${t ? `${t[0]}°/${t[1]}°` : ''}`
      + (d.move ? `<div><b>${esc(d.move.t)}:</b> ${esc(d.move.op)}; ${esc(d.move.dur)}; ${esc(d.move.pr)}</div>` : '')
      + `<ul>${d.items.map(it => `<li>${it[2] === 'o' ? '★ ' : ''}${esc(it[0])} — ${esc(it[1])}</li>`).join('')}</ul><div>Dormir: ${esc(d.sleep)}</div></div>`;
  });

  h += '<div class="muted">★ = entrada que hay que comprar antes.</div><h2>Entradas obligatorias</h2><table><tr><th>Fecha</th><th>Entrada</th><th>Dónde comprar</th><th>Precio</th></tr>';
  DAYS.forEach(d => d.items.filter(it => it[2] === 'o').forEach(it => {
    h += `<tr><td>${d.n} ${d.m}</td><td>${esc(it[0].replace(/ \(.*\)$/, ''))}</td><td>${siteFor(it[0])[0]}</td><td>${esc(it[1])}</td></tr>`;
  }));

  h += '</table><h2>Trenes y vuelos</h2><table><tr><th>Fecha</th><th>Tramo</th><th>Sale de</th><th>Llega a</th><th>Operador</th><th>Duración</th><th>Precio</th></tr>';
  DAYS.filter(d => d.move).forEach(d => { h += `<tr><td>${d.n} ${d.m}</td><td>${esc(d.move.route)}</td><td>${STATIONS[d.move.from][0]}</td><td>${STATIONS[d.move.to][0]}</td><td>${esc(d.move.op)}</td><td>${esc(d.move.dur)}</td><td>${esc(d.move.pr)}</td></tr>`; });

  h += '</table><h2>Dónde dormir</h2><table><tr><th>Ciudad</th><th>Entrada</th><th>Salida</th><th>Zona</th><th>Noches</th><th>Personas</th></tr>';
  LODGING.forEach((l, i) => { h += `<tr><td>${l[0]}</td><td>${STAYS[i].checkIn}</td><td>${STAYS[i].checkOut}</td><td>${esc(l[1])}</td><td>${l[2]}</td><td>${l[3]}</td></tr>`; });

  h += '</table><h2>Dónde comer</h2><div class="cols">';
  Object.keys(EAT).forEach(k => { h += `<div><h3>${FOOD_NAMES[k]}</h3><ul>${EAT[k].map(r => `<li><b>${esc(r[0])}</b> (${r[2]}) — ${esc(r[5])}. Pidan: ${esc(r[4])}</li>`).join('')}</ul></div>`; });

  h += '</div><h2>Transporte público</h2><div class="cols">';
  Object.keys(TIPS).forEach(k => { h += `<div><h3>${FOOD_NAMES[k]}</h3><ul>${TIPS[k].fares.map(f => `<li>${esc(f[0])}: <b>${esc(f[1])}</b></li>`).join('')}</ul></div>`; });

  h += '</div><div class="muted" style="margin-top:4mm">Precios referenciales de 2026. Confirmen en los sitios oficiales antes de comprar.</div>';
  return h;
}

export function printSummary(){
  let pv = document.getElementById('printView');
  if(!pv){ pv = document.createElement('div'); pv.id = 'printView'; document.body.appendChild(pv); }
  pv.innerHTML = buildPrint();
  document.documentElement.classList.add('printmode');
  setTimeout(() => window.print(), 50);
}

addEventListener('afterprint', () => document.documentElement.classList.remove('printmode'));
