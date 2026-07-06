import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "ACTIVO",
  building: "EN PROCESO",
  paused: "EN PAUSA",
  archived: "ARCHIVADO",
  draft: "BORRADOR",
};

const tagChip = { fontSize: 10, letterSpacing: ".14em", color: "#6b6c66", border: "1px solid #cbc7bc", borderRadius: 20, padding: "6px 13px" } as const;

export function ProyectosView({ featured, grid }: { featured: Project | null; grid: Project[] }) {
  const total = (featured ? 1 : 0) + grid.length;
  return (
    <main data-screen-label="Proyectos" style={{ position: "relative", padding: "64px 56px 30px" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>02 / PROYECTOS</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 88, lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Proyectos</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: 32, color: "#2F5DAA" }}>historias que cobran vida.</p>
          <p style={{ margin: "26px 0 0", fontSize: 15.5, lineHeight: 1.62, color: "#4a4c50", maxWidth: 480 }}>
            Trabajo seleccionado en dirección creativa, documental y sistemas. Historias construidas con intención.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#a5a29a" }}>EN ARCHIVO</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 56, lineHeight: 1, color: "#1B1D20" }}>{String(total).padStart(2, "0")}</div>
        </div>
      </div>

      {/* featured */}
      {featured && (
        <div style={{ display: "flex", marginTop: 52, boxShadow: "0 30px 60px -30px rgba(20,18,14,.45)" }}>
          <div style={{ position: "relative", width: "52%", minHeight: 420, overflow: "hidden", background: "linear-gradient(175deg,#b7bcc0 0%,#7f858b 22%,#474d55 48%,#252b32 72%,#12151a 100%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 90px rgba(6,7,5,.6)", background: "linear-gradient(180deg,rgba(0,0,0,0) 44%,rgba(8,8,6,.5))" }} />
            <span style={{ position: "absolute", left: 24, bottom: 18, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.34)" }}>ÁFRICA CENTRAL · 6K</span>
          </div>
          <div style={{ width: "48%", background: "#EAE6DD", padding: "56px 52px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 10, letterSpacing: ".14em", color: "#2F5DAA", border: "1px solid #2F5DAA", borderRadius: 20, padding: "5px 12px" }}>DESTACADO</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".16em", color: "#9a988f" }}>{featured.timeline || "2026 —"}</span>
            </div>
            <h2 style={{ margin: "22px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 58, letterSpacing: ".05em", color: "#1B1D20" }}>{featured.title.toUpperCase()}</h2>
            <div style={{ display: "flex", gap: 10, margin: "20px 0 0", flexWrap: "wrap" }}>
              {featured.tags.map((t) => (
                <span key={t} style={tagChip}>{t.toUpperCase()}</span>
              ))}
            </div>
            <p style={{ margin: "22px 0 0", fontSize: 15, lineHeight: 1.62, color: "#4a4c50", maxWidth: 400 }}>{featured.shortDescription}</p>
            <Link href={`/proyectos/${featured.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 16, marginTop: 24, fontSize: 14.5, color: "#1B1D20", borderBottom: "1px solid #1B1D20", paddingBottom: 5, width: "fit-content" }}>
              Ver proyecto <span style={{ fontSize: 16 }}>&#8594;</span>
            </Link>
          </div>
        </div>
      )}

      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 34, marginTop: 56 }}>
        {grid.map((pr) => (
          <Link key={pr.id} href={`/proyectos/${pr.slug}`} className="hcard" style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "linear-gradient(160deg,#3a4048,#161a20)", boxShadow: "inset 0 0 60px rgba(6,7,9,.55)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pr.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", left: 14, top: 14, fontSize: 9, letterSpacing: ".12em", color: "#F4F2EF", background: "rgba(20,20,18,.55)", borderRadius: 14, padding: "6px 12px", backdropFilter: "blur(2px)" }}>{STATUS_LABEL[pr.status]}</span>
              <span style={{ position: "absolute", left: 14, bottom: 12, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".26em", color: "rgba(244,242,239,.5)" }}>{pr.type.toUpperCase()}</span>
            </div>
            <h3 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 27, color: "#1B1D20" }}>{pr.title}</h3>
            <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#55565a" }}>{pr.shortDescription}</p>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#6b6c66", border: "1px solid #d2cec3", borderRadius: 16, padding: "5px 11px" }}>{(pr.tags[0] || pr.type).toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
