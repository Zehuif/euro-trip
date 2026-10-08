// Acciones globales: cualquier botón con data-action="<nombre>" (barra, hoja «Más», pie, portada) ejecuta la acción.
import { go } from './router.js';
import { reduceMotion } from '../lib/dom.js';
import { toggleTheme } from '../features/theme.js';
import { printSummary } from '../features/print.js';
import { toggleOfflineBox, revealOfflineBox } from '../features/offline.js';

const ACTIONS = {
  theme: toggleTheme,
  print: printSummary,
  'offline-toggle': toggleOfflineBox,
  offline: () => { go('#/inicio'); revealOfflineBox(); },
  top: () => window.scrollTo({top:0, behavior:reduceMotion ? 'auto' : 'smooth'})
};

export function initActions(){
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if(b && ACTIONS[b.dataset.action]) ACTIONS[b.dataset.action]();
  });
}
