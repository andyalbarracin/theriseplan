import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { ProyectosView } from "@/components/public/proyectos/ProyectosView";
import { getProjectsSSR, getFeaturedProjectSSR } from "@/lib/cms/ssr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Trabajo seleccionado en dirección creativa, documental y sistemas. Historias construidas con intención.",
};

export default async function ProyectosPage() {
  const featured = await getFeaturedProjectSSR();
  const all = await getProjectsSSR();
  const grid = all.filter((p) => !featured || p.id !== featured.id);

  return (
    <InteriorShell>
      <ProyectosView featured={featured} grid={grid} />
    </InteriorShell>
  );
}
