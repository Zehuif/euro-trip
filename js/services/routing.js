// Recorridos a pie por las calles (servidor público de OSRM). Puntos como [lat, lng].

export const osrmURL = (a, b) => `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;

// Lista de puntos [lat, lng] del recorrido, o null si no hay conexión o falla el servidor
export async function footRoute(a, b){
  try{
    const r = await fetch(osrmURL(a, b)); if(!r.ok) throw 0;
    const j = await r.json();
    return j.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
  }catch(e){ return null; }
}
