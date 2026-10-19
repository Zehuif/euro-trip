// Presupuesto por etapa: lo reservado con su monto real (js/data/lodging.js y js/data/bookings.js)
// y lo estimado: traslados y entradas pendientes (cost de cada día) y comidas (promedio por país).
import { DAYS } from '../../js/data/days.js';
import { ST, FOOD } from '../../js/data/stages.js';
import { LODGING } from '../../js/data/lodging.js';
import { BOOKINGS, RATES_DATE, toEUR, money } from '../../js/data/bookings.js';
import { STAYS } from '../../js/lib/stays.js';
import { $ } from '../../js/lib/dom.js';
import { eur } from '../../js/lib/format.js';

// '13 ene' → número para ordenar por fecha (el viaje va de enero a febrero)
const dateKey = d => { const [n, m] = d.split(' '); return (m === 'feb' ? 100 : 0) + +n; };

// Todas las reservas en una lista, por fecha: alojamiento y trenes, vuelos y entradas
const reservations = () => [
  ...LODGING.map((l, i) => { const b = l[4];
    return {kind:'l', st:l[6], date:STAYS[i].checkIn.replace(/^\S+ /, ''), what:`${b.n}, ${l[0]} (${l[2]} ${l[2] === 1 ? 'noche' : 'noches'})`, sub:b.a, amt:b.amt, cur:b.cur, ppl:l[3], paid:b.paid, cancel:b.cancel, by:b.by}; }),
  ...BOOKINGS.map(b => ({kind:b.lodging ? 'l' : 't', ...b}))
].map(r => ({...r, eur:toEUR(r.amt, r.cur)}))
  .sort((a, b) => dateKey(a.date) - dateKey(b.date));

// {stages: {1: {l, t, est, f, ppl, days, tot}, ...}, total, paid, due}
export function computeBudget(){
  const B = {1:{l:0, t:0, est:0, f:0, ppl:6, days:0}, 2:{l:0, t:0, est:0, f:0, ppl:7, days:0}, 3:{l:0, t:0, est:0, f:0, ppl:4, days:0}};
  DAYS.forEach(d => { B[d.st].est += d.cost * d.ppl; B[d.st].f += FOOD[d.cc] * d.ppl; B[d.st].days++; });
  let paid = 0, due = 0;
  reservations().forEach(r => { B[r.st][r.kind] += r.eur; if(r.paid) paid += r.eur; else due += r.eur; });
  let total = 0;
  Object.values(B).forEach(b => { b.tot = b.l + b.t + b.est + b.f; total += b.tot; });
  return {stages:B, total, paid, due, booked:paid + due};
}

const status = r => r.paid ? '<span class="ps-badge yes">Pagado</span>'
  : `<span class="ps-badge no">Por pagar</span><small>Cancelación gratis hasta el ${r.cancel}</small>`;

export function initPresupuesto(){
  const {stages, total, paid, due, booked} = computeBudget();
  $('grand').innerHTML = `<div><span>Total del viaje en Europa</span><b>${eur(total)}</b></div>
    <div><span>Ya reservado</span><b>${eur(booked)}</b><small>Pagado ${eur(paid)} · por pagar ${eur(due)}</small></div>
    <div><span>Estimado, aún sin reservar</span><b>${eur(total - booked)}</b><small>Traslados, entradas y comidas</small></div>`;
  $('budget').innerHTML = [1, 2, 3].map(k => {
    const b = stages[k];
    return `<div class="bcard" style="--c:${ST[k].c}"><h3>${ST[k].name}: ${b.ppl} personas, ${b.days} días</h3><dl>
    <dt>Alojamiento <em>real</em></dt><dd>${eur(b.l)}</dd>
    <dt>Trenes, vuelos y entradas reservados <em>real</em></dt><dd>${eur(b.t)}</dd>
    <dt>Otros traslados y entradas <em>estimado</em></dt><dd>${eur(b.est)}</dd>
    <dt>Comidas <em>estimado</em></dt><dd>${eur(b.f)}</dd>
    <dt class="tot">Total del grupo</dt><dd class="tot">${eur(b.tot)}</dd>
    <dt>Por persona</dt><dd>${eur(b.tot / b.ppl)}</dd></dl></div>`;
  }).join('');

  const R = reservations();
  $('bkNote').innerHTML = `Montos en la moneda en que se pagaron y convertidos a euros con el cambio de ${RATES_DATE}. Comidas por persona al día: España €40, Francia €55, Suiza €75, Italia €45, Grecia y Portugal €35. Los cambios se ajustan en <code>js/data/bookings.js</code>.`;
  $('bkRows').innerHTML = R.map(r => `<tr style="--c:${ST[r.st].c}"><td class="nw"><span class="dot"></span>${r.date}</td>
    <td>${r.kind === 'l' ? '🛏️' : '🎫'} ${r.what}${r.sub ? `<small>${r.sub}</small>` : ''}</td><td class="num">${r.st}</td>
    <td class="num nw">${money(r.amt, r.cur)}</td><td class="num nw">${eur(r.eur)}</td><td class="num nw">${eur(r.eur / r.ppl)}<small>${r.ppl} ${r.ppl === 1 ? 'persona' : 'personas'}</small></td>
    <td>${status(r)}<small>${r.paid ? 'Pagó' : 'Reservó'} ${r.by}</small></td></tr>`).join('');
  $('bkFoot').innerHTML = `<tr><td colspan="4">Total reservado</td><td class="num nw">${eur(booked)}</td><td></td><td>Pagado ${eur(paid)} · por pagar ${eur(due)}</td></tr>`;
}
