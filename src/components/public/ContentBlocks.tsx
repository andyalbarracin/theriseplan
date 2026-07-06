import type { ContentBlock } from "@/lib/types";

/** Editorial renderer for the ContentBlock union — Playfair headings, Space-Mono
    tickets, handwritten accents, callouts, galleries, metrics and stacks. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p style={{ margin: "14px 0", fontSize: 17, lineHeight: 1.75, color: "#33352f" }}>{block.text}</p>;

    case "heading":
      return (
        <h2 style={{ margin: "38px 0 6px", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 30, lineHeight: 1.15, color: "#1B1D20" }}>
          {block.text}
        </h2>
      );

    case "quote":
      return (
        <blockquote style={{ margin: "34px 0", paddingLeft: 26, borderLeft: "2px solid #2F5DAA" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 26, lineHeight: 1.4, color: "#1B1D20" }}>“{block.text}”</p>
          {block.cite && <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", color: "#9a988f" }}>— {block.cite.toUpperCase()}</div>}
        </blockquote>
      );

    case "image":
      return (
        <figure style={{ margin: "34px 0" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.url} alt={block.caption || ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {block.caption && <figcaption style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", color: "#9a988f" }}>{block.caption}</figcaption>}
        </figure>
      );

    case "gallery":
      return (
        <div style={{ margin: "34px 0", display: "grid", gridTemplateColumns: `repeat(${Math.min(block.urls.length, 3)},1fr)`, gap: 12 }}>
          {block.urls.map((u, i) => (
            <div key={i} style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      );

    case "video":
      return (
        <figure style={{ margin: "34px 0" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#0D0D0E", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 50% 45%,rgba(47,93,170,.18),transparent 70%)" }} />
            <div style={{ width: 62, height: 62, borderRadius: "50%", border: "1px solid rgba(244,242,239,.7)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,13,14,.4)" }}>
              <span style={{ marginLeft: 4, borderLeft: "16px solid #F4F2EF", borderTop: "10px solid transparent", borderBottom: "10px solid transparent" }} />
            </div>
            <span style={{ position: "absolute", left: 14, bottom: 12, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", color: "rgba(244,242,239,.5)" }}>VIDEO · 35MM</span>
          </div>
          {block.caption && <figcaption style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", color: "#9a988f" }}>{block.caption}</figcaption>}
        </figure>
      );

    case "callout":
      return (
        <div style={{ margin: "30px 0", background: "rgba(47,93,170,.06)", border: "1px solid rgba(47,93,170,.2)", borderRadius: 4, padding: "22px 26px" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.45, color: "#1B1D20" }}>{block.text}</p>
        </div>
      );

    case "route":
      return (
        <div style={{ margin: "30px 0", display: "flex", alignItems: "center", gap: 18, background: "#EAE6DD", borderRadius: 4, padding: "18px 24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-serif)", fontSize: 26, color: "#1B1D20" }}>
            <span>{block.from}</span>
            <span style={{ fontSize: 16, color: "#6E7C8B" }}>&#8594;</span>
            <span>{block.to}</span>
            <span style={{ fontSize: 18 }}>&#9992;</span>
          </div>
          {block.meta && (
            <div style={{ display: "flex", gap: 22, marginLeft: "auto", flexWrap: "wrap" }}>
              {Object.entries(block.meta).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".16em", color: "#a09e95", textTransform: "uppercase" }}>{k}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, marginTop: 3, color: "#28271f" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "divider":
      return <hr style={{ margin: "36px 0", border: "none", height: 1, background: "#d9d5cc" }} />;

    case "handwritten":
      return (
        <p style={{ margin: "26px 0", fontFamily: "var(--font-hand)", fontSize: 27, lineHeight: 1.4, color: "#2F5DAA" }}>{block.text}</p>
      );

    case "feature":
      return (
        <ul style={{ margin: "24px 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: 16.5, lineHeight: 1.5, color: "#33352f" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#2F5DAA" }}>{String(i + 1).padStart(2, "0")}</span>
              {it}
            </li>
          ))}
        </ul>
      );

    case "metric":
      return (
        <div style={{ display: "inline-flex", flexDirection: "column", margin: "16px 24px 16px 0", verticalAlign: "top" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>{block.label.toUpperCase()}</div>
          <div style={{ marginTop: 6, fontFamily: "var(--font-serif)", fontSize: 40, lineHeight: 1, color: "#1B1D20" }}>{block.value}</div>
        </div>
      );

    case "stack":
      return (
        <div style={{ margin: "20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {block.items.map((it) => (
            <span key={it} style={{ fontSize: 12, letterSpacing: ".04em", color: "#33352f", border: "1px solid #cbc7bc", borderRadius: 20, padding: "7px 14px" }}>{it}</span>
          ))}
        </div>
      );

    case "links":
      return (
        <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {block.items.map((l) => (
            <a key={l.label} href={l.url} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, color: "#1B1D20", borderBottom: "1px solid #cbc7bc", paddingBottom: 4, width: "fit-content" }}>
              {l.label} <span style={{ fontSize: 14, color: "#2F5DAA" }}>&#8599;</span>
            </a>
          ))}
        </div>
      );

    default:
      return null;
  }
}
