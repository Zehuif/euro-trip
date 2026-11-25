// Resumen imprimible: se arma un documento compacto en #printView y se imprime solo eso (ver styles/print.css).
// Incluye solo las etapas elegidas en la ventana «Imprimir resumen» (components/print-dialog).
import { DAYS } from '../data/days.js';
import { LODGING } from '../data/lodging.js';
import { EAT, FOOD_NAMES, FOODCITY } from '../data/restaurants.js';
import { ST } from '../data/stages.js';
import { TIPS } from '../data/tips.js';
import { siteFor } from '../data/tickets.js';
import { STATIONS } from '../data/stations.js';
import { STAYS } from '../lib/stays.js';
import { avgTemp } from './weather.js';
import { escapeHTML as esc } from '../lib/dom.js';

const joinY = list => list.length > 1 ? list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1] : list.join('');

function buildPrint(stages){
  const on = new Set(stages), all = on.size === Object.keys(ST).length;
  const days = DAYS.filter(d => on.has(d.st));
  // Ciudades de la guía visitadas en las etapas elegidas (restaurantes y transporte)
  const cities = new Set(days.map(d => FOODCITY[d.city]).filter(Boolean));

  let h = `<h1>Europa en familia: 9 de enero al 10 de febrero de 2027${all ? '' : ` · ${stages.length > 1 ? 'Etapas' : 'Etapa'} ${joinY(stages.map(String))}`}</h1>`
    + `<div class="muted">${stages.map(k => `${ST[k].name}: ${ST[k].desc}`).join(' · ')}. Emergencias en todos los países: 112.</div>`;

  h += '<h2>Día a día</h2>';
  days.forEach(d => {
    const t = avgTemp(d);
    h += `<div class="pd"><b class="d">${d.wd} ${d.n} ${d.m}</b><b>${esc(d.city)}</b> · ${d.ppl} personas · ${t ? `${t[0]}°/${t[1]}°` : ''}`
      + (d.move ? `<div><b>${esc(d.move.t)}:</b> ${esc(d.move.op)}; ${esc(d.move.dur)}; ${esc(d.move.pr)}</div>` : '')
      + `<ul>${d.items.map(it => `<li>${it[2] === 'o' ? '★ ' : it[2] === 'c' ? '✓ ' : ''}${esc(it[0])} — ${esc(it[1])}</li>`).join('')}</ul><div>Dormir: ${esc(d.sleep)}</div></div>`;
  });

  h += '<div class="muted">★ = entrada que hay que comprar antes; ✓ = ya comprada.</div><h2>Entradas obligatorias</h2><table><tr><th>Fecha</th><th>Entrada</th><th>Dónde comprar</th><th>Precio</th></tr>';
  days.forEach(d => d.items.filter(it => it[2] === 'o' || it[2] === 'c').forEach(it => {
    h += `<tr><td>${d.n} ${d.m}</td><td>${esc(it[0].replace(/ \(.*\)$/, ''))}${it[2] === 'c' ? ' ✓' : ''}</td><td>${siteFor(it[0])[0]}</td><td>${esc(it[1])}</td></tr>`;
  }));

  h += '</table><h2>Trenes y vuelos</h2><table><tr><th>Fecha</th><th>Tramo</th><th>Sale de</th><th>Llega a</th><th>Operador</th><th>Duración</th><th>Precio</th></tr>';
  days.filter(d => d.move).forEach(d => { h += `<tr><td>${d.n} ${d.m}</td><td>${esc(d.move.route)}</td><td>${STATIONS[d.move.from][0]}</td><td>${STATIONS[d.move.to][0]}</td><td>${esc(d.move.op)}</td><td>${esc(d.move.dur)}</td><td>${esc(d.move.pr)}</td></tr>`; });

  h += '</table><h2>Dónde dormir</h2><table><tr><th>Ciudad</th><th>Entrada</th><th>Salida</th><th>Alojamiento</th><th>Noches</th><th>Personas</th></tr>';
  LODGING.forEach((l, i) => { if(!on.has(l[6])) return; h += `<tr><td>${l[0]}</td><td>${STAYS[i].checkIn}</td><td>${STAYS[i].checkOut}</td><td>${esc(l[4].n)}, ${esc(l[4].a)}</td><td>${l[2]}</td><td>${l[3]}</td></tr>`; });

  h += '</table><h2>Dónde comer</h2><div class="cols">';
  Object.keys(EAT).filter(k => cities.has(k)).forEach(k => { h += `<div><h3>${FOOD_NAMES[k]}</h3><ul>${EAT[k].map(r => `<li><b>${esc(r[0])}</b> (${r[2]}) — ${esc(r[5])}. Pidan: ${esc(r[4])}</li>`).join('')}</ul></div>`; });

  h += '</div><h2>Transporte público</h2><div class="cols">';
  Object.keys(TIPS).filter(k => cities.has(k)).forEach(k => { h += `<div><h3>${FOOD_NAMES[k]}</h3><ul>${TIPS[k].fares.map(f => `<li>${esc(f[0])}: <b>${esc(f[1])}</b></li>`).join('')}</ul></div>`; });

  h += '</div><div class="muted" style="margin-top:4mm">Precios referenciales de 2026. Confirmen en los sitios oficiales antes de comprar.</div>';
  return h;
}

// stages: etapas a incluir, por ejemplo [1, 2]
export function printSummary(stages = Object.keys(ST).map(Number)){
  let pv = document.getElementById('printView');
  if(!pv){ pv = document.createElement('div'); pv.id = 'printView'; document.body.appendChild(pv); }
  pv.innerHTML = buildPrint(stages);
  document.documentElement.classList.add('printmode');
  setTimeout(() => window.print(), 50);
}

addEventListener('afterprint', () => document.documentElement.classList.remove('printmode'));
