// Fechas del viaje. Se puede simular otro día con ?hoy=2027-01-20 en la URL.
import { DAYS } from '../data/days.js';

export const dayDate = d => new Date(2027, d.m === 'ene' ? 0 : 1, d.n);
export const iso = dt => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

export const NOW = (() => {
  const q = new URLSearchParams(location.search).get('hoy');
  const dt = q ? new Date(q + 'T12:00:00') : new Date();
  dt.setHours(0, 0, 0, 0);
  return dt;
})();
export const FIRST = dayDate(DAYS[0]);
export const LAST = dayDate(DAYS[DAYS.length - 1]);

export const daysUntilStart = () => Math.round((FIRST - NOW) / 864e5);

// Índice del día de hoy en el itinerario (el primero antes del viaje, el último después)
export function todayIndex(){
  const i = NOW < FIRST ? 0 : NOW > LAST ? DAYS.length - 1 : DAYS.findIndex(d => dayDate(d).getTime() === NOW.getTime());
  return i < 0 ? 0 : i;
}
