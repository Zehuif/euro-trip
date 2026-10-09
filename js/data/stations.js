// Estaciones, aeropuertos y puntos de salida/llegada de los traslados (js/data/days.js: move.from, move.to, move.via).
// [nombre visible, búsqueda en Google Maps]
export const STATIONS = {
  // España
  barajas:   ['Aeropuerto Madrid-Barajas', 'Aeropuerto Adolfo Suárez Madrid-Barajas'],
  sol:       ['Puerta del Sol (alojamiento)', 'Puerta del Sol, Madrid'],
  letras:    ['Barrio de las Letras (alojamiento)', 'Barrio de las Letras, Madrid'],
  atocha:    ['Madrid Puerta de Atocha', 'Estación de Madrid Puerta de Atocha-Almudena Grandes'],
  sants:     ['Barcelona Sants', 'Estación de Barcelona Sants'],
  toledo:    ['Estación de Toledo', 'Estación de tren de Toledo'],
  // Francia y Suiza
  gareLyon:  ['Paris Gare de Lyon', 'Gare de Lyon, Paris'],
  zurichHB:  ['Zürich HB', 'Zürich Hauptbahnhof'],
  kilchberg: ['Kilchberg (Lindt Home of Chocolate)', 'Bahnhof Kilchberg ZH'],
  luzern:    ['Luzern (estación)', 'Bahnhof Luzern'],
  luzernPier:['Muelle de Lucerna (Bahnhofquai)', 'Luzern Bahnhofquai Schiffstation'],
  rigi:      ['Rigi Kulm', 'Bahnhof Rigi Kulm'],
  engelberg: ['Engelberg (estación)', 'Bahnhof Engelberg'],
  titlis:    ['Titlis (estación de montaña)', 'Titlis Bergstation'],
  chur:      ['Chur (estación)', 'Bahnhof Chur'],
  // Italia
  tirano:    ['Tirano (estación)', 'Stazione di Tirano'],
  milano:    ['Milano Centrale', 'Stazione di Milano Centrale'],
  venezia:   ['Venezia Santa Lucia', 'Stazione di Venezia Santa Lucia'],
  firenze:   ['Firenze Santa Maria Novella', 'Stazione di Firenze Santa Maria Novella'],
  pisa:      ['Pisa Centrale', 'Stazione di Pisa Centrale'],
  lucca:     ['Lucca (estación)', 'Stazione di Lucca'],
  termini:   ['Roma Termini', 'Stazione di Roma Termini'],
  fiumicino: ['Fiumicino Aeroporto', 'Stazione Fiumicino Aeroporto'],
  napoli:    ['Napoli Centrale', 'Stazione di Napoli Centrale'],
  garibaldi: ['Napoli Garibaldi (Circumvesuviana)', 'Stazione Circumvesuviana Napoli Garibaldi'],
  pompei:    ['Pompei Scavi – Villa dei Misteri', 'Stazione Pompei Scavi Villa dei Misteri'],
  napAir:    ['Aeropuerto de Nápoles-Capodichino', 'Aeroporto di Napoli-Capodichino'],
  // Grecia y Portugal
  athAir:    ['Aeropuerto de Atenas', 'Aeropuerto Internacional de Atenas Eleftherios Venizelos'],
  liosion:   ['Terminal de buses KTEL Liosion', 'KTEL Liosion Bus Terminal, Athens'],
  delfos:    ['Delfos (sitio arqueológico)', 'Sitio arqueológico de Delfos'],
  lisAir:    ['Aeropuerto de Lisboa', 'Aeropuerto Humberto Delgado, Lisboa']
};

export const stationURL = k => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(STATIONS[k][1]);
