// Franja «La ruta»: ciudades en línea con las noches de cada una; el grosor indica cuántos viajan.
import { ST } from '../../js/data/stages.js';
import { ROUTE_STOPS, ROUTE_SEGMENTS, STAGE_WIDTH } from '../../js/data/geo.js';
import { $ } from '../../js/lib/dom.js';

export function initRouteStrip(){
  const x0 = 40, x1 = 925, y = 78, step = (x1 - x0) / (ROUTE_STOPS.length - 1);
  let s = '';
  ROUTE_SEGMENTS.forEach(([st, mode], i) => {
    const xa = x0 + i * step, xb = x0 + (i + 1) * step, col = ST[st].c;
    if(mode === 'f'){
      s += `<path class="seg fly" d="M${xa} ${y} Q ${(xa + xb) / 2} ${y - 34} ${xb} ${y}" fill="none" stroke="${col}" stroke-width="${STAGE_WIDTH[st] - 1}" stroke-dasharray="7 7" stroke-linecap="round"/>`;
    } else {
      const len = Math.ceil(xb - xa);
      s += `<path class="seg" style="--len:${len};animation-delay:${i * 0.09}s" d="M${xa} ${y} L ${xb} ${y}" fill="none" stroke="${col}" stroke-width="${STAGE_WIDTH[st]}" stroke-linecap="round"/>`;
    }
  });
  ROUTE_STOPS.forEach(([city, nights, st], i) => {
    const x = x0 + i * step, col = ST[st].c;
    s += `<circle cx="${x}" cy="${y}" r="9" fill="var(--surface)" stroke="${col}" stroke-width="4"/>`;
    s += `<text x="${x}" y="${y - 22}" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="15" fill="${col}">${nights}</text>`;
    s += `<text x="${x}" y="${y + 32}" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="13" fill="var(--ink)" transform="rotate(32 ${x} ${y + 32})" dx="18">${city}</text>`;
  });
  $('routeSvg').innerHTML = s;
}
