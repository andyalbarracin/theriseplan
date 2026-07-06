import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { ProjectView } from "@/components/public/proyectos/ProjectView";
import { getProjectsSSR, getProjectBySlugSSR } from "@/lib/cms/ssr";

export async function generateStaticParams() {
  return (await getProjectsSSR()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugSSR(slug);
  if (!project) return { title: "Proyecto no encontrado" };
  return {
    title: project.seo.title || project.title,
    description: project.seo.description || project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.seo.ogImage || project.heroImage }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlugSSR(slug);
  if (!project) notFound();

  return (
    <InteriorShell>
      <ProjectView project={project} />
    </InteriorShell>
  );
}
