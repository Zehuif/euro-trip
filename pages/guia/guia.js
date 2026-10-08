// Guía: consejos para todo el viaje y, por ciudad, cómo moverse, zonas icónicas y consejos.
import { GEN, TIPS } from '../../js/data/tips.js';
import { $, cssCol } from '../../js/lib/dom.js';
import { renderCityTabs, selectCityTab, cityColor } from '../../components/city-tabs/city-tabs.js';

const list = items => `<ul>${items.map(x => `<li>${x}</li>`).join('')}</ul>`;

export function showTips(k){
  const t = TIPS[k], pn = $('tPanel');
  pn.style.setProperty('--c', cssCol(cityColor(k)));
  selectCityTab($('tTabs'), k);
  pn.innerHTML = `<div class="tcard"><h3>🚇 Moverse</h3>
      <table class="fares">${t.fares.map(f => `<tr><td>${f[0]}</td><td>${f[1]}</td></tr>`).join('')}</table>
      ${list(t.move)}</div>
    <div class="tcard"><h3>📍 Zonas icónicas</h3>${t.zones.map(z => `<div class="zone"><b>${z[0]}</b>${z[1]}</div>`).join('')}</div>
    <div class="tcard"><h3>💡 Consejos de guía</h3>${list(t.tips)}<div class="ojo"><b>Ojo:</b> ${t.ojo}</div></div>`;
}

export function initGuia(){
  $('tGen').innerHTML = '<h3 class="th">Para todo el viaje</h3>'
    + GEN.map(g => `<details><summary><span class="ic">${g[0]}</span>${g[1]}</summary><p>${g[2]}</p></details>`).join('');
  renderCityTabs($('tTabs'), Object.keys(TIPS), showTips);
  showTips('madrid');

  // Enlaces «Tips de <ciudad>» desde el itinerario y la portada (href="#tips" lleva a esta página)
  document.addEventListener('click', e => { const a = e.target.closest('a.eat[data-tip]'); if(a) showTips(a.dataset.tip); });
}
