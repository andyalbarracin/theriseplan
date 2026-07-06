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
    <main data-screen-label="Artículo" style={{ position: "relative", padding: "44px 56px 40px" }}>
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
        <h1 style={{ margin: "22px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 56, lineHeight: 1.06, letterSpacing: "-.015em", color: "#1A1C1F" }}>{post.title}</h1>
        {post.subtitle && <p style={{ margin: "16px 0 0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 21, lineHeight: 1.45, color: "#55565a" }}>{post.subtitle}</p>}
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

      {/* related + nav */}
      <div style={{ maxWidth: COLUMN, margin: "0 auto", marginTop: 48 }}>
        {related.length > 0 && (
          <>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#9a988f", borderTop: "1px solid #d9d5cc", paddingTop: 26 }}>SEGUIR LEYENDO</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
              {related.map((r) => (
                <Link key={r.id} href={`/cuaderno/${r.slug}`} className="hcard" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#a5a29a" }}>{r.category.toUpperCase()}</div>
                  <h3 style={{ margin: "6px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: "#1B1D20" }}>{r.title}</h3>
                </Link>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginTop: 48, paddingTop: 26, borderTop: "1px solid #d9d5cc", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            {prev && (
              <Link href={`/cuaderno/${prev.slug}`}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>← ANTERIOR</div>
                <div style={{ marginTop: 6, fontFamily: "var(--font-serif)", fontSize: 18, color: "#1B1D20" }}>{prev.title}</div>
              </Link>
            )}
          </div>
          <div style={{ minWidth: 0, textAlign: "right" }}>
            {next && (
              <Link href={`/cuaderno/${next.slug}`}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>SIGUIENTE →</div>
                <div style={{ marginTop: 6, fontFamily: "var(--font-serif)", fontSize: 18, color: "#1B1D20" }}>{next.title}</div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
