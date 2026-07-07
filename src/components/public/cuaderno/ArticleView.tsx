import Link from "next/link";
import type { Post } from "@/lib/types";
import { ContentBlocks } from "@/components/public/ContentBlocks";
import { formatDateES, readingLabel } from "@/lib/utils/format";

const COLUMN = 760;

export function ArticleView({
  post,
  related,
  prev,
  next,
}: {
  post: Post;
  related: Post[];
  prev: Post | null;
  next: Post | null;
}) {
  const meta = [post.category, post.type, formatDateES(post.publishedAt), readingLabel(post.readingTime)]
    .filter(Boolean)
    .map((s) => (s === post.type ? s.toUpperCase() : s));

  return (
    <main data-screen-label="Artículo" style={{ position: "relative", padding: "clamp(28px,4vw,44px) clamp(18px,5vw,56px) 40px" }}>
      <Link href="/cuaderno" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".16em", color: "#6b6c66" }}>
        ← CUADERNO
      </Link>

      <div style={{ maxWidth: COLUMN, margin: "0 auto", paddingTop: 40, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", color: "#9a988f" }}>
          {meta.map((m, i) => (
            <span key={i} style={{ display: "inline-flex", gap: 14 }}>
              {i > 0 && <span style={{ color: "#c9c5bb" }}>·</span>}
              {String(m).toUpperCase()}
            </span>
          ))}
        </div>
        <h1 style={{ margin: "22px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(32px,6vw,56px)", lineHeight: 1.06, letterSpacing: "-.015em", color: "#1A1C1F" }}>{post.title}</h1>
        {post.subtitle && <p style={{ margin: "16px 0 0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(17px,3vw,21px)", lineHeight: 1.45, color: "#55565a" }}>{post.subtitle}</p>}
      </div>

      {/* hero */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "21/9", overflow: "hidden", background: "#15130e", margin: "40px 0 0", borderRadius: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(6,7,4,.4)" }} />
        {post.location && (
          <span style={{ position: "absolute", right: 20, bottom: 16, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.5)" }}>
            {(post.location.city || post.location.name || "").toUpperCase()}
          </span>
        )}
      </div>

      {/* body */}
      <article style={{ maxWidth: COLUMN, margin: "0 auto", paddingTop: 20 }}>
        <ContentBlocks blocks={post.bodyBlocks} />
      </article>

      {/* seguir leyendo (relacionados) — cards estilo home, responsivas.
          El grid auto-fill acomoda 3-4 en desktop y 1 en celular solo. */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1040, margin: "0 auto", marginTop: 56 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#9a988f", borderTop: "1px solid #d9d5cc", paddingTop: 26 }}>SEGUIR LEYENDO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 22, marginTop: 20 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/cuaderno/${r.slug}`} className="hcard" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#a5a29a" }}>{r.category.toUpperCase()}</div>
                <h3 style={{ margin: "6px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 19, lineHeight: 1.18, color: "#1B1D20" }}>{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* navegación anterior / siguiente — compacta y sin superponerse.
          auto-fit: 2 columnas en desktop, 1 apilada en celular. Títulos a una
          sola línea con "…" para que no crezcan feo. */}
      {(prev || next) && (
        <nav style={{ maxWidth: COLUMN, margin: "0 auto", marginTop: 48, paddingTop: 22, borderTop: "1px solid #d9d5cc", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
          <div style={{ minWidth: 0 }}>
            {prev && (
              <Link href={`/cuaderno/${prev.slug}`} style={{ display: "block" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>← ANTERIOR</div>
                <div style={{ marginTop: 5, fontFamily: "var(--font-serif)", fontSize: "clamp(14px,2.4vw,16px)", lineHeight: 1.3, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prev.title}</div>
              </Link>
            )}
          </div>
          <div style={{ minWidth: 0, textAlign: "right" }}>
            {next && (
              <Link href={`/cuaderno/${next.slug}`} style={{ display: "block" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>SIGUIENTE →</div>
                <div style={{ marginTop: 5, fontFamily: "var(--font-serif)", fontSize: "clamp(14px,2.4vw,16px)", lineHeight: 1.3, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next.title}</div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
