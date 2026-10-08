// Inicio: tarjeta «Hoy», franja de la ruta y accesos a cada página.
// Los botones «Guardar sin internet» e «Imprimir» usan data-action (js/core/actions.js).
import { DAYS } from '../../js/data/days.js';
import { EAT } from '../../js/data/restaurants.js';
import { pageById, iconSVG } from '../../js/core/pages.js';
import { $ } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';
import { computeBudget } from '../presupuesto/presupuesto.js';
import { initHoy } from './hoy.js';
import { initRouteStrip } from './route-strip.js';

function renderTiles(){
  const nMust = DAYS.reduce((a, d) => a + d.items.filter(it => it[2] === 'o').length, 0);
  const nEat = Object.values(EAT).reduce((a, l) => a + l.length, 0);
  // [página, descripción, color]
  const T = [
    ['itinerario', `${DAYS.length} días, 14 ciudades`, 's1'],
    ['mapa', 'La ruta, día por día', 's1'],
    ['comer', `${nEat} lugares y platos típicos`, 's2'],
    ['guia', 'Transporte, barrios y consejos', 's2'],
    ['reservas', `${nMust} entradas obligatorias`, 's3'],
    ['presupuesto', `Total estimado ${eur(computeBudget().total)}`, 's3'],
    ['antes', 'Documentos, seguro, clima y maletas', 's1']
  ];
  $('tiles').innerHTML = T.map(([id, desc, c]) => { const p = pageById(id);
    return `<a class="tile" href="#/${id}" style="--c:var(--${c});--soft:var(--${c}-soft)"><span class="ti">${iconSVG(p.icon)}</span><b>${p.title}</b><small>${desc}</small></a>`;
  }).join('');
}

export function initInicio(){
  initHoy();
  initRouteStrip();
  renderTiles();
}
