// Pestañas de ciudades con el color de su etapa (Dónde comer, Guía y Transporte).
import { ST } from '../../js/data/stages.js';
import { FOOD_NAMES, FOOD_ST } from '../../js/data/restaurants.js';
import { stripScroll } from '../../js/lib/dom.js';

// Color de etapa (var(--sN)) de una ciudad de la guía
export const cityColor = k => ST[FOOD_ST[k]].c;

// Dibuja las pestañas; count(k) opcional agrega un contador y label(k) cambia el nombre. onSelect(k) se llama al tocar una.
export function renderCityTabs(el, keys, onSelect, count, label = k => FOOD_NAMES[k]){
  el.innerHTML = keys.map(k => `<button type="button" role="tab" data-k="${k}" style="--c:${cityColor(k)}" aria-selected="false">${label(k)}${count ? `<small>${count(k)}</small>` : ''}</button>`).join('');
  el.addEventListener('click', e => { const b = e.target.closest('button'); if(b) onSelect(b.dataset.k); });
}

export function selectCityTab(el, k, scroll){
  el.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k));
  const sel = el.querySelector(`[data-k="${k}"]`);
  if(scroll && sel) stripScroll(sel);
}
