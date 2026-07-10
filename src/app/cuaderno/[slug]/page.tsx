import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { ArticleView } from "@/components/public/cuaderno/ArticleView";
import { isPublicPost } from "@/lib/cms";
import { getPostsSSR, getPostBySlugSSR, getPostByIdSSR } from "@/lib/cms/ssr";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getPostsSSR()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugSSR(slug);
  if (!post) return { title: "Entrada no encontrada" };
  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.seo.ogImage || post.heroImage }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlugSSR(slug);
  if (!post) notFound();

  const all = await getPostsSSR();
  const idx = all.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  // Relacionados: primero los marcados a mano, luego se completan con posts de
  // la misma categoría y, si faltan, con los más recientes. Hasta 4, sin repetir
  // ni incluir el post actual. Así SIEMPRE hay cards para "seguir leyendo".
  const RELATED_MAX = 4;
  const explicit = (await Promise.all((post.related || []).map((id) => getPostByIdSSR(id)))).filter(
    (p): p is NonNullable<typeof p> => !!p && isPublicPost(p)
  );
  const related: typeof all = [];
  const seen = new Set<string>([post.id]);
  for (const p of [...explicit, ...all.filter((p) => p.category === post.category), ...all]) {
    if (related.length >= RELATED_MAX) break;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    related.push(p);
  }

  return (
    <InteriorShell>
      <ArticleView post={post} related={related} prev={prev} next={next} />
    </InteriorShell>
  );
}
