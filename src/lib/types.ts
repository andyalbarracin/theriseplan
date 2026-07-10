/* =============================================================================
   andyalbarracin.com — CMS domain types
   TypeScript port of the JSDoc typedefs in the Claude Design prototype's data.js.
   ============================================================================= */

export type Visibility = "public" | "private" | "hidden";
export type PostStatus = "draft" | "published" | "archived";
// "archivo" = posts heredados del blog WordPress "The Rise Plan" (cuerpo HTML fiel).
export type PostType = "cronica" | "ensayo" | "video" | "reflexion" | "proyecto" | "archivo";
export type ProjectStatus = "active" | "building" | "paused" | "archived" | "draft";
export type MediaType = "portrait" | "landscape";

/* ----- content blocks ------------------------------------------------------ */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: number }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "gallery"; urls: string[] }
  | { type: "video"; url: string; caption?: string }
  | { type: "callout"; text: string }
  | { type: "route"; from: string; to: string; meta?: Record<string, string> }
  | { type: "divider" }
  | { type: "handwritten"; text: string }
  | { type: "feature"; items: string[] }
  | { type: "metric"; label: string; value: string }
  | { type: "stack"; items: string[] }
  | { type: "links"; items: { label: string; url: string }[] }
  // Bloque de HTML crudo: usado por los posts importados de WordPress (fidelidad 1:1).
  | { type: "html"; html: string };

export type ContentBlockType = ContentBlock["type"];

export interface SEOFields {
  title: string;
  description: string;
  ogImage: string;
  canonical?: string;
  twitterImage?: string;
}

export interface LocationFields {
  name: string;
  country?: string;
  city?: string;
  coordinates?: string;
  from?: string;
  to?: string;
}

/* ----- media --------------------------------------------------------------- */
export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  alt: string;
  caption: string;
  type: MediaType;
  size: number;
  createdAt: string;
  usedIn: string[];
}

/* ----- post ---------------------------------------------------------------- */
export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  category: string;
  type: PostType;
  status: PostStatus;
  visibility: Visibility;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  bodyBlocks: ContentBlock[];
  seo: SEOFields;
  location?: LocationFields | null;
  publishedAt?: string;
  readingTime?: number;
  related?: string[];
  // ----- Campos de importacion (posts heredados de WordPress) --------------
  originalHtml?: string;        // cuerpo HTML original tal cual venia del blog
  tags?: string[];              // categorias + etiquetas del post en WordPress
  source?: string;              // "native" | "wordpress-theriseplan"
  legacyWpId?: number;          // id del post en el WordPress viejo (trazabilidad)
  // ----- Hero: mostrar el post en el slider de portada ---------------------
  heroFeatured?: boolean;       // si aparece en el Hero de la home
  heroCode?: string;            // codigo/destino que muestra el ticket (ej. "MEX")
  heroTicket?: HeroTicket;      // resto de campos del ticket (opcionales, con fallback)
}

/** Campos opcionales del ticket (boarding pass) por post. Los que se dejan
    vacíos usan un ejemplo/fallback al renderizar el Hero. */
export interface HeroTicket {
  destCity?: string;
  flight?: string;
  date?: string;
  gate?: string;
  seat?: string;
  boarding?: string;
  zone?: string;
}

/* ----- project ------------------------------------------------------------- */
export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription: string;
  longDescription?: string;
  type: string;
  status: ProjectStatus;
  visibility: Visibility;
  sensitive: boolean;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  tags: string[];
  technologies: string[];
  links: ProjectLink[];
  role?: string;
  timeline?: string;
  blocks: ContentBlock[];
  seo: SEOFields;
}

/* ----- settings ------------------------------------------------------------ */
export interface Theme {
  paper: string;
  obsidian: string;
  charcoal: string;
  blue: string;
  slate: string;
  tape: string;
  fontSerif: string;
  fontSans: string;
  fontHand: string;
  heroAccent: string;
  headingScale: number;
}

export interface HeroOrigin {
  code: string;
  city: string;
  airport: string;
}

export interface HeroDestination {
  code: string;
  city: string;
  airline?: string;
  flight: string;
  date: string;
  gate: string;
  seat: string;
  boarding: string;
  zone: string;
  image: string;
  coords: string;
  url?: string; // si el destino viene de un post, adónde entra el ticket
}

export interface HeroFade {
  topColor: string;
  topHeight: number;
  sideColor: string;
  sideWidth: number;
  bottomColor: string;
  bottomHeight: number;
}

export interface HeroPortraitTreatment {
  blendMode: string;
  opacity: number;
  mask: string;
  position: string;
  grayscale?: number;
}

export interface BoardingPassFields {
  code: string;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  flight: string;
  date: string;
  gate: string;
  seat: string;
  boarding: string;
  zone: string;
}

export interface HomeFragment {
  n: string;
  title: string;
  caption: string;
  image: string;
  url: string;
}

export interface HomeCTA {
  label: string;
  url: string;
  style: string;
}

export interface HomeSettings {
  heroHeadline: string;
  heroAccent: string;
  heroSubtitle: string;
  heroBackgroundImage: string;
  heroPortraitImage: string;
  heroPortraitTreatment: HeroPortraitTreatment;
  ctas: HomeCTA[];
  heroOrigin: HeroOrigin;
  heroDestinations: HeroDestination[];
  boardingPass: BoardingPassFields;
  heroFade: HeroFade;
  fragments: HomeFragment[];
  featuredPosts: string[];
  featuredProject: string;
  visualArchiveImages: string[];
  quote: { text: string; cite: string };
  newsletter: { heading: string; note: string };
}

export interface SocialLink {
  platform: string;
  url: string;
  visible: boolean;
}

/** Taxonomía administrable desde Configuración (guardada en site_settings.data). */
export interface Taxonomy {
  categories: string[];
  tags: string[];
}

export interface SiteSettings {
  siteName: string;
  domain: string;
  taxonomy?: Taxonomy;
  monogram: string;
  wordmark: string;
  logoUrl: string;
  faviconUrl: string;
  defaultOgImage: string;
  language: string;
  contactEmail: string;
  socialLinks: SocialLink[];
  footerQuote: string;
  copyrightText: string;
  footerTagline: string;
  theme: Theme;
  seo: SEOFields;
}

export interface NavItem {
  label: string;
  url: string;
  visible: boolean;
}

export interface NavSettings {
  main: NavItem[];
  footerNav: string[];
  socialOrder: string[];
}

/* ----- "Ahora" editorial content (no prototype file — modeled from design) - */
export interface AhoraRow {
  label: string;
  value: string;
  emphasis?: string;
}

export interface AhoraContent {
  updated: string;
  intro: string;
  accent: string;
  rows: AhoraRow[];
  closing: string;
  image: string;
  imageTime: string;
  imagePlace: string;
  imageCorner: string;
  statusLabel: string;
  statusRoute: string;
  statusChip: string;
}

/* ----- derived / admin views ----------------------------------------------- */
export interface Stats {
  postsPublished: number;
  postsDrafts: number;
  postsFeatured: number;
  projectsPublished: number;
  projectsHidden: number;
  media: number;
  homeModules: number;
  seoWarnings: number;
}

export interface SEORow {
  scope: string;
  name: string;
  title: string;
  description: string;
  ogImage: string;
  missing: string[];
  ok: boolean;
}

/* ----- store snapshot ------------------------------------------------------ */
export interface CMSSnapshot {
  version: number;
  posts: Post[];
  projects: Project[];
  media: MediaAsset[];
  home: HomeSettings;
  site: SiteSettings;
  nav: NavSettings;
  ahora: AhoraContent;
}
