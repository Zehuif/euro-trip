// Distancias entre paradas. Una parada es [nombre, lat, lng, tipo?].
import { fmtD } from './format.js';

export const WALK_KM = 1.8; // hasta esta distancia se considera caminable

// Distancia en km entre dos paradas (fórmula del haversine)
export const hav = (a, b) => {
  const R = 6371, toR = Math.PI / 180, dLa = (b[1] - a[1]) * toR, dLo = (b[2] - a[2]) * toR;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(a[1] * toR) * Math.cos(b[1] * toR) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export function legText(km){
  if(km <= WALK_KM) return `${fmtD(km)}, ~${Math.max(3, Math.round(km / 3.5 * 60))} min a pie`;
  if(km <= 12) return `${fmtD(km)}, transporte público o taxi (~${Math.round(km * 3 + 10)} min)`;
  return `${fmtD(km)}, en tren, barco o bus`;
}

// Etiqueta de cada parada en el mapa: H = alojamiento, E = estación, número = destino
export const stopLabels = s => s.map((p, i) => p[3] === 'h' ? 'H' : p[3] === 't' ? 'E' : String(s.slice(0, i + 1).filter(q => !q[3]).length));

// Enlace a Google Maps con la ruta de un grupo de paradas
export function gmaps(cl){
  const s = cl.s, enc = p => `${p[1]},${p[2]}`;
  const mode = cl.m || (s.some((p, i) => i && hav(s[i - 1], p) > WALK_KM) ? 'transit' : 'walking');
  // Google Maps acepta hasta 9 paradas intermedias (3 en el navegador del teléfono)
  const wp = s.slice(1, -1).slice(0, 9).map(enc).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${enc(s[0])}&destination=${enc(s[s.length - 1])}${wp ? `&waypoints=${encodeURIComponent(wp)}` : ''}&travelmode=${mode === 'driving' ? 'driving' : mode}`;
}

// Mosaicos (z, x, y) que cubren un área b = [sur, oeste, norte, este] entre los zoom z0 y z1
export function tilesFor(b, z0, z1){
  const out = [], t = (lat, lon, z) => {
    const n = 2 ** z, x = Math.floor((lon + 180) / 360 * n), r = lat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
    return [x, y];
  };
  for(let z = z0; z <= z1; z++){
    const [x0, y0] = t(b[2], b[1], z), [x1, y1] = t(b[0], b[3], z);
    for(let x = x0; x <= x1; x++) for(let y = y0; y <= y1; y++) out.push([z, x, y]);
  }
  return out;
}

// Área [sur, oeste, norte, este] que contiene los puntos [lat, lng], con margen
export function bboxOf(pts){
  let s = 90, w = 180, n = -90, e = -180;
  pts.forEach(([a, o]) => { s = Math.min(s, a); n = Math.max(n, a); w = Math.min(w, o); e = Math.max(e, o); });
  const pa = Math.max((n - s) * .25, .002), po = Math.max((e - w) * .25, .003);
  return [s - pa, w - po, n + pa, e + po];
}
