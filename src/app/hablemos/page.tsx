import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { HablemosView } from "@/components/public/hablemos/HablemosView";

export const metadata: Metadata = {
  title: "Hablemos",
  description: "¿Tienes un proyecto, una historia o una idea en tránsito? Escríbeme. Respondo personalmente.",
};

export default function HablemosPage() {
  return (
    <InteriorShell>
      <HablemosView />
    </InteriorShell>
  );
}
