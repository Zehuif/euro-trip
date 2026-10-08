// Carga de fragmentos HTML: <template data-include="ruta.html"></template> se reemplaza por el contenido del archivo.
// Los fragmentos pueden incluir otros fragmentos.

const cache = new Map();

export function fetchText(url){
  if(!cache.has(url)) cache.set(url, fetch(url).then(r => {
    if(!r.ok) throw new Error(`No se pudo cargar ${url} (${r.status})`);
    return r.text();
  }));
  return cache.get(url);
}

const toFragment = html => { const t = document.createElement('template'); t.innerHTML = html; return t.content; };

export async function includePartials(root = document){
  let pending;
  while((pending = root.querySelectorAll('[data-include]')).length){
    await Promise.all([...pending].map(async el => el.replaceWith(toFragment(await fetchText(el.dataset.include)))));
  }
}

// Crea un contenedor .page por cada página y le carga pages/<id>/<id>.html
export async function loadPages(container, pages){
  await Promise.all(pages.map(async ({id}) => {
    const el = document.createElement('div');
    el.className = 'page'; el.dataset.page = id; el.hidden = true;
    container.append(el);
    el.append(toFragment(await fetchText(`pages/${id}/${id}.html`)));
  }));
}
