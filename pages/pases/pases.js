// Pases turísticos: compara el precio de cada pase con lo que costaría pagar por separado lo que marcan.
import { PASSES } from '../../js/data/passes.js';
import { ST } from '../../js/data/stages.js';
import { $, ext, escapeAttr } from '../../js/lib/dom.js';
import { readJSON, writeJSON } from '../../js/lib/storage.js';

const KEY = 'eurotrip2027-pases';
let saved = readJSON(KEY, {});   // {id: {opt, ppl, on: {i: bool}, q: {i: n}}}

const money = (v, cur) => (cur === 'CHF' ? 'CHF ' : '€') +
  v.toLocaleString('es-CL', {minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2});

// Lo elegido para un pase, con los valores por defecto del itinerario
function pick(p){
  const s = saved[p.id] || {};
  return {
    opt: s.opt ?? p.def ?? 0,
    ppl: s.ppl ?? p.ppl,
    on: p.items.map((it, i) => s.on?.[i] ?? it.on ?? !!it.day),
    q: p.items.map((it, i) => s.q?.[i] ?? it.q ?? 1)
  };
}

// Por separado vs. pase. Si el pase cubre solo las primeras N entradas, se cuentan las más caras y el resto con descuento.
function calc(p){
  const c = pick(p), [label, price, free] = p.opts[c.opt];
  const chosen = p.items.map((it, i) => ({...it, v: it.p * c.q[i]})).filter((it, i) => c.on[i]);
  const entries = chosen.filter(it => it.m).sort((a, b) => b.v - a.v);
  const other = chosen.filter(it => !it.m).reduce((a, it) => a + it.v, 0);
  const ent = entries.reduce((a, it, k) => a + (free === undefined || k < free ? it.v : it.v * (p.rest || 0)), 0);
  const sep = other + ent, diff = sep - price;
  const tie = Math.abs(diff) <= Math.max(2, price * .05);
  return {c, label, price, sep, diff, verdict: tie ? 'tie' : diff > 0 ? 'yes' : 'no'};
}

const VERDICT = {yes: 'Conviene', no: 'No conviene', tie: 'Casi empate'};
const badge = v => `<span class="ps-badge ${v}">${VERDICT[v]}</span>`;
const signed = (v, cur) => (v > 0 ? '+' : v < 0 ? '−' : '') + money(Math.abs(v), cur);

function resultHTML(p){
  const r = calc(p), cur = p.cur;
  const group = r.diff * r.c.ppl;
  return `${badge(r.verdict)}
    <dl><dt>Por separado</dt><dd>${money(r.sep, cur)}</dd>
    <dt>${p.name} (${r.label})</dt><dd>${money(r.price, cur)}</dd>
    <dt class="tot">${r.diff >= 0 ? 'Ahorro' : 'Pierden'} por persona</dt><dd class="tot">${signed(r.diff, cur)}</dd>
    <dt>Para <input class="ppl" type="number" min="1" max="20" value="${r.c.ppl}" aria-label="Personas"> personas</dt><dd>${signed(group, cur)}</dd></dl>`;
}

function cardHTML(p){
  const c = pick(p);
  const opts = p.opts.map((o, k) => `<label class="ps-opt"><input type="radio" name="opt-${p.id}" value="${k}"${k === c.opt ? ' checked' : ''}>
    <span>${o[0]}<b>${money(o[1], p.cur)}</b></span></label>`).join('');
  const items = p.items.map((it, i) => `<li class="${it.day ? '' : 'new'}">
    <input class="chk" type="checkbox" data-i="${i}"${c.on[i] ? ' checked' : ''} aria-label="Incluir ${escapeAttr(it.n)}">
    <div class="nm"><button type="button" class="pl" data-q="${escapeAttr(it.n)}" data-c="${p.city}">${it.n}</button>
      <span class="ps-tag">${it.day || 'Idea nueva'}</span>${it.note ? `<small>${it.note}</small>` : ''}</div>
    <div class="pr">${money(it.p, p.cur)}${it.q ? ` × <input class="qty" type="number" min="0" max="30" data-i="${i}" value="${c.q[i]}" aria-label="Cantidad">` : ''}</div></li>`).join('');
  return `<article class="ps-card" id="ps-${p.id}" data-id="${p.id}" style="--c:${ST[p.st].c};--soft:${ST[p.st].soft}">
    <header><span class="ps-city">${p.city} · ${p.when}</span><h3>${p.name}</h3><p>${p.what}</p></header>
    <div class="ps-opts">${opts}</div>
    <ul class="ps-items">${items}</ul>
    <p class="ps-no"><b>No incluye:</b> ${p.no}</p>
    <div class="ps-res" id="psr-${p.id}">${resultHTML(p)}</div>
    <p class="ps-rec"><b>Nuestra recomendación:</b> ${p.rec}</p>
    <div class="ps-foot">${ext('Sitio oficial ↗', p.url, '')}<button type="button" class="ps-reset">Volver a lo del itinerario</button></div>
  </article>`;
}

function renderSummary(){
  const rows = PASSES.map(p => { const r = calc(p); return {p, r}; });
  $('psSum').innerHTML = rows.map(({p, r}) => `<tr style="--c:${ST[p.st].c}">
    <td><span class="dot"></span><button type="button" class="ps-go" data-go="${p.id}">${p.city}</button></td><td>${p.name}<small> · ${r.label}</small></td>
    <td class="num">${money(r.price, p.cur)}</td><td class="num">${money(r.sep, p.cur)}</td>
    <td class="num">${signed(r.diff, p.cur)}</td><td>${badge(r.verdict)}</td></tr>`).join('');
  const buy = rows.filter(x => x.r.verdict === 'yes').map(x => `${x.p.city} (${x.p.name}, ${x.r.label})`);
  $('psBuy').innerHTML = buy.length ? `<b>Con lo marcado, conviene comprar:</b> ${buy.join('; ')}.` : '<b>Con lo marcado, no conviene comprar ningún pase.</b>';
}

function save(id, fn){
  const p = PASSES.find(x => x.id === id), s = saved[id] = saved[id] || {};
  fn(s, p); writeJSON(KEY, saved);
  $('psr-' + id).innerHTML = resultHTML(p);
  renderSummary();
}

export function initPases(){
  $('psList').innerHTML = PASSES.map(cardHTML).join('');
  renderSummary();

  $('psList').addEventListener('input', e => {
    const card = e.target.closest('.ps-card'); if(!card) return;
    const t = e.target, id = card.dataset.id, i = +t.dataset.i;
    if(t.name === 'opt-' + id) save(id, s => { s.opt = +t.value; });
    else if(t.classList.contains('chk')) save(id, s => { (s.on = s.on || {})[i] = t.checked; });
    else if(t.classList.contains('qty') && t.value !== '') save(id, s => { (s.q = s.q || {})[i] = Math.max(0, +t.value); });
    else if(t.classList.contains('ppl') && +t.value > 0){
      const p = PASSES.find(x => x.id === id), s = saved[id] = saved[id] || {};
      s.ppl = +t.value; writeJSON(KEY, saved);
      card.querySelector('.ps-res dd:last-child').textContent = signed(calc(p).diff * s.ppl, p.cur);
    }
  });
  $('psList').addEventListener('click', e => {
    const b = e.target.closest('.ps-reset'); if(!b) return;
    const card = b.closest('.ps-card'), p = PASSES.find(x => x.id === card.dataset.id);
    delete saved[p.id]; writeJSON(KEY, saved);
    card.outerHTML = cardHTML(p); renderSummary();
  });
  $('psSum').addEventListener('click', e => {
    const b = e.target.closest('.ps-go'); if(b) $('ps-' + b.dataset.go).scrollIntoView({behavior: 'smooth', block: 'start'});
  });
}
