// Pie de página: enlaces a todas las páginas. Las herramientas usan data-action (js/core/actions.js).
import { PAGES } from '../../js/core/pages.js';
import { $ } from '../../js/lib/dom.js';

export function initFooter(){
  $('footNav').insertAdjacentHTML('beforeend', PAGES.map(p => `<a href="#/${p.id}">${p.title}</a>`).join(''));
}
