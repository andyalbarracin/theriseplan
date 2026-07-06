import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/types";
import { ContentBlocks } from "@/components/public/ContentBlocks";

const COLUMN = 820;

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Activo",
  building: "Construyendo",
  paused: "En pausa",
  archived: "Archivado",
  draft: "Borrador",
};

export function ProjectView({ project }: { project: Project }) {
  const meta = [
    ["ROL", project.role],
    ["CRONOLOGÍA", project.timeline],
    ["TIPO", project.type],
    ["ESTADO", STATUS_LABEL[project.status]],
  ].filter(([, v]) => v && v !== "—");

  return (
    <main data-screen-label="Proyecto" style={{ position: "relative", padding: "44px 56px 40px" }}>
      <Link href="/proyectos" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".16em", color: "#6b6c66" }}>
        ← PROYECTOS
      </Link>

      {/* hero band */}
      <div style={{ position: "relative", width: "100%", height: 520, overflow: "hidden", marginTop: 24, background: "linear-gradient(175deg,#b7bcc0,#474d55 48%,#12151a)", borderRadius: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(8,9,10,.2) 0%,rgba(8,9,10,.15) 45%,rgba(8,9,10,.82) 100%)" }} />
        <div style={{ position: "absolute", left: 48, bottom: 44, right: 48 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, letterSpacing: ".14em", color: "#F4F2EF", background: "rgba(20,20,18,.5)", border: "1px solid rgba(244,242,239,.25)", borderRadius: 20, padding: "6px 13px", backdropFilter: "blur(2px)" }}>{STATUS_LABEL[project.status].toUpperCase()}</span>
            {project.tags.map((t) => (
              <span key={t} style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(244,242,239,.85)", border: "1px solid rgba(244,242,239,.25)", borderRadius: 20, padding: "6px 13px" }}>{t.toUpperCase()}</span>
            ))}
          </div>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 72, letterSpacing: ".02em", color: "#F4F2EF", lineHeight: 1 }}>{project.title}</h1>
          {project.subtitle && <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.5, color: "rgba(244,242,239,.85)", maxWidth: 560 }}>{project.subtitle}</p>}
        </div>
      </div>

      {/* meta strip */}
      <div style={{ display: "flex", gap: 56, flexWrap: "wrap", marginTop: 34, paddingBottom: 30, borderBottom: "1px solid #d9d5cc" }}>
        {meta.map(([k, v]) => (
          <div key={k as string}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>{k}</div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* body */}
      <div style={{ maxWidth: COLUMN, margin: "0 auto", paddingTop: 30 }}>
        {project.longDescription && (
          <p style={{ margin: "0 0 8px", fontFamily: "var(--font-serif)", fontSize: 24, lineHeight: 1.5, color: "#1B1D20" }}>{project.longDescription}</p>
        )}
        <ContentBlocks blocks={project.blocks} />

        {project.gallery.length > 0 && (
          <div style={{ margin: "34px 0", display: "grid", gridTemplateColumns: `repeat(${Math.min(project.gallery.length, 3)},1fr)`, gap: 12 }}>
            {project.gallery.map((u, i) => (
              <div key={i} style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div style={{ marginTop: 30, borderTop: "1px solid #d9d5cc", paddingTop: 24 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#9a988f" }}>ENLACES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {project.links.map((l) => (
                <a key={l.label} href={l.url} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, color: "#1B1D20", borderBottom: "1px solid #cbc7bc", paddingBottom: 4, width: "fit-content" }}>
                  {l.label} <span style={{ fontSize: 14, color: "#2F5DAA" }}>&#8599;</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 44 }}>
          <Link href="/proyectos" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".16em", color: "#2F5DAA" }}>← VER TODOS LOS PROYECTOS</Link>
        </div>
      </div>
    </main>
  );
}
