import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { ProyectosView } from "@/components/public/proyectos/ProyectosView";
import { getProjects, getFeaturedProject } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Trabajo seleccionado en dirección creativa, documental y sistemas. Historias construidas con intención.",
};

export default function ProyectosPage() {
  const featured = getFeaturedProject();
  const all = getProjects();
  const grid = all.filter((p) => !featured || p.id !== featured.id);

  return (
    <InteriorShell>
      <ProyectosView featured={featured} grid={grid} />
    </InteriorShell>
  );
}
