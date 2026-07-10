"use client";
import { useState } from "react";
import Link from "next/link";
import { listProjects } from "@/lib/cms/client";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminTopbar, AdminButton, projectBadge, DashPageBtn } from "@/components/admin/ui";

export default function DashboardProyectos() {
  const { data } = useAsyncData(() => listProjects());
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const all = data ?? [];
  const pub = all.filter((p) => p.visibility === "public" && !p.sensitive && p.status !== "draft").length;
  const hidden = all.length - pub;
  const filtered = all.filter((p) => {
    const s = q.trim().toLowerCase();
    return !s || (p.title + " " + p.type + " " + p.tags.join(" ")).toLowerCase().includes(s);
  });

  // Paginación
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * pageSize, current * pageSize);
  const setQR = (s: string) => { setQ(s); setPage(1); };
  const setSizeR = (n: number) => { setPageSize(n); setPage(1); };

  return (
    <>
      <AdminTopbar
        title="Proyectos"
        eyebrow={`${all.length} PROYECTOS · ${pub} PÚBLICOS · ${hidden} PRIVADOS`}
        actions={
          <>
            <input value={q} onChange={(e) => setQR(e.target.value)} placeholder="Buscar…" style={{ height: 44, width: 220, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none", background: "#fff" }} />
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>
              MOSTRAR
              <select value={pageSize} onChange={(e) => setSizeR(Number(e.target.value))} style={{ height: 34, border: "1px solid #cbc7bc", borderRadius: 6, background: "#fff", padding: "0 8px", fontFamily: "var(--font-sans)", fontSize: 13, color: "#1B1D20", cursor: "pointer" }}>
                {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <AdminButton href="/dashboard/proyectos/new">＋ Nuevo proyecto</AdminButton>
          </>
        }
      />

      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 22 }}>
          {paged.map((pr) => {
            const b = projectBadge(pr);
            const isPrivate = pr.visibility !== "public" || pr.sensitive;
            return (
              <Link key={pr.id} href={`/dashboard/proyectos/${pr.id}`} className="hcard" style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #e5e1d7", borderRadius: 9, overflow: "hidden" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", background: "#15130e" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pr.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", left: 12, top: 12, fontSize: 9, letterSpacing: ".1em", color: b.color, background: b.bg, borderRadius: 20, padding: "5px 11px" }}>{b.label.toUpperCase()}</span>
                  {isPrivate && <span style={{ position: "absolute", right: 12, top: 12, fontSize: 9, letterSpacing: ".1em", color: "#F4F2EF", background: "rgba(162,59,59,.85)", borderRadius: 20, padding: "5px 11px" }}>🔒 PRIVADO</span>}
                </div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 23, color: "#1B1D20" }}>{pr.title}</span>
                    {pr.featured && <span style={{ color: "#1f8a5b", fontSize: 14 }}>★</span>}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "#a5a29a" }}>{`${pr.type} · ${pr.timeline || ""}`.toUpperCase()}</div>
                  <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#55565a", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{pr.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
        {paged.length === 0 && <p style={{ padding: "40px 0", fontSize: 14, color: "#8a887f" }}>Sin resultados.</p>}

        {/* paginación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#9a988f" }}>
            {filtered.length} RESULTADO{filtered.length === 1 ? "" : "S"} · PÁGINA {current} DE {pageCount}
          </span>
          {pageCount > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <DashPageBtn label="‹" disabled={current <= 1} onClick={() => setPage(current - 1)} />
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <DashPageBtn key={n} label={String(n)} active={n === current} onClick={() => setPage(n)} />
              ))}
              <DashPageBtn label="›" disabled={current >= pageCount} onClick={() => setPage(current + 1)} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
