/* =============================================================================
   Archivo:     CuadernoView.tsx
   Ruta:        web/src/components/public/cuaderno/CuadernoView.tsx
   Modificado:  2026-07-06
   Descripcion: Vista pública del Cuaderno (lista de artículos). Responsiva:
                usa clamp() para tipografía/espaciados y apila las filas en
                celular. Incluye PAGINACIÓN para que, con muchos posts, el scroll
                no sea eterno. Para cambiar cuántos entran por página, editar
                PAGE_SIZE abajo.
   ============================================================================= */
"use client";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDateES } from "@/lib/utils/format";
import { useViewport } from "@/hooks/useViewport";

const PAGE_SIZE = 8; // artículos por página

export function CuadernoView({
  posts,
  categories,
  featured,
}: {
  posts: Post[];
  categories: string[];
  featured: Post | null;
}) {
  const [cat, setCat] = useState<string>("Todo");
  const [page, setPage] = useState(1);
  const vw = useViewport();
  const mobile = vw < 760;

  const list = cat === "Todo" ? posts : posts.filter((p) => p.category === cat);
  const chips = ["Todo", ...categories];

  // Paginación
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);

  // Al cambiar de categoría, volver a la página 1.
  const pickCat = (c: string) => {
    setCat(c);
    setPage(1);
  };

  return (
    <main data-screen-label="Cuaderno" style={{ position: "relative", padding: "clamp(36px,5vw,64px) clamp(18px,5vw,56px) 30px" }}>
      {/* línea decorativa punteada: solo en pantallas amplias */}
      {!mobile && <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 0, borderLeft: "1.5px dashed #cbc8bf" }} />}

      {/* encabezado de página */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>01 / CUADERNO</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(46px,9vw,88px)", lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Cuaderno</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: "clamp(24px,4vw,32px)", color: "#2F5DAA" }}>documentar lo importante.</p>
          <p style={{ margin: "26px 0 0", fontSize: 15.5, lineHeight: 1.62, color: "#4a4c50", maxWidth: 460 }}>
            Notas, ideas y reflexiones desde el camino. Un archivo personal, no lineal, en constante movimiento.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#a5a29a" }}>ENTRADAS</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px,7vw,56px)", lineHeight: 1, color: "#1B1D20" }}>{String(posts.length).padStart(2, "0")}</div>
        </div>
      </div>

      {/* card destacada */}
      {featured && (
        <Link
          href={`/cuaderno/${featured.slug}`}
          style={{
            display: "block",
            position: "relative",
            marginTop: "clamp(32px,4vw,52px)",
            height: "clamp(260px,42vw,360px)",
            overflow: "hidden",
            background: "linear-gradient(120deg,#5a5346 0%,#33302a 38%,#1a1812 72%,#100f0a 100%)",
            boxShadow: "0 30px 60px -30px rgba(20,18,14,.5)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(10,9,6,.82) 0%,rgba(10,9,6,.3) 55%,rgba(10,9,6,.1) 100%)" }} />
          <div style={{ position: "absolute", left: "clamp(20px,5vw,56px)", top: "clamp(24px,4vw,52px)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#c8b78f" }}>
              NOTA DESTACADA · {formatDateES(featured.publishedAt)}
            </span>
          </div>
          <div style={{ position: "absolute", left: "clamp(20px,5vw,56px)", right: "clamp(20px,5vw,56px)", bottom: "clamp(24px,4vw,52px)", maxWidth: 540 }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(28px,5vw,46px)", lineHeight: 1.04, color: "#F4F2EF" }}>{featured.title}</h2>
            {!mobile && <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: "#cdcabf", maxWidth: 430 }}>{featured.excerpt}</p>}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 20, fontSize: 14.5, color: "#F4F2EF", borderBottom: "1px solid rgba(244,242,239,.6)", paddingBottom: 5 }}>
              Leer más <span style={{ fontSize: 16 }}>&#8594;</span>
            </span>
          </div>
        </Link>
      )}

      {/* filtros por categoría */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 44, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", color: "#a5a29a", marginRight: 6 }}>FILTRAR</span>
        {chips.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => pickCat(c)}
              style={{
                fontSize: 12,
                letterSpacing: ".06em",
                color: active ? "#F4F2EF" : "#55565a",
                background: active ? "#1B1D20" : "transparent",
                border: active ? "1px solid #1B1D20" : "1px solid #cbc7bc",
                borderRadius: 20,
                padding: "8px 16px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* lista de entradas (paginada) */}
      <div style={{ marginTop: 20 }}>
        {pageItems.map((p, i) => {
          const n = start + i + 1;
          return (
            <Link
              key={p.id}
              href={`/cuaderno/${p.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "118px 150px 1fr 40px",
                gap: mobile ? 14 : 40,
                alignItems: "start",
                padding: mobile ? "26px 0" : "36px 0",
                borderTop: "1px solid #d9d5cc",
                borderBottom: i === pageItems.length - 1 ? "1px solid #d9d5cc" : undefined,
              }}
            >
              {!mobile && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, color: "#9a988f" }}>
                  N.{String(n).padStart(2, "0")}
                  <br />
                  <span style={{ color: "#c0bdb4" }}>{formatDateES(p.publishedAt)}</span>
                </div>
              )}
              <div style={{ position: "relative", width: "100%", aspectRatio: mobile ? "16/9" : "3/2", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                {mobile && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "#a5a29a", marginBottom: 6 }}>
                    N.{String(n).padStart(2, "0")} · {formatDateES(p.publishedAt)}
                  </div>
                )}
                <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(22px,4vw,30px)", lineHeight: 1.15, color: "#1B1D20" }}>{p.title}</h3>
                {p.excerpt && <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#55565a", maxWidth: 620 }}>{p.excerpt}</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#6b6c66", border: "1px solid #d2cec3", borderRadius: 16, padding: "5px 11px" }}>{p.category.toUpperCase()}</span>
                  <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#6b6c66", border: "1px solid #d2cec3", borderRadius: 16, padding: "5px 11px" }}>{p.type.toUpperCase()}</span>
                </div>
              </div>
              {!mobile && <span style={{ fontSize: 19, color: "#1B1D20", justifySelf: "end" }}>&#8594;</span>}
            </Link>
          );
        })}
        {list.length === 0 && (
          <p style={{ padding: "48px 0", fontSize: 15, color: "#8a887f" }}>No hay entradas en esta categoría todavía.</p>
        )}
      </div>

      {/* paginación */}
      {pageCount > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
          <PageBtn label="‹ Anterior" disabled={current <= 1} onClick={() => setPage(current - 1)} />
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <PageBtn key={n} label={String(n)} active={n === current} onClick={() => setPage(n)} />
          ))}
          <PageBtn label="Siguiente ›" disabled={current >= pageCount} onClick={() => setPage(current + 1)} />
        </div>
      )}
    </main>
  );
}

/** Botón de paginación (número o anterior/siguiente). */
function PageBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 40,
        height: 40,
        padding: "0 14px",
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 13.5,
        color: disabled ? "#c0bdb4" : active ? "#F4F2EF" : "#1B1D20",
        background: active ? "#1B1D20" : "transparent",
        border: active ? "1px solid #1B1D20" : "1px solid #cbc7bc",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}
