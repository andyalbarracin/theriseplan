"use client";
import { useState } from "react";
import Link from "next/link";
import { listPosts } from "@/lib/cms/client";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminTopbar, Card, AdminButton, Badge, postBadge, DashPageBtn } from "@/components/admin/ui";
import { formatDateES } from "@/lib/utils/format";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "published", label: "Publicados" },
  { key: "draft", label: "Borradores" },
  { key: "archived", label: "Archivados" },
];

export default function DashboardCuaderno() {
  const { data } = useAsyncData(() => listPosts());
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const posts = data ?? [];
  const pub = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const filtered = posts
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => {
      const s = q.trim().toLowerCase();
      return !s || (p.title + " " + p.category).toLowerCase().includes(s);
    });

  // Paginación
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * pageSize, current * pageSize);
  // Al cambiar filtros/tamaño, volver a la página 1.
  const setStatusR = (s: string) => { setStatus(s); setPage(1); };
  const setQR = (s: string) => { setQ(s); setPage(1); };
  const setSizeR = (n: number) => { setPageSize(n); setPage(1); };

  return (
    <>
      <AdminTopbar
        title="Cuaderno"
        eyebrow={`${posts.length} ENTRADAS · ${pub} PUBLICADAS · ${drafts} BORRADORES`}
        actions={
          <>
            <input value={q} onChange={(e) => setQR(e.target.value)} placeholder="Buscar…" style={{ height: 44, width: 220, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none", background: "#fff" }} />
            <AdminButton href="/dashboard/cuaderno/new">＋ Nuevo artículo</AdminButton>
          </>
        }
      />

      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f", marginRight: 4 }}>ESTADO</span>
          {FILTERS.map((f) => {
            const active = status === f.key;
            return (
              <button key={f.key} onClick={() => setStatusR(f.key)} style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "var(--font-sans)", color: active ? "#F4F2EF" : "#55565a", background: active ? "#0D0D0E" : "transparent", border: active ? "1px solid #0D0D0E" : "1px solid #cbc7bc" }}>
                {f.label}
              </button>
            );
          })}
          {/* selector de cuántos mostrar por página */}
          <label style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>
            MOSTRAR
            <select value={pageSize} onChange={(e) => setSizeR(Number(e.target.value))} style={{ height: 34, border: "1px solid #cbc7bc", borderRadius: 6, background: "#fff", padding: "0 8px", fontFamily: "var(--font-sans)", fontSize: 13, color: "#1B1D20", cursor: "pointer" }}>
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 130px 120px 110px 60px", gap: 20, alignItems: "center", padding: "16px 26px", borderBottom: "1px solid #eee9df", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>
            <span></span>
            <span>TÍTULO</span>
            <span>TIPO</span>
            <span>ESTADO</span>
            <span>FECHA</span>
            <span></span>
          </div>
          {paged.map((p) => {
            const b = postBadge(p.status);
            return (
              <Link key={p.id} href={`/dashboard/cuaderno/${p.id}`} style={{ display: "grid", gridTemplateColumns: "72px 1fr 130px 120px 110px 60px", gap: 20, alignItems: "center", padding: "16px 26px", borderBottom: "1px solid #f1ede4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.heroImage} alt="" style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 3, background: "#15130e" }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                    {p.featured && <span style={{ fontSize: 9, letterSpacing: ".1em", color: "#1f8a5b", background: "rgba(31,138,91,.12)", borderRadius: 20, padding: "3px 8px", flex: "none" }}>★ DESTACADO</span>}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "#a5a29a" }}>{p.category.toUpperCase()}</div>
                </div>
                <span style={{ fontSize: 13, color: "#55565a", textTransform: "capitalize" }}>{p.type}</span>
                <Badge {...b} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8a887f" }}>{p.publishedAt ? formatDateES(p.publishedAt) : "—"}</span>
                <span style={{ fontSize: 18, color: "#1B1D20", justifySelf: "end" }}>→</span>
              </Link>
            );
          })}
          {paged.length === 0 && <div style={{ padding: "40px 26px", fontSize: 14, color: "#8a887f" }}>Sin resultados.</div>}
        </Card>

        {/* paginación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
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
