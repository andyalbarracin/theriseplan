"use client";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDateES } from "@/lib/utils/format";

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
  const list = cat === "Todo" ? posts : posts.filter((p) => p.category === cat);
  const chips = ["Todo", ...categories];

  return (
    <main data-screen-label="Cuaderno" style={{ position: "relative", padding: "64px 56px 30px" }}>
      <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 0, borderLeft: "1.5px dashed #cbc8bf" }} />

      {/* page head */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>01 / CUADERNO</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 88, lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Cuaderno</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: 32, color: "#2F5DAA" }}>documentar lo importante.</p>
          <p style={{ margin: "26px 0 0", fontSize: 15.5, lineHeight: 1.62, color: "#4a4c50", maxWidth: 460 }}>
            Notas, ideas y reflexiones desde el camino. Un archivo personal, no lineal, en constante movimiento.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#a5a29a" }}>ENTRADAS</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 56, lineHeight: 1, color: "#1B1D20" }}>{String(posts.length).padStart(2, "0")}</div>
        </div>
      </div>

      {/* featured overlay card */}
      {featured && (
        <Link
          href={`/cuaderno/${featured.slug}`}
          style={{
            display: "block",
            position: "relative",
            marginTop: 52,
            height: 360,
            overflow: "hidden",
            background: "linear-gradient(120deg,#5a5346 0%,#33302a 38%,#1a1812 72%,#100f0a 100%)",
            boxShadow: "0 30px 60px -30px rgba(20,18,14,.5)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "52%", background: "radial-gradient(80% 90% at 90% 30%,rgba(120,150,190,.18),transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(10,9,6,.82) 0%,rgba(10,9,6,.3) 55%,rgba(10,9,6,.1) 100%)" }} />
          <div style={{ position: "absolute", left: 56, top: 52 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#c8b78f" }}>
              NOTA DESTACADA · {formatDateES(featured.publishedAt)}
            </span>
          </div>
          <div style={{ position: "absolute", left: 56, bottom: 52, maxWidth: 540 }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 46, lineHeight: 1.04, color: "#F4F2EF" }}>{featured.title}</h2>
            <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: "#cdcabf", maxWidth: 430 }}>{featured.excerpt}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 24, fontSize: 14.5, color: "#F4F2EF", borderBottom: "1px solid rgba(244,242,239,.6)", paddingBottom: 5 }}>
              Leer más <span style={{ fontSize: 16 }}>&#8594;</span>
            </span>
          </div>
          <span style={{ position: "absolute", right: 24, bottom: 18, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.32)" }}>CDG · 35MM</span>
        </Link>
      )}

      {/* filter chips */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 44, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", color: "#a5a29a", marginRight: 6 }}>FILTRAR</span>
        {chips.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
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

      {/* entries list */}
      <div style={{ marginTop: 20 }}>
        {list.map((p, idx) => (
          <Link
            key={p.id}
            href={`/cuaderno/${p.slug}`}
            style={{
              display: "grid",
              gridTemplateColumns: "118px 150px 1fr 40px",
              gap: 40,
              alignItems: "start",
              padding: "36px 0",
              borderTop: "1px solid #d9d5cc",
              borderBottom: idx === list.length - 1 ? "1px solid #d9d5cc" : undefined,
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, color: "#9a988f" }}>
              N.{String(idx + 1).padStart(2, "0")}
              <br />
              <span style={{ color: "#c0bdb4" }}>{formatDateES(p.publishedAt)}</span>
            </div>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 30, color: "#1B1D20" }}>{p.title}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#55565a", maxWidth: 620 }}>{p.excerpt}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#6b6c66", border: "1px solid #d2cec3", borderRadius: 16, padding: "5px 11px" }}>{p.category.toUpperCase()}</span>
                <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#6b6c66", border: "1px solid #d2cec3", borderRadius: 16, padding: "5px 11px" }}>{p.type.toUpperCase()}</span>
              </div>
            </div>
            <span style={{ fontSize: 19, color: "#1B1D20", justifySelf: "end" }}>&#8594;</span>
          </Link>
        ))}
        {list.length === 0 && (
          <p style={{ padding: "48px 0", fontSize: 15, color: "#8a887f" }}>No hay entradas en esta categoría todavía.</p>
        )}
      </div>
    </main>
  );
}
