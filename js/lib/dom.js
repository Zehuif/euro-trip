// Utilidades de DOM y de HTML.

export const $ = id => document.getElementById(id);

// Enlace externo que abre en otra pestaña
export const ext = (label, url, cls) => `<a class="${cls}" href="${url}" target="_blank" rel="noopener">${label}</a>`;

export const escapeHTML = t => String(t).replace(/</g, '&lt;');
export const escapeAttr = t => String(t).replace(/"/g, '&quot;');

// Valor real de un color dado como var(--x), para librerías que no entienden variables CSS (Leaflet)
export const cssCol = v => {
  const m = /var\((--[\w-]+)\)/.exec(v);
  return m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() : v;
};

// Centra un elemento dentro de su franja con scroll horizontal (pestañas, chips)
export const stripScroll = el => {
  const p = el.parentElement; if(!p) return;
  p.scrollTo({left: el.offsetLeft - p.offsetLeft - (p.clientWidth - el.offsetWidth) / 2, behavior: 'smooth'});
};

export const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Abre o cierra un <dialog> con respaldo para navegadores sin showModal
export const openDialog = dlg => { if(dlg.showModal && !dlg.open) dlg.showModal(); else dlg.setAttribute('open', ''); };
export const closeDialog = dlg => { if(dlg.close) dlg.close(); else dlg.removeAttribute('open'); };

// Llama a fn(el) cuando el elemento se acerca a la pantalla (una vez). Sin IntersectionObserver, de inmediato.
export function whenVisible(el, fn, rootMargin = '200px'){
  if(!('IntersectionObserver' in window)){ fn(el); return; }
  const obs = new IntersectionObserver(es => { if(es[0].isIntersecting){ obs.disconnect(); fn(el); } }, {rootMargin});
  obs.observe(el);
}
