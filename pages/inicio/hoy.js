// Tarjeta «Hoy»: el día actual del viaje (o el primero, antes de partir), con flechas para recorrer los días.
import { DAYS } from '../../js/data/days.js';
import { ST, CN } from '../../js/data/stages.js';
import { FOODCITY, FOOD_NAMES } from '../../js/data/restaurants.js';
import { $ } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';
import { NOW, FIRST, LAST, dayDate, daysUntilStart, todayIndex } from '../../js/lib/dates.js';
import { wxHTML } from '../../js/features/weather.js';
import { departHTML, moveHTML, itemsHTML } from '../../components/day-card/day-card.js';
import { showDay } from '../mapa/mapa.js';

let idx = todayIndex();

function dayLabel(d){
  const diff = Math.round((dayDate(d) - NOW) / 864e5);
  if(diff === 0) return 'Hoy';
  if(diff === 1) return 'Mañana';
  if(diff === -1) return 'Ayer';
  if(NOW < FIRST) return 'Primer día del viaje';
  if(NOW > LAST) return 'Viaje terminado';
  return diff > 0 ? `En ${diff} días` : `Hace ${-diff} días`;
}

function render(i){
  idx = i;
  const d = DAYS[i], st = ST[d.st], el = $('hoyCard'), next = DAYS[i + 1], fc = FOODCITY[d.city];
  el.style.setProperty('--c', st.c); el.style.setProperty('--soft', st.soft);
  el.innerHTML = `<div class="hoyhd"><div><div class="k">${dayLabel(d)} · Día ${i + 1} de ${DAYS.length}</div>
      <h2>${d.wd} ${d.n} ${d.m}: ${d.city}</h2>
      <div class="sub2">${d.ppl} personas · ${CN[d.cc]} · <span class="wx" data-wx="${i}">${wxHTML(i)}</span></div></div>
      <div class="hoynav"><button type="button" data-h="-1" aria-label="Día anterior">‹</button><button type="button" data-h="1" aria-label="Día siguiente">›</button></div></div>
    <div class="hoybody"><div>${departHTML(i)}${moveHTML(d.move)}
        ${itemsHTML(d)}<p class="tip">${d.tip}</p></div>
      <div class="hoyside">
        ${NOW < FIRST && i === 0 ? `<div class="hbox"><div class="count"><b>${daysUntilStart()}</b><span>días para el viaje</span></div></div>` : ''}
        <div class="hbox"><h4>🛏️ Dormir</h4>${d.sleep}</div>
        <div class="hbox"><h4>💶 Traslados y entradas</h4>~${eur(d.cost)} por persona</div>
        ${next ? `<div class="hbox"><h4>➡️ Mañana</h4>${next.wd} ${next.n} ${next.m}: <b>${next.city}</b>${next.move ? `<br>${next.move.t}` : ''}</div>` : ''}
      </div></div>
    <div class="hacts"><a href="#d${i}">Ver el día completo</a>${fc ? `<a class="eat" href="#comer" data-city="${fc}">Dónde comer</a><a class="eat" href="#tips" data-tip="${fc}">Tips de ${FOOD_NAMES[fc]}</a>` : ''}<a href="#mapa" data-mapday="${i}">Mapa del día</a></div>`;
}

export function initHoy(){
  $('hoyCard').addEventListener('click', e => {
    const b = e.target.closest('[data-h]'); if(b){ render(Math.min(DAYS.length - 1, Math.max(0, idx + +b.dataset.h))); return; }
    const m = e.target.closest('[data-mapday]'); if(m) showDay(+m.dataset.mapday);
  });
  document.addEventListener('weather:update', () => render(idx));
  render(idx);
}
