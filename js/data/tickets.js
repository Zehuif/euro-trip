// Enlaces oficiales: entradas por lugar, pasajes por tramo y dónde comprar las entradas obligatorias.

export const TICKETS = [
 ['Palacio Real',[['Entradas','https://www.patrimonionacional.es']]],
 ['Museo del Prado',[['Entradas','https://www.museodelprado.es']]],
 ['Museo Reina Sofía',[['Entradas','https://www.museoreinasofia.es']]],
 ['Barrio Gótico y Catedral',[['Catedral','https://catedralbcn.org']]],
 ['Sagrada Familia',[['Entradas','https://sagradafamilia.org']]],
 ['Casa Batlló o La Pedrera',[['Casa Batlló','https://www.casabatllo.es'],['La Pedrera','https://www.lapedrera.com']]],
 ['Park Güell',[['Entradas','https://parkguell.barcelona']]],
 ['Teleférico de Montjuïc',[['Pasajes','https://www.telefericodemontjuic.cat']]],
 ['Notre-Dame',[['Reservar hora','https://www.notredamedeparis.fr']]],
 ['Sainte-Chapelle',[['Entradas','https://www.sainte-chapelle.fr']]],
 ['Torre Eiffel',[['Entradas','https://www.toureiffel.paris']]],
 ['Museo del Louvre',[['Entradas','https://www.louvre.fr']]],
 ['Terraza del Arco del Triunfo',[['Entradas','https://www.paris-arc-de-triomphe.fr']]],
 ['Lindt Home of Chocolate',[['Entradas','https://www.lindt-home-of-chocolate.com']]],
 ['Monte Rigi',[['Rigi','https://www.rigi.ch']]],
 ['Barco por el lago',[['Barcos','https://www.lakelucerne.ch']]],
 ['Monte Titlis',[['Titlis','https://www.titlis.ch']]],
 ['Reserva de asiento en el Bernina Express',[['Reservar','https://www.rhb.ch']]],
 ['Duomo y sus terrazas',[['Entradas','https://www.duomomilano.it']]],
 ['La Última Cena',[['Entradas','https://cenacolovinciano.org']]],
 ['Pase de vaporetto',[['Comprar pase','https://www.veneziaunica.it']]],
 ['Plaza y Basílica de San Marcos',[['Basílica','https://www.basilicasanmarco.it']]],
 ['Palacio Ducal',[['Entradas','https://palazzoducale.visitmuve.it']]],
 ['Duomo, Campanario',[['Entradas','https://duomo.firenze.it']]],
 ['Galería Uffizi',[['Entradas','https://www.uffizi.it']]],
 ['Galería de la Academia',[['Entradas','https://www.galleriaaccademiafirenze.it']]],
 ['Plaza de los Milagros',[['Subir a la torre','https://www.opapisa.it']]],
 ['Coliseo',[['Entradas','https://colosseo.it']]],
 ['Museos Vaticanos',[['Entradas','https://www.museivaticani.va']]],
 ['Galería Borghese',[['Entradas','https://galleriaborghese.beniculturali.it']]],
 ['Capilla Sansevero',[['Entradas','https://www.museosansevero.it']]],
 ['Parque arqueológico de Pompeya',[['Entradas','https://www.pompeiisites.org']]],
 ['Acrópolis',[['Entradas','https://hhticket.gr']]],
 ['Museo de la Acrópolis',[['Entradas','https://www.theacropolismuseum.gr']]],
 ['Tranvía 28',[['Carris','https://www.carris.pt']]],
 ['Catedral Primada',[['Entradas','https://catedralprimada.es']]]
];
export const NOMAP = /^(Llegada|Mañana|Tarde|Cena|Almuerzo|Desayuno|Reserva de asiento|Pase de|Paseo en góndola|Alternativa|Pizza|Barco por|Viaducto circular)/;
const FLY = ['Google Flights','https://www.google.com/travel/flights'];
const IT_TRAIN = [['Trenitalia','https://www.trenitalia.com'],['Italo','https://www.italotreno.com']];
export const BUY = {
 'Madrid → Barcelona':[['Renfe','https://www.renfe.com'],['Iryo','https://iryo.eu'],['Ouigo','https://www.ouigo.com/es']],
 'Barcelona → París':[['SNCF Connect','https://www.sncf-connect.com']],
 'París → Zúrich → Kilchberg → Lucerna':[['TGV Lyria','https://www.tgv-lyria.com'],['SBB (trenes en Suiza)','https://www.sbb.ch']],
 'Lucerna ⇄ Rigi':[['Swiss Travel Pass (SBB)','https://www.sbb.ch'],['Rigi','https://www.rigi.ch'],['Barcos del lago','https://www.lakelucerne.ch']],
 'Lucerna ⇄ Engelberg y Titlis':[['Titlis','https://www.titlis.ch'],['SBB','https://www.sbb.ch']],
 'Lucerna → Chur':[['SBB','https://www.sbb.ch']],
 'Chur → Tirano → Milán':[['Bernina Express (RhB)','https://www.rhb.ch'],['Trenord','https://www.trenord.it']],
 'Milán → Venecia':IT_TRAIN, 'Venecia → Florencia':IT_TRAIN, 'Florencia → Roma':IT_TRAIN, 'Roma → Nápoles':IT_TRAIN,
 'Florencia ⇄ Pisa y Lucca':[['Trenitalia','https://www.trenitalia.com']],
 'Roma Termini → Fiumicino':[['Leonardo Express (Trenitalia)','https://www.trenitalia.com']],
 'Nápoles ⇄ Pompeya':[['EAV Circumvesuviana','https://www.eavsrl.it']],
 'Nápoles → Atenas':[['Aegean','https://www.aegeanair.com'],['Volotea','https://www.volotea.com'],FLY],
 'Atenas → Lisboa':[['TAP','https://www.flytap.com'],['Aegean','https://www.aegeanair.com'],FLY],
 'Lisboa → Madrid':[['Air Europa','https://www.aireuropa.com']],
 'Madrid ⇄ Toledo':[['Renfe (Avant)','https://www.renfe.com']]
};

export const SITES = {
 'Sagrada Familia':['sagradafamilia.org','1 a 2 meses antes'],
 'Park Güell':['parkguell.barcelona','2 a 4 semanas antes'],
 'Museo del Louvre':['louvre.fr','1 a 2 meses antes (horario obligatorio)'],
 'Reserva de asiento en el Bernina Express':['rhb.ch','Apenas abra la venta'],
 'La Última Cena':['cenacolovinciano.org','Ya: se agota con meses'],
 'Coliseo':['colosseo.it','Apenas se publique la fecha (~1 mes)'],
 'Museos Vaticanos':['museivaticani.va','1 a 2 meses antes'],
 'Galería Borghese':['galleriaborghese.beniculturali.it','1 mes antes'],
 'Acrópolis':['hhticket.gr','1 a 2 semanas antes (horario obligatorio)']
};
export const siteFor = name => { const k = Object.keys(SITES).find(k => name.startsWith(k)); return k ? SITES[k] : ['sitio oficial','con anticipación']; };
