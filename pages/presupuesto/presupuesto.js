// Presupuesto estimado por etapa: traslados y entradas, comidas (promedio por país) y alojamiento al valor medio.
import { DAYS } from '../../js/data/days.js';
import { ST, FOOD } from '../../js/data/stages.js';
import { LODGING } from '../../js/data/lodging.js';
import { $ } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';

// {etapas: {1: {t, f, l, ppl, days, tot}, ...}, total}
export function computeBudget(){
  const B = {1:{t:0, f:0, l:0, ppl:6, days:0}, 2:{t:0, f:0, l:0, ppl:7, days:0}, 3:{t:0, f:0, l:0, ppl:4, days:0}};
  DAYS.forEach(d => { B[d.st].t += d.cost * d.ppl; B[d.st].f += FOOD[d.cc] * d.ppl; B[d.st].days++; });
  LODGING.forEach(l => { B[l[6]].l += l[2] * (l[4][0] + l[4][1]) / 2; });
  let total = 0;
  Object.values(B).forEach(b => { b.tot = b.t + b.f + b.l; total += b.tot; });
  return {stages:B, total};
}

export function initPresupuesto(){
  const {stages, total} = computeBudget();
  $('budget').innerHTML = [1, 2, 3].map(k => {
    const b = stages[k];
    return `<div class="bcard" style="--c:${ST[k].c}"><h3>${ST[k].name}: ${b.ppl} personas, ${b.days} días</h3><dl>
    <dt>Traslados y entradas</dt><dd>${eur(b.t)}</dd>
    <dt>Comidas</dt><dd>${eur(b.f)}</dd>
    <dt>Alojamiento</dt><dd>${eur(b.l)}</dd>
    <dt class="tot">Total del grupo</dt><dd class="tot">${eur(b.tot)}</dd>
    <dt>Por persona</dt><dd>${eur(b.tot / b.ppl)}</dd></dl></div>`;
  }).join('');
  $('grand').innerHTML = `<span>Total estimado del viaje en Europa</span><b>${eur(total)}</b><span>Comidas por persona al día: España €40, Francia €55, Suiza €75, Italia €45, Grecia y Portugal €35.</span>`;
}
