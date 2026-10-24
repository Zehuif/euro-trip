// Transporte: resumen de qué comprar en cada ciudad y, por ciudad, tarifas, líneas del itinerario, aeropuertos y plano del metro.
import { TRANSIT } from '../../js/data/transit.js';
import { TIPS } from '../../js/data/tips.js';
import { $, ext, cssCol } from '../../js/lib/dom.js';
import { renderCityTabs, selectCityTab, cityColor } from '../../components/city-tabs/city-tabs.js';

const KEYS = Object.keys(TRANSIT);

// Texto oscuro sobre colores claros (amarillos) y blanco sobre el resto
const ink = hex => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#172033' : '#fff'; };
const chip = (name, col) => `<span class="chip" style="--lc:${col};--lf:${ink(col)}">${name}</span>`;

// ¿Conviene el pase? Compara el pase más barato con la forma más barata de pagar sin pase (empate si la diferencia es de €1 o del 5% o menos)
const VERDICT = {yes:'Conviene', no:'No conviene', tie:'Casi empate', none:'No hace falta', inc:'Incluido'};
const badge = v => `<span class="ps-badge ${v === 'none' || v === 'inc' ? 'tie' : v}">${VERDICT[v]}</span>`;
const fmt = v => '€' + v.toLocaleString('es-CL', {minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2});

export function passVerdict(t){
  if(!t.pass) return {v:'inc'};
  const w = t.pass.ways, pass = w.filter(x => x[2]), other = w.filter(x => !x[2]);
  const best = other.reduce((a, x) => x[1] < a[1] ? x : a, other[0]);
  if(!pass.length) return {v:'none', best};
  const p = pass.reduce((a, x) => x[1] < a[1] ? x : a, pass[0]), diff = best[1] - p[1];
  return {v: Math.abs(diff) <= Math.max(1, p[1] * .05) ? 'tie' : diff > 0 ? 'yes' : 'no', best, p, diff};
}

function passHTML(t){
  const r = passVerdict(t);
  if(!t.pass) return `<div class="tcard"><h3>⚖️ ¿Conviene el pase?</h3>${badge('inc')}<p class="trbuy">El Swiss Travel Pass ya está calculado en la página <a href="#/pases">Pases</a>: conviene, porque cubre todos los trenes, barcos y buses de Suiza.</p></div>`;
  const n = t.pass.trips.reduce((a, x) => a + x[2], 0);
  const low = Math.min(...t.pass.ways.map(x => x[1]));
  return `<div class="tcard wide"><h3>⚖️ ¿Conviene el pase? ${badge(r.v)}</h3>
    <div class="trpass"><div><h4>Viajes del itinerario por persona: ${n}</h4>
      <ul class="trtrips">${t.pass.trips.map(x => `<li><span class="ps-tag">${x[0]}</span> ${x[1]}${x[2] > 1 ? ` <b>× ${x[2]}</b>` : ''}</li>`).join('')}</ul></div>
    <div><h4>Cuánto cuesta cada forma de pagarlos</h4>
      <table class="fares trways">${t.pass.ways.map(x => `<tr class="${x[1] === low ? 'low' : ''}"><td>${x[2] ? '🎟️ ' : ''}${x[0]}${x[1] === low ? ' <small>la más barata</small>' : ''}</td><td>${fmt(x[1])}</td></tr>`).join('')}</table>
      <p class="trverd">${r.v === 'none' ? `Con ${fmt(r.best[1])} por persona alcanza.` : r.v === 'yes' ? `El pase ahorra <b>${fmt(r.diff)}</b> por persona frente a ${r.best[0].charAt(0).toLowerCase() + r.best[0].slice(1)}.` : r.v === 'no' ? `Sin pase ahorran <b>${fmt(-r.diff)}</b> por persona: lo mejor es ${r.best[0].charAt(0).toLowerCase() + r.best[0].slice(1)}.` : `La diferencia es de ${fmt(Math.abs(r.diff))} por persona.`} ${t.pass.note}</p></div></div></div>`;
}

const commons = f => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f);

export function showTransit(k){
  const t = TRANSIT[k], pn = $('trPanel'), fares = (TIPS[k] || {}).fares || [];
  pn.style.setProperty('--c', cssCol(cityColor(k)));
  selectCityTab($('trTabs'), k);
  const map = t.map
    ? `<a class="trmap" href="${t.map.f}" target="_blank" rel="noopener"><img src="${t.map.f}" alt="Plano del metro de ${t.name}" loading="lazy"></a>
       <p class="trcredit">Plano de Wikimedia Commons (${t.map.date}): ${ext(t.map.src.replace(/_/g, ' '), commons(t.map.src), '')}, de ${t.map.by}, licencia ${t.map.lic}. Tóquenlo para verlo en grande. Para lo más reciente, el plano oficial:</p>`
    : '<p class="trcredit">Aquí no hace falta metro. Los planos y horarios oficiales:</p>';
  pn.innerHTML = `<div class="tcard"><h3>🎫 Qué comprar</h3><p class="trbuy">${t.buy}</p><p class="trcost">Gasto aproximado: <b>${t.cost}</b></p>
      ${fares.length ? `<table class="fares">${fares.map(f => `<tr><td>${f[0]}</td><td>${f[1]}</td></tr>`).join('')}</table>` : ''}</div>
    <div class="tcard"><h3>🚇 Líneas que van a usar</h3><ul class="trlines">${t.lines.map(l => `<li>${chip(l[0], l[1])}<span>${l[2]}</span></li>`).join('')}</ul></div>
    ${passHTML(t)}
    ${t.air.length ? `<div class="tcard"><h3>✈️ Aeropuerto en transporte público</h3>${t.air.map(a => `<div class="trair"><b>${a[0]}</b>${a[1]}</div>`).join('')}</div>` : ''}
    <div class="tcard${t.air.length ? '' : ' wide'}"><h3>🗺️ Plano</h3>${map}<div class="trlinks">${t.links.map(l => ext(l[0] + ' ↗', l[1], 'tk')).join('')}</div></div>`;
}

export function initTransporte(){
  $('trSum').innerHTML = KEYS.map(k => { const t = TRANSIT[k];
    return `<tr style="--c:${cityColor(k)}"><td><span class="dot"></span><a href="#transporte" data-tr="${k}">${t.name}</a></td><td>${t.short}</td><td>${t.cost}</td><td>${badge(passVerdict(t).v)}</td></tr>`; }).join('');
  renderCityTabs($('trTabs'), KEYS, showTransit, null, k => TRANSIT[k].name);
  showTransit('madrid');

  // Enlaces «Transporte en <ciudad>» desde el itinerario, la portada y el resumen
  document.addEventListener('click', e => { const a = e.target.closest('a[data-tr]'); if(a) showTransit(a.dataset.tr); });
}
