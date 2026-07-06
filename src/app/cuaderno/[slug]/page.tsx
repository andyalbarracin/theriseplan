import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { ArticleView } from "@/components/public/cuaderno/ArticleView";
import { getPosts, getPostBySlug, getPostById, isPublicPost } from "@/lib/cms";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = (post.related || [])
    .map((id) => getPostById(id))
    .filter((p): p is NonNullable<typeof p> => !!p && isPublicPost(p));

  const all = getPosts();
  const idx = all.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <InteriorShell>
      <ArticleView post={post} related={related} prev={prev} next={next} />
    </InteriorShell>
  );
}
