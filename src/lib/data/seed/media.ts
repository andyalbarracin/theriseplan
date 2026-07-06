import type { MediaAsset, MediaType } from "@/lib/types";
import { IMAGES, type ImageKey } from "./images";

type Row = [string, ImageKey, string, string, string, MediaType, number, string[]];

const ROWS: Row[] = [
  ["m-portrait", "heroPortrait", "portrait-andy.png", "Retrato artístico de Andy Albarracín", "Retrato · archivo personal", "portrait", 412, ["home", "sobre-mi"]],
  ["m-airport", "airportHero", "airport-hero.png", "Terminal de aeropuerto al amanecer", "Terminal CDG · 06:14", "landscape", 688, ["home"]],
  ["m-notebook", "cuadernoNotebook", "notebook.png", "Cuaderno con notas manuscritas", "Cuaderno · 35mm", "landscape", 402, ["home", "cuaderno"]],
  ["m-mountain", "travelMountain", "mountains.png", "Cordillera al atardecer", "Andes · 4200m", "landscape", 455, ["home", "cuaderno", "proyectos"]],
  ["m-workspace", "zaireWorkspace", "workspace.png", "Estación de edición de video", "Studio · 02:14", "landscape", 498, ["home", "proyectos"]],
  ["m-city", "cityWindow", "city-window.png", "Ciudad al anochecer desde una ventana", "Ciudad · 18:40", "landscape", 473, ["home", "ahora"]],
  ["m-greek", "greekSculpture", "greek-sculpture.png", "Escultura clásica en mármol", "Mármol · archivo", "portrait", 389, ["sobre-mi"]],
  ["m-boarding", "boardingArea", "boarding-area.png", "Sala de embarque", "Gate · A16", "landscape", 444, ["cuaderno"]],
  ["m-wing", "airplaneWing", "airplane-wing.png", "Ala de avión sobre las nubes", "11.000m · 35mm", "landscape", 421, ["home"]],
  ["m-film", "filmStill", "film-still.png", "Figura caminando en un pasillo", "Pasillo · 35mm", "landscape", 430, ["home"]],
  ["m-training", "training", "training.png", "Entrenamiento al amanecer", "Disciplina · 05:30", "landscape", 410, ["cuaderno"]],
  ["m-coffee", "coffee", "coffee.png", "Taza de café sobre una mesa", "BUE · pausa", "landscape", 388, ["home"]],
  ["m-a-silencio", "articleSilencio", "article-silencio.png", "Montaña en silencio, Colombia", "Montaña · Colombia", "landscape", 512, ["post:lecciones-desde-el-silencio"]],
  ["m-a-rutinas", "articleRutinas", "article-rutinas.png", "Amanecer y disciplina", "The Rise Plan", "landscape", 476, ["post:rutinas-que-construyen-caracter"]],
  ["m-a-caminar", "articleCaminar", "article-caminar.png", "Caminata al amanecer", "Camino · 06:40", "landscape", 468, ["post:caminar-para-mirar-mejor"]],
  ["m-a-sistemas", "articleSistemas", "article-sistemas.png", "Pantallas y sistemas", "Sistemas · 02:14", "landscape", 489, ["post:ideas-que-se-convierten-en-sistemas"]],
  ["m-p-zaire", "projectZaire", "project-zaire.png", "Paisaje de África Central", "África Central · 6K", "landscape", 702, ["project:zaire"]],
  ["m-p-condor", "projectCondor", "project-condor.png", "Vuelo sobre los Andes", "Cóndor · Andes", "landscape", 655, ["project:condor"]],
  ["m-p-woditos", "projectWoditos", "project-woditos.png", "Interfaz de producto", "Woditos · producto", "landscape", 540, ["project:woditos"]],
  ["m-p-supersonic", "projectSupersonic", "project-supersonic.png", "Interfaz de movimiento", "Yendo · Supersonic", "landscape", 548, ["project:supersonic-yendo"]],
];

export const MEDIA: MediaAsset[] = ROWS.map(
  ([id, key, filename, alt, caption, type, size, usedIn]) => ({
    id,
    url: IMAGES[key],
    filename,
    alt,
    caption,
    type,
    size,
    createdAt: "2026-03-01T10:00:00Z",
    usedIn,
  })
);
