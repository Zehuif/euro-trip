// Barra superior: enlaces de escritorio y cuenta regresiva del viaje.
import { PAGES } from '../../js/core/pages.js';
import { DAYS } from '../../js/data/days.js';
import { NOW, FIRST, LAST, daysUntilStart, todayIndex } from '../../js/lib/dates.js';
import { $ } from '../../js/lib/dom.js';

export function initAppBar(){
  $('topNav').innerHTML = PAGES.filter(p => p.id !== 'inicio')
    .map(p => `<a href="#/${p.id}" data-p="${p.id}">${p.label}</a>`).join('');

  $('cdPill').textContent = NOW < FIRST ? `Faltan ${daysUntilStart()} días`
    : NOW > LAST ? 'Viaje terminado'
    : `Día ${todayIndex() + 1} de ${DAYS.length}`;
}
