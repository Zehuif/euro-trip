// Wikipedia: resumen en español de cada lugar y fotos de cada ciudad (Wikimedia Commons, licencias libres).
import { WIKI, PHOTO } from '../data/wiki.js';

// Nombre del artículo a buscar para un lugar del itinerario
export const wikiQ = n => {
  const c = n.replace(/ \(.*\)$/, '');
  const k = Object.keys(WIKI).filter(k => c.startsWith(k)).sort((a, b) => b.length - a.length)[0];
  return k ? WIKI[k] : c;
};

export const wikiURL = q => 'https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&generator=search&gsrlimit=1&gsrsearch=' + encodeURIComponent(q)
  + '&prop=extracts%7Cpageimages%7Cinfo&exintro=1&explaintext=1&exsentences=6&piprop=thumbnail&pithumbsize=900&pilicense=free&inprop=url';

export const wikiSearchURL = q => `https://es.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`;

const firstPage = j => Object.values((j.query || {}).pages || {})[0] || null;

const cache = {};
// Página de Wikipedia (title, extract, thumbnail, fullurl) o null
export async function fetchSummary(q){
  if(!(q in cache)) cache[q] = firstPage(await (await fetch(wikiURL(q))).json());
  return cache[q];
}

// Foto de cada ciudad: {clave de ciudad: {title, thumbnail, pageimage}}
export async function fetchCityPhotos(){
  const titles = [...new Set(Object.values(PHOTO).flat())];
  const u = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail%7Cname&pithumbsize=1100&pilicense=free&titles=' + encodeURIComponent(titles.join('|'));
  const j = await (await fetch(u)).json(), q = j.query || {};
  const alias = {}; (q.normalized || []).concat(q.redirects || []).forEach(r => alias[r.from] = r.to);
  const resolve = t => { let x = t, n = 0; while(alias[x] && n++ < 3) x = alias[x]; return x; };
  const byTitle = {}; Object.values(q.pages || {}).forEach(pg => { if(pg.thumbnail) byTitle[pg.title] = pg; });
  const out = {};
  Object.entries(PHOTO).forEach(([k, list]) => { const pg = list.map(t => byTitle[resolve(t)]).find(Boolean); if(pg) out[k] = pg; });
  return out;
}
