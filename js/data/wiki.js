// Qué artículo de Wikipedia corresponde a cada lugar, y qué fotos buscar para cada ciudad.

export const WIKI = {
 'Puerta del Sol y Plaza Mayor':'Puerta del Sol','Chocolate con churros en San Ginés':'Chocolatería San Ginés','Chocolatería San Ginés':'Chocolatería San Ginés',
 'Parque del Retiro':'Parque del Retiro','Palacio de Cristal':'Palacio de Cristal del Retiro','Puerta de Alcalá':'Puerta de Alcalá','Cibeles':'Fuente de Cibeles',
 'Gran Vía':'Gran Vía (Madrid)','Tour Estadio Bernabéu':'Estadio Santiago Bernabéu','Barrio de las Letras':'Barrio de las Letras',
 'Barrio Gótico':'Barrio Gótico de Barcelona','Catedral de Barcelona':'Catedral de Barcelona','El Born y Santa María del Mar':'Santa María del Mar','Santa María del Mar':'Santa María del Mar',
 'Las Ramblas':'La Rambla de Barcelona','La Boquería':'Mercado de La Boquería','Casa Batlló':'Casa Batlló','La Pedrera':'Casa Milà','Paseo de Gracia':'Paseo de Gracia',
 'Mirador Bunkers del Carmel':'Turó de la Rovira','Bunkers del Carmel':'Turó de la Rovira','Barceloneta':'La Barceloneta','Teleférico de Montjuïc':'Teleférico de Montjuïc',
 'Paseo nocturno por Le Marais':'Le Marais','Place des Vosges':'Plaza de los Vosgos','Notre-Dame':'Catedral de Notre Dame de París','Sainte-Chapelle':'Sainte-Chapelle',
 'Torre Eiffel':'Torre Eiffel','Crucero por el Sena':'Sena','Museo del Louvre':'Museo del Louvre','Jardín de las Tullerías':'Jardín de las Tullerías','Plaza de la Concordia':'Plaza de la Concordia',
 'Campos Elíseos':'Campos Elíseos','Terraza del Arco del Triunfo':'Arco de Triunfo de París','Arco del Triunfo':'Arco de Triunfo de París','Montmartre':'Basílica del Sacré Cœur',
 'Lindt Home of Chocolate':'Lindt & Sprüngli','Puente de la Capilla':'Kapellbrücke','Casco antiguo y Monumento del León':'Monumento al León de Lucerna','Monumento del León':'Monumento al León de Lucerna',
 'Monte Rigi':'Rigi','Rigi Kulm':'Rigi','Vitznau':'Vitznau','Monte Titlis':'Titlis','Puente colgante Titlis':'Titlis','Engelberg':'Engelberg','Trübsee':'Titlis',
 'Casco antiguo de Chur':'Coira','Catedral de Chur':'Catedral de Coira','Viaducto de Brusio':'Viaducto helicoidal de Brusio','Glaciar Morteratsch':'Glaciar Morteratsch','Tirano':'Tirano',
 'Duomo y sus terrazas':'Catedral de Milán','Duomo':'Catedral de Milán','Galería Vittorio Emanuele II':'Galería Vittorio Emanuele II','La Última Cena':'La última cena (Leonardo da Vinci)','Navigli':'Navigli',
 'Gran Canal':'Gran Canal de Venecia','Plaza y Basílica de San Marcos':'Basílica de San Marcos','Plaza San Marcos':'Plaza de San Marcos','Puente de Rialto':'Puente de Rialto',
 'Palacio Ducal':'Palacio Ducal de Venecia','Islas de Murano y Burano':'Murano','Murano':'Murano','Burano':'Burano',
 'Duomo, Campanario y Baptisterio':'Catedral de Santa María del Fiore','Ponte Vecchio':'Ponte Vecchio','Piazzale Michelangelo':'Piazzale Michelangelo',
 'Galería Uffizi':'Galería Uffizi','Galería de la Academia':'Galería de la Academia de Florencia','Mercado Central':'Mercado Central de Florencia',
 'Plaza de los Milagros':'Torre de Pisa','Torre de Pisa':'Torre de Pisa','Murallas de Lucca':'Murallas de Lucca',
 'Fontana di Trevi':'Fontana di Trevi','Panteón':'Panteón de Agripa','Plaza Navona':'Plaza Navona','Coliseo':'Coliseo','Palatino':'Monte Palatino','Foro Romano':'Foro Romano','Circo Máximo':'Circo Máximo',
 'Museos Vaticanos':'Museos Vaticanos','Basílica de San Pedro':'Basílica de San Pedro',"Castel Sant'Angelo":"Castillo Sant'Angelo",'Trastevere':'Trastevere','Galería Borghese':'Galería Borghese','Mirador del Gianicolo':'Janículo',
 'Spaccanapoli':'Spaccanapoli','San Gregorio Armeno':'San Gregorio Armeno (Nápoles)','Capilla Sansevero':'Capilla Sansevero','Parque arqueológico de Pompeya':'Pompeya','Pompeya':'Pompeya',
 "Paseo marítimo y Castel dell'Ovo":"Castel dell'Ovo","Castel dell'Ovo":"Castel dell'Ovo",'Paseo marítimo':'Nápoles',
 'Barrio de Plaka':'Plaka','Anafiotika':'Anafiotika','Acrópolis':'Acrópolis de Atenas','Museo de la Acrópolis':'Nuevo Museo de la Acrópolis','Cambio de guardia':'Evzones','Plaza Syntagma':'Plaza Syntagma',
 'Santuario y museo de Delfos':'Delfos','Delfos':'Delfos','Pueblo de montaña de Arachova':'Arájova','Arachova':'Arájova',
 'Alfama':'Alfama','Miradouro de Santa Luzia':'Mirador de Santa Lucía','Catedral (Sé)':'Catedral de Lisboa','Monasterio de los Jerónimos':'Monasterio de los Jerónimos de Belém',
 'Torre de Belém':'Torre de Belém','Pastéis de Belém':'Pastel de nata','Tranvía 28':'Tranvía de Lisboa',
 'Catedral Primada':'Catedral de Toledo','Sinagoga de Santa María la Blanca':'Sinagoga de Santa María la Blanca','Miradores sobre el río Tajo':'Toledo','Mirador del Valle':'Toledo'
};

// Fotos reales de cada lugar (Wikipedia en inglés / Wikimedia Commons, licencias libres).
// Varias opciones por lugar: se usa la primera que tenga foto.
export const PHOTO = {
  madrid:['Puerta de Alcalá'], barcelona:['Sagrada Família'], paris:['Eiffel Tower'],
  zurich:['Grossmünster'], lucerna:['Kapellbrücke','Lucerne'], chur:['Brusio spiral viaduct','Bernina Express','Bernina railway'],
  milan:['Milan Cathedral'], venecia:['Grand Canal (Venice)','Venice'], florencia:['Florence Cathedral'],
  pisa:['Leaning Tower of Pisa'], roma:['Colosseum'], napoles:['Gulf of Naples','Naples'],
  pompeya:['Pompeii'], atenas:['Parthenon'], delfos:['Delphi'], lisboa:['Trams in Lisbon','Lisbon'],
  toledo:['Alcázar of Toledo','Toledo, Spain']
};
