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
    ${t.air.length ? `<div class="tcard"><h3>✈️ Aeropuerto en transporte público</h3>${t.air.map(a => `<div class="trair"><b>${a[0]}</b>${a[1]}</div>`).join('')}</div>` : ''}
    <div class="tcard${t.air.length ? '' : ' wide'}"><h3>🗺️ Plano</h3>${map}<div class="trlinks">${t.links.map(l => ext(l[0] + ' ↗', l[1], 'tk')).join('')}</div></div>`;
}

export function initTransporte(){
  $('trSum').innerHTML = KEYS.map(k => { const t = TRANSIT[k];
    return `<tr style="--c:${cityColor(k)}"><td><span class="dot"></span><a href="#transporte" data-tr="${k}">${t.name}</a></td><td>${t.short}</td><td>${t.cost}</td></tr>`; }).join('');
  renderCityTabs($('trTabs'), KEYS, showTransit, null, k => TRANSIT[k].name);
  showTransit('madrid');

  // Enlaces «Transporte en <ciudad>» desde el itinerario, la portada y el resumen
  document.addEventListener('click', e => { const a = e.target.closest('a[data-tr]'); if(a) showTransit(a.dataset.tr); });
}
