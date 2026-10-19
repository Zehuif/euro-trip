// Reservas reales de trenes, vuelos, entradas y extras (el alojamiento está en js/data/lodging.js), y tipos de cambio.
// {st: etapa, date: fecha, what: qué es, amt: monto total, cur: moneda, ppl: personas, paid: pagado, cancel: cancelación gratis hasta, by: quién pagó,
//  lodging: true = es alojamiento (se suma al alojamiento del presupuesto)}

// Unidades de cada moneda por 1 euro. Actualícenlas cuando quieran: el presupuesto se recalcula solo.
export const RATES = {EUR:1, USD:1.12, CLP:1115};
export const RATES_DATE = 'mediados de octubre de 2026 (BCE: €1 = USD 1,12; €1 ≈ CLP 1.115)';

export const toEUR = (amt, cur) => amt / RATES[cur];

// Monto en su moneda original: USD 165, CLP 875.541, €901
export const money = (amt, cur) => (cur === 'EUR' ? '€' : cur + ' ')
  + amt.toLocaleString('es-CL', {maximumFractionDigits: cur === 'CLP' ? 0 : 2});

export const BOOKINGS = [
 {st:1, date:'13 ene', what:'Tren Madrid Atocha → Barcelona Sants, 8:49 a 12:16', amt:165, cur:'USD', ppl:6, paid:true, by:'Zehui F.'},
 {st:1, date:'14 ene', what:'Sagrada Familia, entrada de las 9:00', amt:239, cur:'USD', ppl:6, paid:true, by:'Zehui F.'},
 {st:1, date:'16 ene', what:'Tren Barcelona Sants → Paris Gare de Lyon, 9:20 a 16:19', amt:551, cur:'USD', ppl:6, paid:true, by:'Zehui F.'},
 {st:2, date:'16 ene', what:'Cui: noche en el NH Madrid Zurbano (calle de Zurbano 79–81)', amt:139.68, cur:'USD', ppl:1, paid:true, by:'Cui', lodging:true},
 {st:2, date:'17 ene', what:'Cui: vuelo Air Europa UX1029 Madrid → París Orly, 14:25 a 16:20', amt:71, cur:'USD', ppl:1, paid:true, by:'Cui'},
 {st:2, date:'20 ene', what:'Tren Paris Gare de Lyon → Zürich HB, 7:20 a 11:30', amt:228, cur:'USD', ppl:7, paid:true, by:'Zehui F.'},
 {st:2, date:'23 ene', what:'Bernina Express Chur → Tirano, 8:17 a 12:50 (reserva de asiento)', amt:338, cur:'USD', ppl:7, paid:true, by:'Zehui F.'},
 {st:3, date:'3 feb', what:'Vuelo Aegean A3681 Nápoles → Atenas, 10:00 a 12:45', amt:335.69, cur:'USD', ppl:4, paid:true, by:'Cui'},
 {st:3, date:'5 feb', what:'Vuelo Sky Express GQ922 Atenas → Lisboa, 20:00 a 22:30', amt:351.82, cur:'USD', ppl:4, paid:true, by:'Cui'},
 {st:3, date:'8 feb', what:'Vuelo TAP TP1012 Lisboa → Madrid, 8:55 a 11:20', amt:186.94, cur:'USD', ppl:4, paid:true, by:'Cui'}
];
