# Europa en familia 2027

Guía del viaje (9 ene – 11 feb 2027) como sitio estático y PWA instalable que funciona sin internet. Sin dependencias ni paso de compilación: HTML, CSS y módulos de JavaScript nativos.

## Ver en local

Los módulos ES y la carga de fragmentos HTML necesitan un servidor; abrir `index.html` con doble clic no funciona.

```sh
python3 -m http.server 8000
# abrir http://localhost:8000  (agregar ?hoy=2027-01-20 para simular un día del viaje)
```

## Estructura

```
index.html              Esqueleto: <head>, hojas de estilo y lugares donde se insertan componentes y páginas
sw.js                   Service worker (modo sin internet)
assets/europe-land.svg  Contornos de los países del mapa

styles/                 Estilos globales
  tokens.css            Colores claro/oscuro (variables CSS)
  base.css              Reset, tipografía, secciones, tablas
  leaflet.css           Marcadores de los mapas reales
  print.css             Versión imprimible

components/<nombre>/    Piezas reutilizables: .html (marcado), .css (estilos), .js (comportamiento)
  app-bar               Barra superior
  tab-bar               Barra inferior del teléfono y hoja «Más»
  site-footer           Pie de página
  brand                 Logo (usado en barra y pie)
  info-dialog           Ventana con información de Wikipedia
  day-card              Traslado y lugares de un día (Itinerario y «Hoy»)
  mini-map              Mapas de paradas de cada día
  city-tabs             Pestañas de ciudades (Comer y Guía)

pages/<id>/             Una carpeta por página del menú: <id>.html, <id>.css, <id>.js
  inicio  itinerario  mapa  comer  guia  reservas  presupuesto  antes

js/
  main.js               Punto de entrada: carga el HTML y arranca cada módulo
  core/                 pages.js (lista de páginas), router.js, include.js (fragmentos HTML), actions.js
  data/                 Contenido del viaje (días, alojamiento, restaurantes, tips, enlaces…)
  lib/                  Utilidades sin estado (DOM, formato, fechas, geografía, Leaflet, localStorage)
  services/             APIs externas (Wikipedia, recorridos a pie)
  features/             Tema, clima, modo sin internet, impresión
```

## Cambios frecuentes

- **Contenido del viaje** (días, precios, restaurantes, tips): editar el archivo correspondiente en `js/data/`. Cada uno explica su formato al inicio.
- **Colores**: `styles/tokens.css`.
- **Agregar una página**: crear `pages/<id>/<id>.html` (y `.css`/`.js` si hace falta), sumarla en `js/core/pages.js`, enlazar su `.css` en `index.html` e iniciar su `.js` en `js/main.js`. Los menús y el pie se generan solos.
- **Botones de herramientas**: cualquier elemento con `data-action="theme|print|offline|offline-toggle|top"` ejecuta esa acción (`js/core/actions.js`).
- **Orden de los estilos**: en `index.html` van base → componentes → páginas → impresión. Respetarlo al agregar hojas.
