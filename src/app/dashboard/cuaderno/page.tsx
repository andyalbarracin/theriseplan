"use client";
import { useState } from "react";
import Link from "next/link";
import { getPosts } from "@/lib/cms";
import { useClientData } from "@/hooks/useClientData";
import { AdminTopbar, Card, AdminButton, Badge, postBadge } from "@/components/admin/ui";
import { formatDateES } from "@/lib/utils/format";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "published", label: "Publicados" },
  { key: "draft", label: "Borradores" },
  { key: "archived", label: "Archivados" },
];

export default function DashboardCuaderno() {
  const { data } = useClientData(() => getPosts({ includeAll: true }));
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const posts = data ?? [];
  const pub = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const filtered = posts
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => {
      const s = q.trim().toLowerCase();
      return !s || (p.title + " " + p.category).toLowerCase().includes(s);
    });

  return (
    <>
      <AdminTopbar
        title="Cuaderno"
        eyebrow={`${posts.length} ENTRADAS · ${pub} PUBLICADAS · ${drafts} BORRADORES`}
        actions={
          <>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" style={{ height: 44, width: 220, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none", background: "#fff" }} />
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
              <button key={f.key} onClick={() => setStatus(f.key)} style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "var(--font-sans)", color: active ? "#F4F2EF" : "#55565a", background: active ? "#0D0D0E" : "transparent", border: active ? "1px solid #0D0D0E" : "1px solid #cbc7bc" }}>
                {f.label}
              </button>
            );
          })}
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
          {filtered.map((p) => {
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
          {filtered.length === 0 && <div style={{ padding: "40px 26px", fontSize: 14, color: "#8a887f" }}>Sin resultados.</div>}
        </Card>
      </main>
    </>
  );
}
