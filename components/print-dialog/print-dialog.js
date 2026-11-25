// Ventana «Imprimir resumen»: elegir etapas y luego imprimir solo esas (js/features/print.js).
import { ST } from '../../js/data/stages.js';
import { $, openDialog } from '../../js/lib/dom.js';
import { printSummary } from '../../js/features/print.js';

const checked = () => [...$('pdStages').querySelectorAll('input:checked')].map(i => +i.value);

export function initPrintDialog(){
  const dlg = $('printDialog');
  $('pdStages').insertAdjacentHTML('beforeend', Object.entries(ST).map(([k, s]) =>
    `<label style="--c:${s.c};--soft:${s.soft}"><input type="checkbox" value="${k}" checked><span><b>${s.name}</b><small>${s.desc}</small></span></label>`).join(''));

  // Sin etapas marcadas no hay nada que imprimir
  $('pdStages').addEventListener('change', () => { $('pdPrint').disabled = !checked().length; });
  dlg.addEventListener('click', e => { if(e.target === dlg) dlg.close('cancel'); });
  dlg.addEventListener('close', () => { if(dlg.returnValue === 'print' && checked().length) printSummary(checked()); });
}

export function openPrintDialog(){
  const dlg = $('printDialog');
  dlg.returnValue = '';
  openDialog(dlg);
}
