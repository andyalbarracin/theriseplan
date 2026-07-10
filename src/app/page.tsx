import { HomeClient } from "@/components/public/home/HomeClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getPostsSSR, getFeaturedProjectsSSR, getHomeSettingsSSR } from "@/lib/cms/ssr";
import { IMAGES } from "@/lib/data/seed";
import type { HeroDestination } from "@/lib/types";
import type { FilmItem } from "@/components/public/home/FilmStrip";
import type { CatItem } from "@/components/public/home/CategoryCards";
import type { ZaireBlock } from "@/components/public/home/ArchiveBand";

// Render dinámico: refleja los cambios del dashboard al instante (sin redeploy).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const home = await getHomeSettingsSSR();
  const posts = await getPostsSSR();

  // ---- HERO desde posts -----------------------------------------------------
  // Los posts marcados "Mostrar en Hero" arman el slider de portada. Cada uno
  // usa un destino de ejemplo como plantilla (para completar el ticket) y le
  // sobrescribe imagen + código de destino + enlace al post. Si no hay ninguno,
  // se usan los destinos de ejemplo (el diseño nunca queda vacío).
  const heroPosts = posts.filter((p) => p.heroFeatured);
  const tmpl = home.heroDestinations;
  const heroFromPosts: HeroDestination[] = heroPosts.map((p, idx) => {
    const base = (tmpl.length ? tmpl[idx % tmpl.length] : undefined) ?? ({} as HeroDestination);
    const t = p.heroTicket ?? {}; // campos del ticket elegidos en el post
    return {
      ...base,
      image: p.heroImage || base.image || "",
      code: (p.heroCode || base.code || "").toUpperCase(),
      city: t.destCity || p.location?.city || p.location?.name || base.city || "",
      flight: t.flight || p.heroCode || base.flight || "",
      date: t.date || base.date || "",
      gate: t.gate || base.gate || "",
      seat: t.seat || base.seat || "",
      boarding: t.boarding || base.boarding || "",
      zone: t.zone || base.zone || "",
      url: `/cuaderno/${p.slug}`,
    };
  });
  const home2 = heroFromPosts.length ? { ...home, heroDestinations: heroFromPosts } : home;

  const byId = new Map(posts.map((p) => [p.id, p]));
  const picked = ["p5", "p7", "p1", "p3", "p2"].map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const source = picked.length >= 4 ? picked : posts.slice(0, 5);
  const films: FilmItem[] = source.map((p) => ({
    title: p.title,
    img: p.heroImage,
    isVideo: (p.tags ?? []).includes("video") || p.type === "video",
    label: (p.category || "").toUpperCase(),
    url: `/cuaderno/${p.slug}`,
  }));

  const cats: CatItem[] = home.fragments.map((f) => ({
    n: f.n,
    title: f.title,
    cap: f.caption,
    img: f.image,
    url: f.url,
  }));

  // Proyectos destacados (hasta 3) → slider en la escena final de la home.
  const featuredProjects = await getFeaturedProjectsSSR(3);
  const zaireList: ZaireBlock[] = featuredProjects.length
    ? featuredProjects.map((project) => ({
        title: project.title.toUpperCase(),
        tags: project.tags.map((t) => t.toUpperCase()),
        description: project.shortDescription,
        href: `/proyectos/${project.slug}`,
      }))
    : [
        {
          title: "ZAIRE",
          tags: ["DOCUMENTAL", "ÁFRICA", "HISTORIA REAL"],
          description: "Un viaje a lo profundo de África Central para contar historias de resiliencia, naturaleza y humanidad.",
          href: "/proyectos/zaire",
        },
      ];

  // Carrusel de "archivo visual" (decorativo). Editable desde Ajustes → Home
  // (home.visualArchiveImages); si está vacío usa un set de ejemplo.
  const galleryDefault = [IMAGES.projectZaire, IMAGES.travelMountain, IMAGES.filmStill, IMAGES.airplaneWing, IMAGES.cityWindow, IMAGES.coffee];
  const gallery = home.visualArchiveImages?.length ? home.visualArchiveImages : galleryDefault;

  return (
    <>
      <HomeClient home={home2} films={films} cats={cats} zaireList={zaireList} gallery={gallery} />
      <SiteFooter />
    </>
  );
}
