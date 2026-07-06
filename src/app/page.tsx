import { HomeClient } from "@/components/public/home/HomeClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getHomeSettings, getPosts, getFeaturedProject } from "@/lib/cms";
import { IMAGES } from "@/lib/data/seed";
import type { FilmItem } from "@/components/public/home/FilmStrip";
import type { CatItem } from "@/components/public/home/CategoryCards";
import type { ZaireBlock } from "@/components/public/home/ArchiveBand";

export default function HomePage() {
  const home = getHomeSettings();
  const posts = getPosts();

  const byId = new Map(posts.map((p) => [p.id, p]));
  const picked = ["p5", "p7", "p1", "p3", "p2"].map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const source = picked.length >= 4 ? picked : posts.slice(0, 5);
  const films: FilmItem[] = source.map((p) => ({
    title: p.title,
    img: p.heroImage,
    isVideo: p.type === "video",
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

  const project = getFeaturedProject();
  const zaire: ZaireBlock = project
    ? {
        title: project.title.toUpperCase(),
        tags: project.tags.map((t) => t.toUpperCase()),
        description: project.shortDescription,
        href: `/proyectos/${project.slug}`,
      }
    : {
        title: "ZAIRE",
        tags: ["DOCUMENTAL", "ÁFRICA", "HISTORIA REAL"],
        description: "Un viaje a lo profundo de África Central para contar historias de resiliencia, naturaleza y humanidad.",
        href: "/proyectos/zaire",
      };

  const gallery = [
    IMAGES.projectZaire,
    IMAGES.travelMountain,
    IMAGES.filmStill,
    IMAGES.airplaneWing,
    IMAGES.cityWindow,
    IMAGES.coffee,
  ];

  return (
    <>
      <HomeClient home={home} films={films} cats={cats} zaire={zaire} gallery={gallery} />
      <SiteFooter />
    </>
  );
}
