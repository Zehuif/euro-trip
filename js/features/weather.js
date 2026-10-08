// Clima de cada día: promedio histórico de la época y, a 15 días o menos, pronóstico real de Open-Meteo.
// Cualquier <span class="wx" data-wx="índice del día"> se rellena solo. Al llegar el pronóstico se emite «weather:update».
import { DAYS } from '../data/days.js';
import { WXLOC } from '../data/weather-locations.js';
import { dayDate, iso } from '../lib/dates.js';

const WX = {};   // índice del día -> {max, min, code, rain}

const WXI = c => c===0?'☀️':c<=2?'🌤️':c===3?'☁️':c<=48?'🌫️':c<=57?'🌦️':c<=67?'🌧️':c<=77?'🌨️':c<=82?'🌧️':c<=86?'🌨️':'⛈️';

// [mín, máx] promedio de la ciudad de ese día, o null
export const avgTemp = d => WXLOC[d.city] ? [WXLOC[d.city][2], WXLOC[d.city][3]] : null;

export function wxHTML(i){
  const d = DAYS[i], loc = WXLOC[d.city]; if(!loc) return '';
  const f = WX[i];
  if(f) return `${WXI(f.code)} <b>${Math.round(f.min)}° / ${Math.round(f.max)}°</b>${f.rain != null ? ` · lluvia ${f.rain}%` : ''}`;
  return `🌡️ <b>${loc[2]}° / ${loc[3]}°</b> promedio`;
}

export function paintWeather(root = document){
  root.querySelectorAll('.wx[data-wx]').forEach(el => {
    const i = +el.dataset.wx;
    el.innerHTML = wxHTML(i);
    el.classList.toggle('fc', !!WX[i]);
    el.title = WX[i] ? 'Pronóstico real (Open-Meteo)' : 'Promedio histórico de la época';
  });
}

export async function loadForecast(){
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const want = DAYS.map((d, i) => [i, dayDate(d)]).filter(([i, dt]) => { const diff = (dt - today) / 864e5; return diff >= 0 && diff <= 15 && WXLOC[DAYS[i].city]; });
  if(!want.length) return;
  // Una consulta por ubicación con todas sus fechas
  const byLoc = {};
  want.forEach(([i, dt]) => { const loc = WXLOC[DAYS[i].city], k = loc[0] + ',' + loc[1]; (byLoc[k] = byLoc[k] || []).push([i, iso(dt)]); });
  await Promise.all(Object.entries(byLoc).map(async ([k, list]) => {
    try{
      const [la, lo] = k.split(','), dates = list.map(x => x[1]).sort();
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&start_date=${dates[0]}&end_date=${dates[dates.length - 1]}`;
      const j = await (await fetch(u)).json(), t = j.daily.time;
      list.forEach(([i, dd]) => { const x = t.indexOf(dd); if(x >= 0) WX[i] = {code:j.daily.weather_code[x], max:j.daily.temperature_2m_max[x], min:j.daily.temperature_2m_min[x], rain:j.daily.precipitation_probability_max[x]}; });
    }catch(e){}
  }));
  paintWeather();
  document.dispatchEvent(new CustomEvent('weather:update'));
}
