// Fechas de entrada y salida de cada alojamiento. Las estadías de js/data/lodging.js son seguidas,
// así que se calculan sumando las noches desde el primer día del itinerario.
import { DAYS } from '../data/days.js';
import { LODGING } from '../data/lodging.js';

const label = d => `${d.wd.toLowerCase()} ${d.n} ${d.m}`;

// [{checkIn: 'sáb 9 ene', checkOut: 'mié 13 ene'}, ...] en el mismo orden que LODGING
export const STAYS = (() => {
  let i = 0;
  return LODGING.map(l => {
    const stay = {checkIn: label(DAYS[i]), checkOut: label(DAYS[Math.min(i + l[2], DAYS.length - 1)])};
    i += l[2];
    return stay;
  });
})();

const nights = LODGING.reduce((a, l) => a + l[2], 0);
if(nights !== DAYS.length - 1) console.warn(`Alojamiento: ${nights} noches, pero el viaje tiene ${DAYS.length - 1}. Revisen js/data/lodging.js.`);
