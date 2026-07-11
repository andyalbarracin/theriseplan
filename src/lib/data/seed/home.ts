import type { HomeSettings } from "@/lib/types";
import { IMAGES } from "./images";

export const HOME_SETTINGS: HomeSettings = {
  heroHeadline: "Ideas\nen tránsito.",
  heroAccent: "crear desde el movimiento.",
  heroSubtitle:
    "Archivo personal de un director creativo que construye, viaja y crea en movimiento.",
  heroBackgroundImage: IMAGES.airportHero,
  heroPortraitImage: IMAGES.heroPortrait,
  heroPortraitTreatment: { blendMode: "luminosity", opacity: 0.9, mask: "left", position: "center" },
  ctas: [{ label: "Explorar archivo", url: "/cuaderno", style: "link" }],
  // Buenos Aires is always the origin. The hero background is a vertical slider:
  // each destination sets the bg image, the boarding-pass ticket and the route bar.
  heroOrigin: { code: "BUE", city: "Buenos Aires", airport: "EZE" },
  heroDestinations: [
    { code: "MEX", city: "Ciudad de México", airline: "AR", flight: "AR 1380", date: "MAY 28", gate: "A16", seat: "24A", boarding: "18:40", zone: "1", image: IMAGES.airportHero, coords: "19.4326° N   99.1332° W" },
    { code: "CDG", city: "París", airline: "AF", flight: "AF 0417", date: "JUN 12", gate: "K22", seat: "9C", boarding: "07:05", zone: "2", image: IMAGES.travelMountain, coords: "48.8566° N   2.3522° E" },
    { code: "CPT", city: "Ciudad del Cabo", airline: "ET", flight: "ET 0809", date: "JUL 03", gate: "B04", seat: "31K", boarding: "22:40", zone: "1", image: IMAGES.projectZaire, coords: "33.9249° S   18.4241° E" },
  ],
  boardingPass: {
    code: "AR 1380",
    from: "BUE",
    to: "MEX",
    fromCity: "BUENOS AIRES",
    toCity: "CIUDAD DE MÉXICO",
    flight: "AR 1380",
    date: "MAY 28",
    gate: "A16",
    seat: "24A",
    boarding: "18:40",
    zone: "1",
  },
  // Fixed fades applied over ANY hero image so it always blends: dark toward the
  // header (top), paper-white toward the section below (bottom).
  heroFade: {
    topColor: "rgba(11,13,16,0.82)",
    topHeight: 240,
    sideColor: "rgba(9,11,15,0.60)",
    sideWidth: 62,
    bottomColor: "#F4F2EF",
    bottomHeight: 440,
  },
  fragments: [
    { n: "01", title: "Cuaderno", caption: "Notas. Ideas. Reflexiones.", image: IMAGES.cuadernoNotebook, url: "/cuaderno" },
    { n: "02", title: "Gente que viaja", caption: "Conversaciones que inspiran.", image: IMAGES.boardingArea, url: "/cuaderno" },
    { n: "03", title: "The Rise Plan", caption: "Disciplina. Dirección. Destino.", image: IMAGES.travelMountain, url: "/proyectos" },
    { n: "04", title: "Proyectos", caption: "Historias que estoy creando.", image: IMAGES.zaireWorkspace, url: "/proyectos" },
    { n: "05", title: "Ahora", caption: "Lo que estoy pensando. Haciendo.", image: IMAGES.cityWindow, url: "/ahora" },
  ],
  featuredPosts: ["p5", "p1"],
  featuredProject: "zaire",
  visualArchiveImages: [IMAGES.filmStill, IMAGES.airplaneWing, IMAGES.travelMountain, IMAGES.coffee],
  quote: {
    text:
      "Ver el mundo, afrontar peligros, traspasar muros, acercarse a los demás, encontrarse y sentir. Ese es el propósito de la vida.",
    cite: "Walter Mitty",
  },
  newsletter: {
    heading: "RECIBE NOTAS DESDE EL CAMINO",
    note: "No spam. Solo ideas, viajes y proyectos.",
  },
  heroNote: "No todo viaje\nmerece una foto.\nAlgunos solo\nordenan la cabeza.",
  sealImage: "",
};
