// Barra inferior del teléfono (páginas con tab: true) y hoja «Más» con el resto de las páginas y herramientas.
import { PAGES, MORE_ICON, iconSVG } from '../../js/core/pages.js';
import { $, openDialog } from '../../js/lib/dom.js';

const link = p => `<a href="#/${p.id}" data-p="${p.id}">${iconSVG(p.icon)}<span>${p.label}</span></a>`;

export function initTabBar(){
  $('tabBar').innerHTML = PAGES.filter(p => p.tab).map(link).join('')
    + `<button type="button" id="moreBtn" data-p="mas">${iconSVG(MORE_ICON)}<span>Más</span></button>`;
  const sheet = $('moreSheet');
  $('sheetLinks').outerHTML = PAGES.filter(p => !p.tab).map(link).join('');

  $('moreBtn').addEventListener('click', () => openDialog(sheet));
  // Tocar fuera de la hoja la cierra; las acciones (data-action) la cierran y luego se ejecutan (js/core/actions.js)
  sheet.addEventListener('click', e => {
    if(e.target === sheet || e.target.closest('[data-action]')) sheet.close();
  });
}
