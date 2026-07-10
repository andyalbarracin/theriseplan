import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { CuadernoView } from "@/components/public/cuaderno/CuadernoView";
import { getPostsSSR, getHomeSettingsSSR } from "@/lib/cms/ssr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cuaderno",
  description: "Notas, ideas y reflexiones desde el camino. Un archivo personal, no lineal, en constante movimiento.",
};

export default async function CuadernoPage() {
  const posts = await getPostsSSR();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const home = await getHomeSettingsSSR();
  const featuredId = home.featuredPosts[0];
  const featured =
    posts.find((p) => p.id === featuredId) || posts.find((p) => p.featured) || posts[0] || null;

  return (
    <InteriorShell>
      <CuadernoView posts={posts} categories={categories} featured={featured} />
    </InteriorShell>
  );
}
