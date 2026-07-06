/* Image map — real curated placeholders under /public/images (ported from
   data.js IMAGES, re-rooted to the Next public path). */
export const IMAGES = {
  heroPortrait: "/images/portrait-andy.png",
  airportHero: "/images/airport-hero.png",
  cuadernoNotebook: "/images/notebook.png",
  travelMountain: "/images/mountains.png",
  zaireWorkspace: "/images/workspace.png",
  cityWindow: "/images/city-window.png",
  greekSculpture: "/images/greek-sculpture.png",
  boardingArea: "/images/boarding-area.png",
  airplaneWing: "/images/airplane-wing.png",
  filmStill: "/images/film-still.png",
  training: "/images/training.png",
  coffee: "/images/coffee.png",
  heroPrimary: "/images/hero-primary.png",
  articleSilencio: "/images/article-silencio.png",
  articleRutinas: "/images/article-rutinas.png",
  articleCaminar: "/images/article-caminar.png",
  articleSistemas: "/images/article-sistemas.png",
  articleAeropuerto: "/images/article-aeropuerto.png",
  projectZaire: "/images/project-zaire.png",
  projectCondor: "/images/project-condor.png",
  projectWoditos: "/images/project-woditos.png",
  projectSupersonic: "/images/project-supersonic.png",
  projectGeu: "/images/project-geu.png",
  projectElva: "/images/project-elva.png",
} as const;

export type ImageKey = keyof typeof IMAGES;
