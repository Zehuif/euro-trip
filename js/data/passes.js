// Pases turísticos por ciudad, para la página Pases. Precios por adulto de 2026, aproximados: confirmen en el sitio oficial antes de comprar.
// opts: [etiqueta, precio, entradas gratis]  (entradas gratis: solo en pases que cubren las primeras N entradas y descuentan el resto)
// rest: parte del precio que se ahorra en las entradas que pasan del límite de gratis (0,5 = mitad de precio)
// items: lo que cubre el pase, con lo que costaría por separado.
//   n: lugar   p: precio por separado   day: día del itinerario ('' = idea nueva que no está en el itinerario)
//   on: viene marcado (por defecto, si está en el itinerario)   q: cantidad (viajes)   m: es una entrada (cuenta para el límite de gratis)
//   note: aclaración
// rec: nuestra recomendación con lo que está en el itinerario

export const PASSES = [
 {id:'madrid', city:'Madrid', when:'9 al 12 ene', st:1, ppl:6, cur:'€',
  name:'Paseo del Arte', url:'https://www.museodelprado.es',
  what:'Una entrada a cada uno de los tres grandes museos del Paseo del Prado, válida por un año.',
  opts:[['Tarjeta', 32.8]],
  items:[
   {n:'Museo del Prado', p:15, day:'11 ene', on:false, note:'En el itinerario entran gratis de 18 a 20 h.'},
   {n:'Museo Reina Sofía', p:12, day:'11 ene (opcional)', on:false, note:'Gratis lun y mié a sáb de 19 a 21 h.'},
   {n:'Museo Thyssen-Bornemisza', p:13, day:''}],
  no:'Transporte ni el Palacio Real.',
  rec:'No conviene: el Prado lo ven en el horario gratuito. Solo vale la pena si quieren los tres museos en horario pagado. Para moverse, el pase de 10 viajes (€7,30) basta.'},

 {id:'barcelona', city:'Barcelona', when:'13 al 15 ene', st:1, ppl:6, cur:'€',
  name:'Barcelona Card', url:'https://www.barcelonaturisme.com',
  what:'Transporte público ilimitado y entrada gratis a unos 25 museos. Comprándola en línea sale ~10% más barata.',
  opts:[['3 días', 59], ['4 días', 69]],
  items:[
   {n:'Metro y bus (~7 viajes con la T-casual)', p:1.3, q:7, day:'13–15 ene'},
   {n:'Casa Batlló o La Pedrera (€3 de descuento)', p:3, day:'14 ene'},
   {n:'Museu Picasso', p:15, day:'', m:true},
   {n:'Museu Nacional d\'Art de Catalunya (MNAC)', p:12, day:'', m:true},
   {n:'Fundació Joan Miró', p:15, day:'', m:true},
   {n:'CosmoCaixa', p:6, day:'', m:true}],
  no:'Sagrada Familia ni Park Güell (ni con descuento).',
  rec:'No conviene: lo que más cuesta en Barcelona (Sagrada Familia, Park Güell, casas de Gaudí) no está incluido. Con la T-casual de 10 viajes (€13) les alcanza para moverse.'},

 {id:'paris', city:'París', when:'16 al 19 ene', st:2, ppl:7, cur:'€',
  name:'Paris Museum Pass', url:'https://www.parismuseumpass.fr',
  what:'Entrada a más de 50 museos y monumentos durante 48, 96 o 144 horas desde la primera visita. El Louvre y Versalles igual piden reservar horario.',
  opts:[['2 días', 90], ['4 días', 109], ['6 días', 139]], def:1,
  items:[
   {n:'Sainte-Chapelle', p:22, day:'17 ene'},
   {n:'Museo del Louvre', p:32, day:'18 ene', note:'Precio para no europeos desde 2026.'},
   {n:'Terraza del Arco del Triunfo', p:22, day:'18 ene'},
   {n:'Museo de Orsay', p:16, day:'19 ene'},
   {n:'Panteón de París', p:13, day:'19 ene', note:'En el itinerario está como opcional.'},
   {n:'Conciergerie', p:13, day:'', note:'Al lado de la Sainte-Chapelle.'},
   {n:'Torres de Notre-Dame', p:16, day:''},
   {n:'Museo de la Orangerie (Nenúfares de Monet)', p:12.5, day:'', note:'A pasos de las Tullerías.'},
   {n:'Museo Rodin', p:15, day:''},
   {n:'Palacio de Versalles', p:32, day:'', note:'Media jornada en tren RER C.'}],
  no:'Torre Eiffel, crucero por el Sena ni transporte. Notre-Dame es gratis igual.',
  rec:'Casi empate con el pase de 4 días: lo del itinerario suma ~€105 contra €109. Conviene si agregan uno más, como la Conciergerie (al lado de la Sainte-Chapelle) o la Orangerie (junto a las Tullerías), y además se ahorran filas.'},

 {id:'suiza', city:'Suiza', when:'20 al 23 ene', st:2, ppl:7, cur:'CHF',
  name:'Swiss Travel Pass 4 días', url:'https://www.sbb.ch',
  what:'Trenes, barcos, buses y tranvías de todo el país, el pasaje del Bernina Express, 50% de descuento en el Titlis y entrada a más de 500 museos.',
  opts:[['Adulto, 2ª clase', 309], ['Joven 16–25 años, 2ª clase', 218]],
  items:[
   {n:'Zürich HB → Kilchberg → Zürich → Lucerna', p:36, day:'20 ene'},
   {n:'Lucerna ⇄ Engelberg (tren al Titlis)', p:38, day:'21 ene'},
   {n:'Monte Titlis (50% de descuento)', p:48, day:'21 ene'},
   {n:'Lucerna → Chur', p:55, day:'22 ene'},
   {n:'Bernina Express, Chur → Tirano (pasaje)', p:66, day:'23 ene', note:'La reserva de asiento (CHF 40) se paga aparte.'},
   {n:'Buses y tranvías en Zúrich y Lucerna', p:10, day:'20–22 ene'},
   {n:'Monte Rigi: barco a Vitznau y cremallera', p:100, day:'22 ene (opcional)', on:false},
   {n:'Barco por el lago de Lucerna, ida y vuelta a Weggis', p:30, day:''}],
  no:'La reserva del Bernina Express.',
  rec:'Adultos: no conviene si no suben al Rigi (CHF ~253 contra CHF 309). Con el Rigi sí conviene. Menores de 25 años: conviene siempre (CHF 218). Sin pase, compren en la app SBB Mobile, que tiene pasajes «Supersaver» más baratos.'},

 {id:'venecia', city:'Venecia', when:'25 y 26 ene', st:2, ppl:7, cur:'€',
  name:'Pase de vaporetto ACTV', url:'https://www.veneziaunica.it',
  what:'Viajes ilimitados en vaporetto por la laguna y las islas, desde la primera validación.',
  opts:[['24 h', 25], ['48 h', 35], ['72 h', 45]], def:1,
  items:[
   {n:'Vaporetto: Gran Canal, San Marcos, Murano, Burano y regreso', p:9.5, q:5, day:'25–26 ene', note:'Cada viaje sencillo cuesta €9,50.'},
   {n:'Isla de Torcello (desde Burano)', p:9.5, day:''},
   {n:'Lido de Venecia', p:9.5, day:''}],
  no:'Góndolas ni el bus al aeropuerto.',
  rec:'Conviene el de 48 h, activado al llegar el 25: los 5 viajes sueltos costarían €47,50.'},

 {id:'florencia', city:'Florencia', when:'27 al 29 ene', st:2, ppl:7, cur:'€',
  name:'Firenze Card', url:'https://www.firenzecard.it',
  what:'Entrada a más de 60 museos de Florencia durante 72 horas. Uffizi y Academia igual piden reservar horario.',
  opts:[['72 h', 85]],
  items:[
   {n:'Galería Uffizi', p:12, day:'28 ene', note:'Precio de temporada baja (nov–feb).'},
   {n:'Galería de la Academia', p:16, day:'28 ene'},
   {n:'Palacio Pitti y Jardín de Bóboli', p:16, day:''},
   {n:'Museo del Bargello', p:10, day:''},
   {n:'Capillas Mediceas', p:10, day:''},
   {n:'Palazzo Vecchio', p:12.5, day:''}],
  no:'El Duomo, su cúpula ni el campanario.',
  rec:'No conviene: en enero el Uffizi cuesta €12 y con la Academia suman €28 contra €85. Ni agregando cuatro museos más se paga.'},

 {id:'roma', city:'Roma', when:'30 ene al 1 feb', st:2, ppl:7, cur:'€', rest:0.3,
  name:'Roma Pass', url:'https://www.romapass.it',
  what:'Transporte ilimitado, la primera entrada gratis (las dos primeras con 72 h) y descuento en las siguientes.',
  opts:[['48 h', 38, 1], ['72 h', 62.9, 2]],
  items:[
   {n:'Coliseo, Foro Romano y Palatino', p:18, day:'31 ene', m:true, note:'Igual hay que reservar horario.'},
   {n:'Metro y bus (~4 viajes)', p:1.5, q:4, day:'30 ene–1 feb'},
   {n:'Castel Sant\'Angelo', p:15, day:'1 feb (opcional)', on:false, m:true},
   {n:'Galería Borghese', p:17, day:'', m:true},
   {n:'Museos Capitolinos', p:15, day:'', m:true}],
  no:'Museos Vaticanos ni Panteón.',
  rec:'No conviene: Roma se recorre a pie y el Vaticano no está incluido. Compren el Coliseo por separado (€18 + €2 en línea) y viajes sueltos de metro (€1,50).'},

 {id:'napoles', city:'Nápoles', when:'2 feb', st:3, ppl:4, cur:'€', rest:0.5,
  name:'Campania ArteCard 3 días', url:'https://www.campaniartecard.it',
  what:'Transporte en Nápoles y la región (incluida la Circumvesuviana), las dos primeras entradas gratis y 50% de descuento en las siguientes. Solo en la app.',
  opts:[['3 días, toda la región', 32, 2]],
  items:[
   {n:'Parque arqueológico de Pompeya', p:18, day:'2 feb', m:true},
   {n:'Circumvesuviana ida y vuelta a Pompeya', p:3.6, q:2, day:'2 feb'},
   {n:'Metro y bus en Nápoles', p:1.3, q:2, day:'2 feb'},
   {n:'Museo Arqueológico Nacional (MANN)', p:20, day:'', m:true, note:'Los tesoros de Pompeya están aquí.'},
   {n:'Herculano', p:13, day:'', m:true}],
  no:'El Alibus al aeropuerto.',
  rec:'No conviene con un solo día: lo del itinerario suma ~€28 contra €32. Solo se paga si agregan el Museo Arqueológico, y no les da el tiempo.'},

 {id:'atenas', city:'Atenas', when:'3 al 5 feb', st:3, ppl:4, cur:'€',
  name:'Pase turístico de transporte 3 días', url:'https://www.stasy.gr',
  what:'Todo el transporte de Atenas por 3 días, con el metro de ida y vuelta al aeropuerto incluido.',
  opts:[['3 días', 20]],
  items:[
   {n:'Metro del aeropuerto a Syntagma', p:9, day:'3 feb'},
   {n:'Metro de Syntagma al aeropuerto', p:9, day:'5 feb'},
   {n:'Viajes en la ciudad (~4: Licabeto, Monastiraki)', p:1.2, q:4, day:'3–5 feb'}],
  no:'Entradas. La entrada combinada oficial a los sitios arqueológicos se eliminó en abril de 2025: se compran por separado en hhticket.gr.',
  rec:'Conviene: cuesta menos que los dos viajes al aeropuerto más unos pocos en la ciudad, y no tienen que comprar boletos cada vez.'},

 {id:'lisboa', city:'Lisboa', when:'6 y 7 feb', st:3, ppl:4, cur:'€',
  name:'Lisboa Card', url:'https://www.visitlisboa.com',
  what:'Transporte ilimitado (metro, tranvías, elevadores y trenes a Sintra y Cascais) y entrada gratis a los Jerónimos y otros museos.',
  opts:[['24 h', 31], ['48 h', 51], ['72 h', 62]], def:1,
  items:[
   {n:'Monasterio de los Jerónimos', p:18, day:'6 feb'},
   {n:'Transporte 2 días (pase Carris y metro de 24 h)', p:7.25, q:2, day:'6–7 feb', note:'Incluye tranvías 15 y 28 y el Elevador de Santa Justa.'},
   {n:'Torre de Belém', p:12, day:'6 feb (exterior)', on:false, note:'Puede seguir cerrada por obras: confirmen.'},
   {n:'Tren a Sintra, ida y vuelta', p:2.4, q:2, day:''},
   {n:'Museo Nacional del Azulejo', p:8, day:''},
   {n:'Museo Nacional de Carruajes', p:8, day:''}],
  no:'Castillo de San Jorge ni Pastéis de Belém.',
  rec:'No conviene: con los Jerónimos y el transporte suman ~€33 contra €51. Mejor el pase Carris y metro de 24 h (€7,25 al día) y la entrada de los Jerónimos aparte.'}
];
