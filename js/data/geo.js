// Geografía del viaje: posición de cada ciudad en el mapa SVG (PT) y en el mapa real (LL),
// la ruta de cada día y las paradas de la franja «La ruta» en la portada.

export const PT = {"madrid":[223.8,406.2],"toledo":[213.3,422.9],"barcelona":[370.8,389.9],"paris":[391.6,147.5],"zurich":[525,199.8],"lucerna":[519.9,210.5],"chur":[547.2,216.7],"tirano":[561.9,237.1],"milan":[540.2,262],"venecia":[611.6,260.4],"florencia":[589.5,315.8],"pisa":[569.5,318],"lucca":[571.7,314.1],"roma":[621.8,375.1],"napoles":[667.2,406.5],"pompeya":[673.1,409.5],"atenas":[915.4,467.9],"lisboa":[79.9,437.2]};
export const LL = {madrid:[40.4168,-3.7038],toledo:[39.8628,-4.0273],barcelona:[41.3874,2.1686],paris:[48.8566,2.3522],zurich:[47.3769,8.5417],lucerna:[47.0502,8.3093],chur:[46.8508,9.5320],tirano:[46.2160,10.1680],milan:[45.4642,9.1900],venecia:[45.4408,12.3155],florencia:[43.7696,11.2558],pisa:[43.7228,10.4017],lucca:[43.8429,10.5027],roma:[41.9028,12.4964],napoles:[40.8518,14.2681],pompeya:[40.7462,14.4989],atenas:[37.9838,23.7275],lisboa:[38.7223,-9.1393]};
export const NAMES = {madrid:'Madrid',toledo:'Toledo',barcelona:'Barcelona',paris:'París',zurich:'Zúrich',lucerna:'Lucerna',chur:'Chur',tirano:'Tirano',milan:'Milán',venecia:'Venecia',florencia:'Florencia',pisa:'Pisa',lucca:'Lucca',roma:'Roma',napoles:'Nápoles',pompeya:'Pompeya',atenas:'Atenas',lisboa:'Lisboa'};
export const MAIN = ['madrid','barcelona','paris','zurich','milan','venecia','florencia','roma','napoles','atenas','lisboa'];
// Ruta de cada día. p: ciudades en orden; m: modo ("l" = día en la ciudad, "t" = tren, "f" = avión, o un modo por tramo)
export const DAY_ROUTES = [
 {p:['madrid'],m:'l'},{p:['madrid'],m:'l'},{p:['madrid'],m:'l'},{p:['madrid'],m:'l'},
 {p:['madrid','barcelona'],m:'t'},{p:['barcelona'],m:'l'},{p:['barcelona'],m:'l'},
 {p:['barcelona','paris'],m:'t'},{p:['paris'],m:'l'},{p:['paris'],m:'l'},
 {p:['paris','zurich','lucerna'],m:'t'},{p:['lucerna'],m:'l'},{p:['lucerna'],m:'l'},
 {p:['lucerna','chur'],m:'t'},{p:['chur','tirano','milan'],m:'t'},{p:['milan'],m:'l'},
 {p:['milan','venecia'],m:'t'},{p:['venecia'],m:'l'},{p:['venecia','florencia'],m:'t'},{p:['florencia'],m:'l'},
 {p:['florencia','pisa','lucca','florencia'],m:'t'},{p:['florencia','roma'],m:'t'},{p:['roma'],m:'l'},{p:['roma'],m:'l'},
 {p:['roma','napoles'],m:'t'},{p:['napoles','pompeya','napoles'],m:'t'},{p:['napoles','atenas'],m:'f'},{p:['atenas'],m:'l'},
 {p:['atenas'],m:'l'},{p:['atenas','lisboa'],m:'f'},{p:['lisboa','madrid'],m:'f'},{p:['madrid','toledo','madrid'],m:'t'},
 {p:['madrid'],m:'l'}
];

// Franja «La ruta»: [ciudad, noches, etapa]
export const ROUTE_STOPS = [
  ['Madrid',4,1],['Barcelona',3,1],['París',3,1],['Zúrich',0,2],['Lucerna',3,2],['Chur',1,2],
  ['Milán',2,2],['Venecia',2,2],['Florencia',3,2],['Roma',3,2],['Nápoles',2,3],['Atenas',3,3],['Lisboa',1,3],['Madrid',2,3]
];
// segment stage + mode (from stop i to i+1)
export const ROUTE_SEGMENTS = [[1,'t'],[1,'t'],[2,'t'],[2,'t'],[2,'t'],[2,'t'],[2,'t'],[2,'t'],[2,'t'],[3,'t'],[3,'f'],[3,'f'],[3,'f']];
export const STAGE_WIDTH = {1:9,2:11,3:6};
