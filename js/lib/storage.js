// localStorage seguro: si no está disponible (modo privado, bloqueado), no rompe la página.

export function readJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch(e){ return fallback; }
}

export function writeJSON(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){}
}

export function writeText(key, value){
  try { localStorage.setItem(key, value); } catch(e){}
}
