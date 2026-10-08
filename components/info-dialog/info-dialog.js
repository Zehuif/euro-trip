// Ventana con el resumen de Wikipedia de un lugar. Se abre con cualquier <button class="pl" data-q="lugar" data-c="ciudad">.
import { $, openDialog, closeDialog } from '../../js/lib/dom.js';
import { wikiQ, fetchSummary, wikiSearchURL } from '../../js/services/wikipedia.js';

async function showInfo(name, city){
  const dlg = $('info'), body = $('iBody'), q = wikiQ(name), short = name.replace(/ \(.*\)$/, '');
  body.innerHTML = `<div class="ib"><h3 id="iT">${short}</h3><p class="ic">${city}</p><p class="ix">Buscando información…</p></div>`;
  openDialog(dlg);
  try{
    const pg = await fetchSummary(q);
    if(!pg || !pg.extract) throw 0;
    body.innerHTML = `${pg.thumbnail ? `<img src="${pg.thumbnail.source}" alt="${pg.title}">` : ''}<div class="ib">
      <h3 id="iT">${pg.title}</h3><p class="ic">${short} · ${city}</p>
      <p class="ix">${pg.extract.replace(/</g, '&lt;')}</p>
      <div class="ia"><a href="${pg.fullurl}" target="_blank" rel="noopener">Leer más en Wikipedia ↗</a></div></div>`;
  }catch(e){
    body.querySelector('.ix').innerHTML = `No se pudo cargar la información (se necesita internet). <a href="${wikiSearchURL(q)}" target="_blank" rel="noopener">Buscar en Wikipedia ↗</a>`;
  }
}

export function initInfoDialog(){
  const dlg = $('info');
  document.addEventListener('click', e => {
    const b = e.target.closest('button.pl'); if(b){ showInfo(b.dataset.q, b.dataset.c); return; }
    if(e.target.closest('#info .x') || e.target === dlg) closeDialog(dlg);
  });
}
