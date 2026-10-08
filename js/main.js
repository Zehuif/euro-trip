// Punto de entrada: carga el HTML de componentes y páginas, y luego inicia cada parte del sitio.
import { PAGES } from './core/pages.js';
import { includePartials, loadPages } from './core/include.js';
import { startRouter } from './core/router.js';
import { initActions } from './core/actions.js';
import { $ } from './lib/dom.js';
import { paintWeather, loadForecast } from './features/weather.js';
import { initOffline } from './features/offline.js';

import { initAppBar } from '../components/app-bar/app-bar.js';
import { initTabBar } from '../components/tab-bar/tab-bar.js';
import { initFooter } from '../components/site-footer/site-footer.js';
import { initInfoDialog } from '../components/info-dialog/info-dialog.js';

import { initInicio } from '../pages/inicio/inicio.js';
import { initItinerario } from '../pages/itinerario/itinerario.js';
import { initMapa } from '../pages/mapa/mapa.js';
import { initComer } from '../pages/comer/comer.js';
import { initGuia } from '../pages/guia/guia.js';
import { initReservas } from '../pages/reservas/reservas.js';
import { initPresupuesto } from '../pages/presupuesto/presupuesto.js';

if(!location.hash){ try { history.scrollRestoration = 'manual'; } catch(e){} }

async function boot(){
  await loadPages($('pages'), PAGES);
  await includePartials();

  initAppBar(); initTabBar(); initFooter(); initInfoDialog(); initActions();
  initMapa();            // antes que Inicio e Itinerario, que abren días en el mapa
  initItinerario(); initInicio(); initComer(); initGuia(); initReservas(); initPresupuesto();

  paintWeather(); loadForecast();
  initOffline();
  startRouter();
}

boot().catch(err => {
  console.error(err);
  $('pages').innerHTML = `<div class="wrap"><p>No se pudo cargar la guía. Revisen la conexión a internet y vuelvan a abrir la página.</p></div>`;
});
