/* =============================================================================
   andyalbarracin.com — CMS data layer (prototype)
   -----------------------------------------------------------------------------
   Mock, CMS-shaped content + a localStorage-backed store so that edits made in
   /dashboard flow through to the public pages. Structured to make a future
   Supabase (Auth + Postgres + Storage + RLS) migration a drop-in: swap the
   sync body of each service function for an async Supabase query.

   Consume from a DC logic class:
     const db = await import('./data.js');
     this.setState({ posts: db.getPosts() });

   @typedef {Object} MediaAsset
   @property {string} id @property {string} url @property {string} filename
   @property {string} alt @property {string} caption @property {string} type
   @property {number} size @property {string} createdAt @property {string[]} usedIn

   @typedef {Object} SEOFields
   @property {string} title @property {string} description @property {string} ogImage
   @property {string} [canonical] @property {string} [twitterImage]

   @typedef {Object} LocationFields
   @property {string} name @property {string} country @property {string} city
   @property {string} [coordinates] @property {string} [from] @property {string} [to]

   @typedef {Object} ContentBlock  // type ∈ paragraph|heading|quote|image|gallery|
     video|callout|route|divider|handwritten|feature|metric|stack|links

   @typedef {Object} Post
   @property {string} id @property {string} title @property {string} slug
   @property {string} [subtitle] @property {string} [excerpt] @property {string} category
   @property {"cronica"|"ensayo"|"video"|"reflexion"|"proyecto"} type
   @property {"draft"|"published"|"archived"} status
   @property {"public"|"private"|"hidden"} visibility @property {boolean} featured
   @property {string} heroImage @property {string[]} gallery
   @property {ContentBlock[]} bodyBlocks @property {SEOFields} seo
   @property {LocationFields} [location] @property {string} [publishedAt]
   @property {number} [readingTime] @property {string[]} [related]

   @typedef {Object} Project
   @property {string} id @property {string} title @property {string} slug
   @property {string} [subtitle] @property {string} shortDescription @property {string} [longDescription]
   @property {string} type @property {"active"|"building"|"paused"|"archived"|"draft"} status
   @property {"public"|"private"|"hidden"} visibility @property {boolean} sensitive @property {boolean} featured
   @property {string} heroImage @property {string[]} gallery @property {string[]} tags
   @property {string[]} technologies @property {{label:string,url:string}[]} links
   @property {string} [role] @property {string} [timeline]
   @property {ContentBlock[]} blocks @property {SEOFields} seo
   ============================================================================= */

const STORE_KEY = 'aa_cms_v1';

/* ----- image map (real generated placeholders under images/) --------------- */
export const IMAGES = {
  heroPortrait:  'images/portrait-andy.png',
  airportHero:   'images/airport-hero.png',
  cuadernoNotebook: 'images/notebook.png',
  travelMountain:'images/mountains.png',
  zaireWorkspace:'images/workspace.png',
  cityWindow:    'images/city-window.png',
  greekSculpture:'images/greek-sculpture.png',
  boardingArea:  'images/boarding-area.png',
  airplaneWing:  'images/airplane-wing.png',
  filmStill:     'images/film-still.png',
  training:      'images/training.png',
  coffee:        'images/coffee.png',
  articleSilencio:'images/article-silencio.png',
  articleRutinas: 'images/article-rutinas.png',
  articleCaminar: 'images/article-caminar.png',
  articleSistemas:'images/article-sistemas.png',
  articleAeropuerto:'images/article-aeropuerto.png',
  projectZaire:  'images/project-zaire.png',
  projectCondor: 'images/project-condor.png',
  projectWoditos:'images/project-woditos.png',
  projectSupersonic:'images/project-supersonic.png',
  projectGeu:    'images/project-geu.png',
  projectElva:   'images/project-elva.png',
};

/* ----- media library (20 assets) ------------------------------------------- */
const MEDIA = [
  ['m-portrait','heroPortrait','portrait-andy.png','Retrato artístico de Andy Albarracín','Retrato · archivo personal','portrait',412,['home','sobre-mi']],
  ['m-airport','airportHero','airport-hero.png','Terminal de aeropuerto al amanecer','Terminal CDG · 06:14','landscape',688,['home']],
  ['m-notebook','cuadernoNotebook','notebook.png','Cuaderno con notas manuscritas','Cuaderno · 35mm','landscape',402,['home','cuaderno']],
  ['m-mountain','travelMountain','mountains.png','Cordillera al atardecer','Andes · 4200m','landscape',455,['home','cuaderno','proyectos']],
  ['m-workspace','zaireWorkspace','workspace.png','Estación de edición de video','Studio · 02:14','landscape',498,['home','proyectos']],
  ['m-city','cityWindow','city-window.png','Ciudad al anochecer desde una ventana','Ciudad · 18:40','landscape',473,['home','ahora']],
  ['m-greek','greekSculpture','greek-sculpture.png','Escultura clásica en mármol','Mármol · archivo','portrait',389,['sobre-mi']],
  ['m-boarding','boardingArea','boarding-area.png','Sala de embarque','Gate · A16','landscape',444,['cuaderno']],
  ['m-wing','airplaneWing','airplane-wing.png','Ala de avión sobre las nubes','11.000m · 35mm','landscape',421,['home']],
  ['m-film','filmStill','film-still.png','Figura caminando en un pasillo','Pasillo · 35mm','landscape',430,['home']],
  ['m-training','training','training.png','Entrenamiento al amanecer','Disciplina · 05:30','landscape',410,['cuaderno']],
  ['m-coffee','coffee','coffee.png','Taza de café sobre una mesa','BUE · pausa','landscape',388,['home']],
  ['m-a-silencio','articleSilencio','article-silencio.png','Montaña en silencio, Colombia','Montaña · Colombia','landscape',512,['post:lecciones-desde-el-silencio']],
  ['m-a-rutinas','articleRutinas','article-rutinas.png','Amanecer y disciplina','The Rise Plan','landscape',476,['post:rutinas-que-construyen-caracter']],
  ['m-a-caminar','articleCaminar','article-caminar.png','Caminata al amanecer','Camino · 06:40','landscape',468,['post:caminar-para-mirar-mejor']],
  ['m-a-sistemas','articleSistemas','article-sistemas.png','Pantallas y sistemas','Sistemas · 02:14','landscape',489,['post:ideas-que-se-convierten-en-sistemas']],
  ['m-p-zaire','projectZaire','project-zaire.png','Paisaje de África Central','África Central · 6K','landscape',702,['project:zaire']],
  ['m-p-condor','projectCondor','project-condor.png','Vuelo sobre los Andes','Cóndor · Andes','landscape',655,['project:condor']],
  ['m-p-woditos','projectWoditos','project-woditos.png','Interfaz de producto','Woditos · producto','landscape',540,['project:woditos']],
  ['m-p-supersonic','projectSupersonic','project-supersonic.png','Interfaz de movimiento','Yendo · Supersonic','landscape',548,['project:supersonic-yendo']],
].map(([id,key,filename,alt,caption,type,size,usedIn])=>({
  id, url: IMAGES[key], filename, alt, caption, type, size,
  createdAt:'2026-03-01T10:00:00Z', usedIn
}));

/* ----- helpers ------------------------------------------------------------- */
const seo = (title, description, ogImage) => ({ title, description, ogImage, canonical:'', twitterImage:ogImage });
const P = (text) => ({ type:'paragraph', text });
const H = (text, level=2) => ({ type:'heading', text, level });
const Q = (text, cite) => ({ type:'quote', text, cite });
const IMG = (url, caption) => ({ type:'image', url, caption });
const GAL = (urls) => ({ type:'gallery', urls });
const VID = (url, caption) => ({ type:'video', url, caption });
const CALL = (text) => ({ type:'callout', text });
const ROUTE = (from, to, meta) => ({ type:'route', from, to, meta });
const HR = () => ({ type:'divider' });
const HAND = (text) => ({ type:'handwritten', text });

/* ----- posts (8) ----------------------------------------------------------- */
const POSTS = [
  {
    id:'p1', title:'Lecciones desde el silencio', slug:'lecciones-desde-el-silencio',
    subtitle:'Lo que aprendí subiendo una montaña sin señal.',
    excerpt:'Tres días sin conexión en la cordillera colombiana. Lo que el silencio ordenó en mi cabeza.',
    category:'Gente que viaja', type:'cronica', status:'published', visibility:'public', featured:true,
    heroImage:IMAGES.articleSilencio, gallery:[IMAGES.travelMountain, IMAGES.filmStill],
    location:{ name:'Cordillera Central', country:'Colombia', city:'Salento', coordinates:'4.6376° N, 75.5700° W', from:'BOG', to:'PEI' },
    readingTime:6, publishedAt:'2026-05-04', related:['p3','p2'],
    bodyBlocks:[
      P('Hay un tipo de silencio que solo existe por encima de los 3.000 metros. No es la ausencia de ruido; es la presencia de todo lo demás.'),
      H('El primer día no pasa nada'),
      P('Subir es aburrido cuando estás acostumbrado a las notificaciones. El cuerpo protesta, la mente busca su dosis de distracción y no la encuentra.'),
      IMG(IMAGES.travelMountain,'Amanecer sobre la cordillera, día dos.'),
      Q('No se trata de llegar primero, sino de ver más en el camino.','A.A.'),
      P('Al segundo día, algo cede. Las ideas dejan de competir por atención y empiezan a ordenarse solas.'),
      ROUTE('BOG','PEI',{ fecha:'02 MAY', altura:'4200M', sec:'0118' }),
      HAND('el silencio también documenta.'),
      P('Bajé con menos fotos y más claridad. Ese fue el intercambio, y valió la pena.'),
    ],
    seo:seo('Lecciones desde el silencio — Cuaderno','Una crónica de tres días sin señal en la cordillera colombiana.',IMAGES.articleSilencio),
  },
  {
    id:'p2', title:'Rutinas que construyen carácter', slug:'rutinas-que-construyen-caracter',
    subtitle:'La disciplina como forma de libertad.',
    excerpt:'Por qué las decisiones pequeñas y repetidas importan más que los grandes gestos.',
    category:'The Rise Plan', type:'ensayo', status:'published', visibility:'public', featured:false,
    heroImage:IMAGES.articleRutinas, gallery:[IMAGES.training],
    readingTime:8, publishedAt:'2026-04-22', related:['p4','p1'],
    bodyBlocks:[
      P('El carácter no se construye en los momentos épicos. Se construye a las 5:30 de la mañana, cuando nadie mira.'),
      H('La libertad está en la estructura'),
      P('Parece una contradicción, pero la disciplina no limita: libera. Cuando las decisiones básicas ya están tomadas, la energía queda para lo que importa.'),
      CALL('Menos, pero mejor. Editar la vida como se edita un proyecto.'),
      IMG(IMAGES.training,'Entrenamiento antes del amanecer.'),
      P('The Rise Plan no es un método; es una forma de mirar. Constancia sobre intensidad, dirección sobre velocidad.'),
    ],
    seo:seo('Rutinas que construyen carácter — Cuaderno','Un ensayo sobre disciplina, constancia y dirección creativa.',IMAGES.articleRutinas),
  },
  {
    id:'p3', title:'Caminar para mirar mejor', slug:'caminar-para-mirar-mejor',
    subtitle:'Una crónica sobre el ritmo del pie y el ojo.',
    excerpt:'Caminar sin destino como método creativo. Lo que se ve cuando no se busca nada.',
    category:'Gente que viaja', type:'cronica', status:'published', visibility:'public', featured:false,
    heroImage:IMAGES.articleCaminar, gallery:[IMAGES.cityWindow, IMAGES.coffee],
    location:{ name:'Centro Histórico', country:'México', city:'Ciudad de México', from:'CDG', to:'MEX' },
    readingTime:5, publishedAt:'2026-04-09', related:['p1','p5'],
    bodyBlocks:[
      P('Camino sin destino al menos una vez por semana. Es el hábito más productivo que tengo, precisamente porque no busca ser productivo.'),
      Q('Ver el mundo, afrontar peligros, acercarse a los demás, encontrarse y sentir.','Walter Mitty'),
      IMG(IMAGES.cityWindow,'Ciudad de México al anochecer.'),
      P('El ojo se afina cuando el pie marca el ritmo. Las ideas llegan de lado, nunca de frente.'),
      HAND('caminar es una forma de pensar.'),
    ],
    seo:seo('Caminar para mirar mejor — Cuaderno','Caminar sin destino como método creativo.',IMAGES.articleCaminar),
  },
  {
    id:'p4', title:'Ideas que se convierten en sistemas', slug:'ideas-que-se-convierten-en-sistemas',
    subtitle:'De la nota suelta a la estructura viva.',
    excerpt:'Cómo una idea sobrevive: convirtiéndose en sistema antes de convertirse en olvido.',
    category:'Proyectos', type:'reflexion', status:'published', visibility:'public', featured:false,
    heroImage:IMAGES.articleSistemas, gallery:[IMAGES.zaireWorkspace],
    readingTime:7, publishedAt:'2026-03-28', related:['p2','p5'],
    bodyBlocks:[
      P('Todas las ideas empiezan igual: como una nota que probablemente se perderá. La diferencia entre una idea y un proyecto es un sistema.'),
      H('Lo que no se ve'),
      P('Detrás de cada cosa terminada hay una estructura invisible que la sostuvo. Diseñar esa estructura es la mitad del trabajo.'),
      IMG(IMAGES.zaireWorkspace,'La mesa de trabajo donde las notas se vuelven sistemas.'),
      { type:'feature', items:['Capturar sin juzgar','Conectar por temas','Editar sin piedad','Construir en público'] },
      P('Un sistema no mata la creatividad. Le da un lugar donde respirar.'),
    ],
    seo:seo('Ideas que se convierten en sistemas — Cuaderno','Una reflexión sobre cómo las ideas sobreviven volviéndose sistemas.',IMAGES.articleSistemas),
  },
  {
    id:'p5', title:'Notas desde el aeropuerto', slug:'notas-desde-el-aeropuerto',
    subtitle:'Trabajar en tránsito, entre un lugar y otro.',
    excerpt:'Las salas de espera como oficina. Lo que aprendí creando en movimiento.',
    category:'Reflexiones', type:'cronica', status:'published', visibility:'public', featured:true,
    heroImage:IMAGES.articleAeropuerto, gallery:[IMAGES.boardingArea, IMAGES.airplaneWing],
    location:{ name:'Terminal 2E', country:'Francia', city:'París', from:'CDG', to:'MEX' },
    readingTime:6, publishedAt:'2026-05-01', related:['p3','p1'],
    bodyBlocks:[
      P('No todo viaje merece una foto. Algunos solo ordenan la cabeza.'),
      IMG(IMAGES.boardingArea,'Sala de embarque, gate A16.'),
      P('El aeropuerto es el lugar más honesto para trabajar: todos están de paso, nadie finge quedarse.'),
      ROUTE('CDG','MEX',{ vuelo:'AA 2026', fecha:'28 MAY', gate:'A16', asiento:'24A' }),
      HAND('las mejores ideas nacen en tránsito.'),
    ],
    seo:seo('Notas desde el aeropuerto — Cuaderno','Trabajar en tránsito: crear en movimiento entre un lugar y otro.',IMAGES.articleAeropuerto),
  },
  {
    id:'p6', title:'La disciplina del que viaja', slug:'la-disciplina-del-que-viaja',
    subtitle:'Cómo sostener el trabajo cuando todo cambia.',
    excerpt:'Rutinas portátiles: mantener el rumbo cuando el lugar nunca es el mismo.',
    category:'Disciplina', type:'ensayo', status:'published', visibility:'public', featured:false,
    heroImage:IMAGES.training, gallery:[IMAGES.mountains],
    readingTime:5, publishedAt:'2026-03-15', related:['p2','p4'],
    bodyBlocks:[
      P('Viajar destruye rutinas. Por eso hay que diseñar rutinas que viajen.'),
      P('Tres anclas: escribir cada mañana, moverse cada día, cerrar el día con una nota. Funcionan en cualquier huso horario.'),
      CALL('Movimiento sobre destino.'),
    ],
    seo:seo('La disciplina del que viaja — Cuaderno','Rutinas portátiles para sostener el trabajo en movimiento.',IMAGES.training),
  },
  {
    id:'p7', title:'Grabar el camino', slug:'grabar-el-camino',
    subtitle:'Un video-diario de tres semanas en ruta.',
    excerpt:'Registrar el viaje sin convertirlo en espectáculo. Notas sobre el video documental.',
    category:'Videos', type:'video', status:'published', visibility:'public', featured:false,
    heroImage:IMAGES.filmStill, gallery:[IMAGES.airplaneWing, IMAGES.mountains],
    readingTime:3, publishedAt:'2026-02-28', related:['p3','p5'],
    bodyBlocks:[
      P('El video documental tiene una trampa: es fácil grabar el espectáculo y perder el momento.'),
      VID('','Video-diario · ruta CDG → MEX (marcador de posición).'),
      P('Grabo poco y miro mucho. El material sobra siempre; la atención, nunca.'),
    ],
    seo:seo('Grabar el camino — Cuaderno','Un video-diario sobre registrar el viaje sin volverlo espectáculo.',IMAGES.filmStill),
  },
  {
    id:'p8', title:'Escribir para pensar', slug:'escribir-para-pensar',
    subtitle:'El borrador como herramienta de claridad.',
    excerpt:'Por qué escribo antes de saber qué pienso. Un borrador en construcción.',
    category:'Escritura', type:'ensayo', status:'draft', visibility:'public', featured:false,
    heroImage:IMAGES.cuadernoNotebook, gallery:[],
    readingTime:4, publishedAt:'', related:['p4','p2'],
    bodyBlocks:[
      P('No escribo lo que pienso; pienso escribiendo. La página en blanco es el mejor interlocutor.'),
      CALL('Este texto es un borrador — visible solo en el panel de administración.'),
    ],
    seo:seo('Escribir para pensar — Cuaderno','El borrador como herramienta de claridad.',IMAGES.cuadernoNotebook),
  },
];

/* ----- projects (5 public + 1 hidden) -------------------------------------- */
const PROJECTS = [
  {
    id:'pr1', title:'Zaire', slug:'zaire', subtitle:'Documental en desarrollo · África Central',
    shortDescription:'Un viaje a lo profundo de África Central para contar historias de resiliencia, naturaleza y humanidad.',
    longDescription:'Zaire es un documental de largometraje en desarrollo. Nace de la convicción de que las historias más importantes rara vez son las más ruidosas.',
    type:'Documental', status:'building', visibility:'public', sensitive:false, featured:true,
    heroImage:IMAGES.projectZaire, gallery:[IMAGES.projectZaire, IMAGES.travelMountain, IMAGES.filmStill],
    tags:['Documental','África','Historia real'], technologies:['Dirección','Cinematografía','Edición','Color'],
    role:'Dirección creativa · Documental', timeline:'2025 — presente',
    links:[{label:'Teaser (próximamente)',url:'#'},{label:'Notas de producción',url:'#'}],
    blocks:[
      H('Qué es'), P('Un documental sobre el movimiento humano en África Central: personas que construyen a pesar de todo.'),
      IMG(IMAGES.projectZaire,'Locación · África Central.'),
      H('Por qué existe'), P('Porque documentar lo importante es una forma de resistencia contra el olvido.'),
      Q('Documentar lo importante. Diseñar lo que importa.','A.A.'),
      H('Qué estoy construyendo'), { type:'feature', items:['90 min de metraje documental','Un archivo visual abierto','Una serie complementaria para Cuaderno'] },
      H('Stack / herramientas'), { type:'stack', items:['Cinema camera','DaVinci Resolve','Sonido de campo','Archivo 35mm'] },
      H('Estado actual'), { type:'metric', label:'Rodaje', value:'40%' }, { type:'metric', label:'Financiación', value:'En curso' },
      H('Próximos pasos'), P('Cerrar el segundo bloque de rodaje y montar un primer corte de 20 minutos.'),
      ROUTE('CDG','ZAI',{ fase:'RODAJE', año:'2026', sec:'6K' }),
    ],
    seo:seo('Zaire — Proyectos','Documental en desarrollo sobre resiliencia y movimiento humano en África Central.',IMAGES.projectZaire),
  },
  {
    id:'pr2', title:'Cóndor', slug:'condor', subtitle:'Serie audiovisual · Los Andes',
    shortDescription:'Una serie sobre las personas que sostienen la vida en la altura de los Andes.',
    longDescription:'Cóndor observa la relación entre altura, aislamiento y comunidad a lo largo de la cordillera.',
    type:'Serie', status:'building', visibility:'public', sensitive:false, featured:false,
    heroImage:IMAGES.projectCondor, gallery:[IMAGES.projectCondor, IMAGES.mountains],
    tags:['Serie','Andes','Comunidad'], technologies:['Dirección','Cámara','Montaje'],
    role:'Dirección', timeline:'2025 — presente',
    links:[{label:'Sitio (próximamente)',url:'#'}],
    blocks:[ H('Qué es'), P('Una serie documental en cuatro capítulos filmada a lo largo de la cordillera.'), IMG(IMAGES.mountains,'Los Andes, capítulo uno.'), H('Estado actual'), { type:'metric', label:'Capítulos', value:'2 / 4' } ],
    seo:seo('Cóndor — Proyectos','Serie audiovisual sobre la vida en la altura de los Andes.',IMAGES.projectCondor),
  },
  {
    id:'pr3', title:'Woditos', slug:'woditos', subtitle:'Producto digital · en curso',
    shortDescription:'Un producto para capturar ideas en movimiento y convertirlas en sistemas.',
    longDescription:'Woditos es una herramienta de captura y organización pensada para quien crea mientras viaja.',
    type:'Producto', status:'active', visibility:'public', sensitive:false, featured:false,
    heroImage:IMAGES.projectWoditos, gallery:[IMAGES.projectWoditos, IMAGES.zaireWorkspace],
    tags:['Producto','SaaS','Sistemas'], technologies:['React','TypeScript','Supabase','Node'],
    role:'Producto y dirección', timeline:'2024 — presente',
    links:[{label:'App',url:'#'},{label:'Changelog',url:'#'}],
    blocks:[ H('Qué es'), P('Una app para capturar, conectar y publicar ideas sin fricción.'), H('Stack / herramientas'), { type:'stack', items:['React','TypeScript','Supabase','Vercel'] }, H('Estado actual'), { type:'metric', label:'Usuarios beta', value:'240' } ],
    seo:seo('Woditos — Proyectos','Producto digital para capturar ideas en movimiento.',IMAGES.projectWoditos),
  },
  {
    id:'pr4', title:'Supersonic / Yendo', slug:'supersonic-yendo', subtitle:'Exploración · movimiento y marca',
    shortDescription:'Una exploración de identidad en movimiento: cómo se ve una marca que nunca se queda quieta.',
    longDescription:'Supersonic (bajo el nombre Yendo) explora sistemas de identidad diseñados para el movimiento.',
    type:'Identidad', status:'building', visibility:'public', sensitive:false, featured:false,
    heroImage:IMAGES.projectSupersonic, gallery:[IMAGES.projectSupersonic],
    tags:['Identidad','Motion','Exploración'], technologies:['Dirección de arte','Motion','Sistemas'],
    role:'Dirección de arte', timeline:'2025 — presente',
    links:[{label:'Estudio de caso',url:'#'}],
    blocks:[ H('Qué es'), P('Un sistema de identidad diseñado para vivir en movimiento, no en una hoja estática.'), H('Próximos pasos'), P('Prototipar el sistema en motion y probarlo en tres formatos.') ],
    seo:seo('Supersonic / Yendo — Proyectos','Exploración de identidad en movimiento.',IMAGES.projectSupersonic),
  },
  {
    id:'pr5', title:'Gods Envy Us', slug:'gods-envy-us', subtitle:'GEU · estudio creativo',
    shortDescription:'Un estudio y colectivo creativo. Ideas, cultura y objetos con intención.',
    longDescription:'Gods Envy Us (GEU) es un estudio creativo que produce trabajo cultural propio.',
    type:'Estudio', status:'paused', visibility:'public', sensitive:false, featured:false,
    heroImage:IMAGES.projectGeu, gallery:[IMAGES.projectGeu],
    tags:['Estudio','Cultura','Colectivo'], technologies:['Dirección creativa','Producción'],
    role:'Cofundador', timeline:'2023 — 2025',
    links:[{label:'Archivo',url:'#'}],
    blocks:[ H('Qué es'), P('Un estudio creativo enfocado en cultura y objetos con intención.'), H('Estado actual'), P('En pausa. El archivo permanece disponible.') ],
    seo:seo('Gods Envy Us (GEU) — Proyectos','Estudio y colectivo creativo.',IMAGES.projectGeu),
  },
  {
    id:'pr6', title:'ELVA', slug:'elva', subtitle:'Proyecto privado',
    shortDescription:'Proyecto confidencial en fase temprana. No visible públicamente.',
    longDescription:'Contenido sensible reservado. Solo accesible desde el panel de administración.',
    type:'Confidencial', status:'draft', visibility:'hidden', sensitive:true, featured:false,
    heroImage:IMAGES.projectElva, gallery:[],
    tags:['Privado'], technologies:[], role:'—', timeline:'—',
    links:[],
    blocks:[ CALL('Este proyecto es privado/sensible y nunca aparece en las páginas públicas.') ],
    seo:seo('ELVA','Proyecto privado.',IMAGES.projectElva),
  },
];

/* ----- home / site / navigation settings ----------------------------------- */
const HOME_SETTINGS = {
  heroHeadline:'Ideas\nen tránsito.',
  heroAccent:'crear desde el movimiento.',
  heroSubtitle:'Archivo personal de un director creativo que construye, viaja y crea en movimiento.',
  heroBackgroundImage:IMAGES.airportHero,
  heroPortraitImage:IMAGES.heroPortrait,
  heroPortraitTreatment:{ blendMode:'luminosity', opacity:0.9, mask:'left', position:'center' },
  ctas:[{ label:'Explorar archivo', url:'Cuaderno.dc.html', style:'link' }],
  // Buenos Aires is always the origin. The hero background is a vertical slider:
  // each destination sets the bg image, the boarding-pass ticket and the route bar.
  heroOrigin:{ code:'BUE', city:'Buenos Aires', airport:'EZE' },
  heroDestinations:[
    { code:'MEX', city:'Ciudad de México', airline:'AR', flight:'AR 1380', date:'MAY 28', gate:'A16', seat:'24A', boarding:'18:40', zone:'1', image:IMAGES.airportHero, coords:'19.4326° N   99.1332° W' },
    { code:'CDG', city:'París',            airline:'AF', flight:'AF 0417', date:'JUN 12', gate:'K22', seat:'9C',  boarding:'07:05', zone:'2', image:IMAGES.travelMountain, coords:'48.8566° N   2.3522° E' },
    { code:'CPT', city:'Ciudad del Cabo',  airline:'ET', flight:'ET 0809', date:'JUL 03', gate:'B04', seat:'31K', boarding:'22:40', zone:'1', image:IMAGES.projectZaire, coords:'33.9249° S   18.4241° E' },
  ],
  boardingPass:{ code:'AR 1380', from:'BUE', to:'MEX', fromCity:'BUENOS AIRES', toCity:'CIUDAD DE MÉXICO', flight:'AR 1380', date:'MAY 28', gate:'A16', seat:'24A', boarding:'18:40', zone:'1' },
  // Fixed fades applied over ANY hero image so it always blends: dark toward the header (top),
  // paper-white toward the section below (bottom). Editable from /dashboard → Inicio · Home.
  heroFade:{ topColor:'rgba(11,13,16,0.82)', topHeight:240, sideColor:'rgba(9,11,15,0.60)', sideWidth:62, bottomColor:'#F4F2EF', bottomHeight:440 },
  fragments:[
    { n:'01', title:'Cuaderno', caption:'Notas. Ideas. Reflexiones.', image:IMAGES.cuadernoNotebook, url:'Cuaderno.dc.html' },
    { n:'02', title:'Gente que viaja', caption:'Conversaciones que inspiran.', image:IMAGES.boardingArea, url:'Cuaderno.dc.html' },
    { n:'03', title:'The Rise Plan', caption:'Disciplina. Dirección. Destino.', image:IMAGES.mountains, url:'Proyectos.dc.html' },
    { n:'04', title:'Proyectos', caption:'Historias que estoy creando.', image:IMAGES.workspace, url:'Proyectos.dc.html' },
    { n:'05', title:'Ahora', caption:'Lo que estoy pensando. Haciendo.', image:IMAGES.cityWindow, url:'Ahora.dc.html' },
  ],
  featuredPosts:['p5','p1'],
  featuredProject:'zaire',
  visualArchiveImages:[IMAGES.filmStill, IMAGES.airplaneWing, IMAGES.mountains, IMAGES.coffee],
  quote:{ text:'Ver el mundo, afrontar peligros, traspasar muros, acercarse a los demás, encontrarse y sentir. Ese es el propósito de la vida.', cite:'Walter Mitty' },
  newsletter:{ heading:'RECIBE NOTAS DESDE EL CAMINO', note:'No spam. Solo ideas, viajes y proyectos.' },
};

const SITE_SETTINGS = {
  siteName:'andyalbarracin.com',
  domain:'andyalbarracin.com',
  monogram:'AA',
  wordmark:'andyalbarracin.com',
  logoUrl:'',
  faviconUrl:'',
  defaultOgImage:IMAGES.airportHero,
  language:'es',
  contactEmail:'hola@andyalbarracin.com',
  socialLinks:[
    { platform:'Instagram', url:'#', visible:true },
    { platform:'LinkedIn', url:'#', visible:true },
    { platform:'YouTube', url:'#', visible:true },
    { platform:'Behance', url:'#', visible:true },
  ],
  footerQuote:'gracias por estar aquí. — andy x',
  copyrightText:'© 2026 andyalbarracin.com — Todos los derechos reservados.',
  footerTagline:'Director creativo construyendo ideas, viajes y sistemas con intención.',
  theme:{ paper:'#F4F2EF', obsidian:'#0D0D0E', charcoal:'#1B1D20', blue:'#2F5DAA', slate:'#6E7C8B', tape:'#DCCEB6',
    fontSerif:'Playfair Display', fontSans:'Inter', fontHand:'Over the Rainbow', heroAccent:'#9db8ec', headingScale:1 },
  seo:seo('andyalbarracin.com — Ideas en tránsito','Archivo personal de un director creativo que construye, viaja y crea en movimiento.',IMAGES.airportHero),
};

const NAV_SETTINGS = {
  main:[
    { label:'Inicio', url:'Homepage.dc.html', visible:true },
    { label:'Cuaderno', url:'Cuaderno.dc.html', visible:true },
    { label:'Proyectos', url:'Proyectos.dc.html', visible:true },
    { label:'Ahora', url:'Ahora.dc.html', visible:true },
    { label:'Sobre mí', url:'Sobre-mi.dc.html', visible:true },
    { label:'Hablemos', url:'Hablemos.dc.html', visible:true },
  ],
  footerNav:['Cuaderno','Proyectos','Ahora','Sobre mí','Hablemos'],
  socialOrder:['Instagram','LinkedIn','YouTube','Behance'],
};

/* ----- default snapshot ---------------------------------------------------- */
const DEFAULTS = { version:1, posts:POSTS, projects:PROJECTS, media:MEDIA, home:HOME_SETTINGS, site:SITE_SETTINGS, nav:NAV_SETTINGS };

/* ----- store (localStorage-backed, seeded once) ---------------------------- */
const clone = (v) => JSON.parse(JSON.stringify(v));
let _cache = null;
function migrate(){
  // Back-fill fields added after a store was first seeded (localStorage persists across sessions).
  if(!_cache || !_cache.home) return;
  let changed=false;
  if(!_cache.home.heroOrigin){ _cache.home.heroOrigin = clone(DEFAULTS.home.heroOrigin); changed=true; }
  if(!Array.isArray(_cache.home.heroDestinations) || !_cache.home.heroDestinations.length){
    _cache.home.heroDestinations = clone(DEFAULTS.home.heroDestinations); changed=true;
  }
  if(!_cache.home.heroFade){ _cache.home.heroFade = clone(DEFAULTS.home.heroFade); changed=true; }
  if(_cache.site && _cache.site.theme){
    var th=_cache.site.theme;
    if(th.headingScale==null){ th.headingScale = 1; changed=true; }
    if(!th.heroAccent){ th.heroAccent = '#9db8ec'; changed=true; }
  }
  if(changed) persist();
}
function store(){
  if(_cache) return _cache;
  try{
    const raw = (typeof localStorage!=='undefined') && localStorage.getItem(STORE_KEY);
    if(raw){ _cache = JSON.parse(raw); migrate(); return _cache; }
  }catch(e){ /* ignore */ }
  _cache = clone(DEFAULTS);
  persist();
  return _cache;
}
function persist(){
  try{ if(typeof localStorage!=='undefined') localStorage.setItem(STORE_KEY, JSON.stringify(_cache)); }catch(e){ /* ignore */ }
}
export function resetStore(){ _cache = clone(DEFAULTS); persist(); return _cache; }

/* ----- visibility rule: what the public may see ---------------------------- */
const isPublicPost = (p) => p.status==='published' && p.visibility==='public';
const isPublicProject = (pr) => pr.visibility==='public' && !pr.sensitive && pr.status!=='draft';

/* ----- POSTS api ----------------------------------------------------------- */
export function getPosts(opts={}){
  const all = store().posts;
  const list = opts.includeAll ? all : all.filter(isPublicPost);
  return clone(opts.category ? list.filter(p=>p.category===opts.category) : list);
}
export function getPostBySlug(slug, opts={}){
  const p = store().posts.find(x=>x.slug===slug);
  if(!p) return null;
  if(!opts.includeAll && !isPublicPost(p)) return null;
  return clone(p);
}
export function getPostById(id){ const p=store().posts.find(x=>x.id===id); return p?clone(p):null; }
export function getFeaturedPosts(){ return clone(store().posts.filter(p=>isPublicPost(p)&&p.featured)); }
export function getCategories(){ return Array.from(new Set(store().posts.map(p=>p.category))); }
export function upsertPost(post){
  const s=store(); const i=s.posts.findIndex(x=>x.id===post.id);
  if(i>=0) s.posts[i]=post; else s.posts.unshift({ ...post, id:post.id||('p'+Date.now()) });
  persist(); return clone(post);
}
export function deletePost(id){ const s=store(); s.posts=s.posts.filter(x=>x.id!==id); persist(); }

/* ----- PROJECTS api -------------------------------------------------------- */
export function getProjects(opts={}){
  const all = store().projects;
  return clone(opts.includeAll ? all : all.filter(isPublicProject));
}
export function getProjectBySlug(slug, opts={}){
  const pr = store().projects.find(x=>x.slug===slug);
  if(!pr) return null;
  if(!opts.includeAll && !isPublicProject(pr)) return null;
  return clone(pr);
}
export function getProjectById(id){ const pr=store().projects.find(x=>x.id===id); return pr?clone(pr):null; }
export function getFeaturedProject(){ const pr=store().projects.find(x=>isPublicProject(x)&&x.featured); return pr?clone(pr):null; }
export function upsertProject(project){
  const s=store(); const i=s.projects.findIndex(x=>x.id===project.id);
  if(i>=0) s.projects[i]=project; else s.projects.unshift({ ...project, id:project.id||('pr'+Date.now()) });
  persist(); return clone(project);
}
export function deleteProject(id){ const s=store(); s.projects=s.projects.filter(x=>x.id!==id); persist(); }

/* ----- MEDIA api ----------------------------------------------------------- */
export function getMediaAssets(){ return clone(store().media); }
export function getMediaById(id){ const m=store().media.find(x=>x.id===id); return m?clone(m):null; }
export function upsertMedia(asset){
  const s=store(); const i=s.media.findIndex(x=>x.id===asset.id);
  if(i>=0) s.media[i]=asset; else s.media.unshift({ ...asset, id:asset.id||('m'+Date.now()), createdAt:new Date().toISOString() });
  persist(); return clone(asset);
}
export function deleteMedia(id){ const s=store(); s.media=s.media.filter(x=>x.id!==id); persist(); }

/* ----- SETTINGS api -------------------------------------------------------- */
export function getSiteSettings(){ return clone(store().site); }
export function updateSiteSettings(patch){ const s=store(); s.site={ ...s.site, ...patch }; persist(); return clone(s.site); }
export function getHomeSettings(){ return clone(store().home); }
export function updateHomeSettings(patch){ const s=store(); s.home={ ...s.home, ...patch }; persist(); return clone(s.home); }
export function getNavSettings(){ return clone(store().nav); }
export function updateNavSettings(patch){ const s=store(); s.nav={ ...s.nav, ...patch }; persist(); return clone(s.nav); }

/* ----- SEO overview (admin) ------------------------------------------------ */
export function getSEOOverview(){
  const s=store();
  const rows=[
    { scope:'Página', name:'Home', ...seoStatus(s.site.seo) },
    { scope:'Página', name:'Cuaderno', ...seoStatus(seo('Cuaderno — andyalbarracin.com','Notas, ideas y reflexiones desde el camino.',s.site.defaultOgImage)) },
    { scope:'Página', name:'Proyectos', ...seoStatus(seo('Proyectos — andyalbarracin.com','Sistemas, ideas y productos en construcción.',s.site.defaultOgImage)) },
    { scope:'Página', name:'Ahora', ...seoStatus(seo('Ahora — andyalbarracin.com','',s.site.defaultOgImage)) },
    { scope:'Página', name:'Sobre mí', ...seoStatus(seo('Sobre mí — andyalbarracin.com','Perfil creativo de Andy Albarracín.',s.site.defaultOgImage)) },
    { scope:'Página', name:'Hablemos', ...seoStatus(seo('Hablemos — andyalbarracin.com','Colaboremos en tu próximo proyecto.',s.site.defaultOgImage)) },
  ];
  s.posts.forEach(p=>rows.push({ scope:'Artículo', name:p.title, ...seoStatus(p.seo) }));
  s.projects.filter(isPublicProject).forEach(pr=>rows.push({ scope:'Proyecto', name:pr.title, ...seoStatus(pr.seo) }));
  return rows;
}
function seoStatus(sf){
  const missing=[]; if(!sf||!sf.title) missing.push('title'); if(!sf||!sf.description) missing.push('description'); if(!sf||!sf.ogImage) missing.push('ogImage');
  return { title:sf?sf.title:'', description:sf?sf.description:'', ogImage:sf?sf.ogImage:'', missing, ok:missing.length===0 };
}

/* ----- counts for dashboard ------------------------------------------------ */
export function getStats(){
  const s=store();
  return {
    postsPublished:s.posts.filter(p=>p.status==='published').length,
    postsDrafts:s.posts.filter(p=>p.status==='draft').length,
    postsFeatured:s.posts.filter(p=>p.featured).length,
    projectsPublished:s.projects.filter(isPublicProject).length,
    projectsHidden:s.projects.filter(p=>p.visibility!=='public'||p.sensitive).length,
    media:s.media.length,
    homeModules:5 + (s.home.fragments?s.home.fragments.length:0),
    seoWarnings:getSEOOverview().filter(r=>!r.ok).length,
  };
}

/* ----- sitemap route list -------------------------------------------------- */
export function getSitemap(){
  const s=store(); const base='https://'+s.site.domain+'/';
  const routes=['','cuaderno','proyectos','ahora','sobre-mi','hablemos'];
  s.posts.filter(isPublicPost).forEach(p=>routes.push('cuaderno/'+p.slug));
  s.projects.filter(isPublicProject).forEach(pr=>routes.push('proyectos/'+pr.slug));
  return routes.map(r=>base+r);
}
