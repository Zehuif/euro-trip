// Ilustraciones SVG de cada lugar (respaldo cuando no hay foto) y qué ilustración usa cada ciudad.

const C='var(--c)', S='var(--surface)', K='var(--soft)';
const ground = (op=.18) => `<rect x="0" y="128" width="600" height="22" fill="${C}" opacity="${op}"/>`;
const water = `<rect x="0" y="124" width="600" height="26" fill="${C}" opacity=".22"/><path d="M20 134h60M140 141h80M300 133h70M450 140h90" stroke="${S}" stroke-width="2" opacity=".8"/>`;
const mtn = (pts,op) => `<polygon points="${pts}" fill="${C}" opacity="${op}"/>`;
const svgWrap = (inner,label) => `<svg viewBox="0 0 600 150" role="img" aria-label="${label}" preserveAspectRatio="xMidYMax slice">${inner}</svg>`;
function columns(x0,n,gap,w,top,bottom,fill=C){let s='';for(let i=0;i<n;i++)s+=`<rect x="${x0+i*gap}" y="${top}" width="${w}" height="${bottom-top}" fill="${fill}"/>`;return s;}
function arches(x0,n,gap,w,yb,h,fill=K){let s='';for(let i=0;i<n;i++){const x=x0+i*gap;s+=`<path d="M${x} ${yb}v-${h-w/2}a${w/2} ${w/2} 0 0 1 ${w} 0v${h-w/2}z" fill="${fill}"/>`;}return s;}
function spires(x0,n,gap,base,hs){let s='';for(let i=0;i<n;i++){const x=x0+i*gap,h=hs[i%hs.length];s+=`<path d="M${x} ${base}l4 -${h}l4 ${h}z" fill="${C}"/>`;}return s;}

export const ILL = {
 madrid: svgWrap(ground()+
  `<g fill="${C}" opacity=".35"><rect x="50" y="86" width="90" height="42"/><rect x="72" y="66" width="46" height="20"/><rect x="470" y="66" width="64" height="62"/><path d="M470 66a32 26 0 0 1 64 0z"/><rect x="498" y="24" width="8" height="22"/></g>
   <g fill="${C}"><rect x="170" y="72" width="260" height="56"/><rect x="226" y="52" width="148" height="22"/><path d="M282 52l18 -16l18 16z"/></g>`+
  arches(250,3,36,28,128,40)+`<rect x="190" y="94" width="24" height="34" fill="${K}"/><rect x="386" y="94" width="24" height="34" fill="${K}"/>`,'Puerta de Alcalá, Madrid'),
 barcelona: svgWrap(water.replace('y="124"','y="124"')+
  `<g fill="${C}" opacity=".3"><rect x="40" y="100" width="120" height="28"/><rect x="460" y="96" width="110" height="32"/></g>
   <rect x="215" y="92" width="180" height="36" fill="${C}"/>`+
  [[222,16,52],[244,18,70],[270,20,86],[294,22,104],[318,20,86],[344,18,70],[366,16,52]].map(([x,w,h])=>`<path d="M${x} 128v-${h}l${w*.25} -14l${w*.25} -8l${w*.25} 8l${w*.25} 14v${h}z" fill="${C}"/>`).join('')+
  arches(250,4,30,18,128,26),'Sagrada Familia, Barcelona'),
 paris: svgWrap(water+
  `<g fill="${C}" opacity=".3"><rect x="30" y="98" width="140" height="28"/><rect x="430" y="94" width="150" height="32"/></g>
   <path d="M238 124L288 46L294 10L306 10L312 46L362 124L338 124Q300 86 262 124Z" fill="${C}"/>
   <rect x="276" y="70" width="48" height="5" fill="${C}"/><rect x="284" y="44" width="32" height="4" fill="${C}"/>
   <path d="M120 124q30 -26 60 0" stroke="${C}" stroke-width="6" fill="none" opacity=".5"/>`,'Torre Eiffel y el Sena, París'),
 zurich: svgWrap(mtn('0,110 90,60 170,104 260,52 360,100 450,58 540,96 600,74 600,128 0,128','.18')+water+
  `<g fill="${C}"><rect x="232" y="88" width="136" height="36"/><rect x="250" y="44" width="28" height="80"/><rect x="322" y="44" width="28" height="80"/><path d="M250 44a14 18 0 0 1 28 0z"/><path d="M322 44a14 18 0 0 1 28 0z"/><rect x="262" y="16" width="4" height="12"/><rect x="334" y="16" width="4" height="12"/></g>`+
  arches(258,2,72,12,76,18)+arches(285,2,16,10,124,20),'Grossmünster, Zúrich'),
 lucerna: svgWrap(mtn('0,118 70,70 120,94 190,30 230,56 260,40 330,100 420,64 500,96 600,60 600,128 0,128','.22')+
  `<polygon points="190,30 202,42 178,42" fill="${S}" opacity=".9"/><polygon points="260,40 270,50 250,50" fill="${S}" opacity=".9"/>`+water+
  `<path d="M60 118L440 100L440 106L60 124Z" fill="${C}"/><path d="M60 112L440 94L440 100L60 118Z" fill="${C}" opacity=".6"/>
   <rect x="300" y="64" width="34" height="56" fill="${C}"/><path d="M296 64l21 -26l21 26z" fill="${C}"/>`+columns(80,12,30,3,118,128),'Puente de la Capilla, Lucerna'),
 chur: svgWrap(mtn('0,128 60,64 130,108 210,26 290,92 360,40 450,100 520,50 600,90 600,128','.28')+
  `<polygon points="210,26 226,44 194,44" fill="${S}"/><polygon points="360,40 374,56 346,56" fill="${S}"/><polygon points="520,50 532,64 508,64" fill="${S}"/>`+ground(.25)+
  `<path d="M120 98H520v8H120z" fill="${C}"/>`+arches(130,10,40,30,128,30,K)+
  `<g fill="#C0272D"><rect x="240" y="80" width="72" height="18" rx="4"/><rect x="316" y="80" width="72" height="18" rx="4"/><rect x="392" y="80" width="60" height="18" rx="4"/></g>
   <g fill="${S}" opacity=".85"><rect x="250" y="84" width="52" height="7"/><rect x="326" y="84" width="52" height="7"/><rect x="400" y="84" width="40" height="7"/></g>`,'Bernina Express sobre un viaducto en los Alpes'),
 milan: svgWrap(ground()+
  `<path d="M170 128V74L300 44L430 74V128Z" fill="${C}"/>`+spires(176,12,22,74,[34,44,52,44])+
  `<path d="M296 44l4 -40l4 40z" fill="${C}"/>`+arches(262,3,28,18,128,34)+arches(196,2,190,16,128,26),'Duomo de Milán'),
 venecia: svgWrap(water+
  `<rect x="430" y="22" width="24" height="102" fill="${C}"/><path d="M426 22l16 -18l16 18z" fill="${C}"/>
   <rect x="150" y="80" width="240" height="44" fill="${C}" opacity=".85"/><rect x="150" y="62" width="240" height="18" fill="${C}" opacity=".55"/>`+
  arches(158,10,23,14,124,26)+
  `<path d="M40 128q60 10 120 0l6 -8q-60 14 -132 2z" fill="${C}"/><path d="M130 122l6 -30" stroke="${C}" stroke-width="2.5"/><circle cx="136" cy="90" r="3" fill="${C}"/>`,'Gran Canal y San Marcos, Venecia'),
 florencia: svgWrap(mtn('0,110 120,78 240,104 380,74 520,100 600,84 600,128 0,128','.18')+ground()+
  `<rect x="200" y="92" width="200" height="36" fill="${C}" opacity=".7"/><path d="M236 92Q236 30 300 26Q364 30 364 92Z" fill="${C}"/>
   <rect x="292" y="10" width="16" height="18" fill="${C}"/><path d="M300 26v-16" stroke="${S}" stroke-width="1.5" opacity=".6"/>
   <rect x="440" y="34" width="20" height="94" fill="${C}"/><rect x="434" y="28" width="32" height="14" fill="${C}"/><rect x="446" y="12" width="8" height="16" fill="${C}"/>
   <rect x="400" y="80" width="80" height="48" fill="${C}" opacity=".75"/><rect x="120" y="54" width="14" height="74" fill="${C}" opacity=".75"/>`,'Duomo y Palazzo Vecchio, Florencia'),
 roma: svgWrap(ground()+
  `<path d="M140 128V58Q300 34 460 58V128Z" fill="${C}"/><path d="M420 128V60L460 58V128Z" fill="${K}" opacity=".5"/>`+
  arches(158,10,30,18,124,22)+arches(158,10,30,16,96,18)+arches(158,10,30,14,72,12),'Coliseo, Roma'),
 napoles: svgWrap(mtn('300,128 380,52 420,64 460,40 560,128','.3')+water+
  `<g fill="${C}">${[40,70,95,125,150,180].map((x,i)=>`<rect x="${x}" y="${100-(i%3)*10}" width="24" height="${28+(i%3)*10}"/>`).join('')}<rect x="220" y="100" width="70" height="24"/><rect x="230" y="90" width="20" height="10"/></g>`,'Bahía de Nápoles y el Vesubio'),
 pompeya: svgWrap(mtn('260,128 360,40 400,52 440,30 560,128','.25')+ground()+
  `<rect x="90" y="118" width="320" height="10" fill="${C}"/>`+columns(110,6,52,14,62,118)+
  `<rect x="104" y="54" width="130" height="10" fill="${C}"/><rect x="310" y="96" width="14" height="22" fill="${K}"/>`,'Ruinas de Pompeya con el Vesubio'),
 atenas: svgWrap(`<path d="M0 128Q150 70 300 74Q450 70 600 128Z" fill="${C}" opacity=".3"/>`+ground()+
  `<rect x="190" y="70" width="220" height="8" fill="${C}"/>`+columns(200,8,28,10,40,70)+
  `<rect x="194" y="32" width="212" height="8" fill="${C}"/><path d="M194 32L300 12L406 32Z" fill="${C}"/>`,'Partenón, Atenas'),
 lisboa: svgWrap(`<path d="M0 128Q120 50 260 96Q380 60 600 110V128Z" fill="${C}" opacity=".25"/>`+
  `<g fill="${C}" opacity=".45">${[30,60,90,330,360,390,420,470].map((x,i)=>`<rect x="${x}" y="${84+(i%3)*8}" width="24" height="${44-(i%3)*8}"/>`).join('')}</g>`+ground()+
  `<rect x="190" y="72" width="150" height="48" rx="8" fill="#E8A60C"/><rect x="190" y="104" width="150" height="6" fill="${S}" opacity=".9"/>
   ${[200,228,256,284,312].map(x=>`<rect x="${x}" y="80" width="20" height="18" rx="3" fill="${S}" opacity=".9"/>`).join('')}
   <path d="M265 72l-12 -26M253 46h24" stroke="${C}" stroke-width="2.5"/><circle cx="215" cy="122" r="7" fill="${C}"/><circle cx="315" cy="122" r="7" fill="${C}"/>`,'Tranvía 28, Lisboa'),
 pisa: svgWrap(ground()+
  `<g transform="rotate(5 300 128)"><rect x="280" y="34" width="40" height="94" fill="${C}"/><rect x="284" y="20" width="32" height="14" fill="${C}"/>
   ${[46,62,78,94,110].map(y=>`<rect x="280" y="${y}" width="40" height="2" fill="${K}"/>`).join('')}</g>
   <path d="M110 128V90L190 76L270 90V128Z" fill="${C}" opacity=".6"/><path d="M160 76a30 20 0 0 1 60 0z" fill="${C}" opacity=".6"/>`,'Torre inclinada de Pisa'),
 toledo: svgWrap(`<path d="M0 128Q160 70 300 66Q460 70 600 128Z" fill="${C}" opacity=".3"/>`+water+
  `<rect x="330" y="40" width="110" height="40" fill="${C}"/>${[330,422].map(x=>`<rect x="${x-4}" y="26" width="22" height="54" fill="${C}"/><path d="M${x-6} 26l13 -16l13 16z" fill="${C}"/>`).join('')}
   <rect x="200" y="54" width="70" height="30" fill="${C}" opacity=".8"/><rect x="226" y="18" width="12" height="40" fill="${C}"/><path d="M224 18l8 -16l8 16z" fill="${C}"/>
   <g fill="${C}" opacity=".6"><rect x="120" y="76" width="60" height="16"/><rect x="460" y="76" width="70" height="16"/></g>`,'Alcázar y catedral de Toledo')
};
export const KEYS = {'Madrid':'madrid','Barcelona':'barcelona','París':'paris','Zúrich':'zurich','Zúrich y Lucerna':'zurich','Lucerna':'lucerna','Chur':'chur','Milán':'milan','Venecia':'venecia','Florencia':'florencia','Pisa y Lucca':'pisa','Roma':'roma','Roma: se separan':'roma','Nápoles':'napoles','Pompeya':'pompeya','Atenas':'atenas','Lisboa':'lisboa','Toledo':'toledo'};
