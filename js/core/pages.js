// Páginas del sitio: una sola fuente para el router, la navegación y los accesos de la portada.
// Para agregar una página: crear pages/<id>/<id>.html (y .css/.js si hace falta) y sumarla aquí.
//   label: texto corto (menús)   title: texto largo (pie de página, título de la pestaña)
//   tab: true = aparece en la barra inferior del teléfono; si no, va en la hoja «Más»
export const PAGES = [
  {id:'inicio', label:'Inicio', title:'Inicio', tab:true,
   icon:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'},
  {id:'itinerario', label:'Itinerario', title:'Itinerario', tab:true,
   icon:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'},
  {id:'mapa', label:'Mapa', title:'Mapa', tab:true,
   icon:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>'},
  {id:'comer', label:'Comer', title:'Dónde comer', tab:true,
   icon:'<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>'},
  {id:'guia', label:'Guía', title:'Guía',
   icon:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'},
  {id:'reservas', label:'Reservas', title:'Reservas',
   icon:'<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11v2M14 15v2"/>'},
  {id:'presupuesto', label:'Presupuesto', title:'Presupuesto',
   icon:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>'},
  {id:'antes', label:'Antes de viajar', title:'Antes de viajar',
   icon:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4h6v3M4 12h16"/>'}
];

export const MORE_ICON = '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>';

export const pageById = id => PAGES.find(p => p.id === id);
export const iconSVG = paths => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
