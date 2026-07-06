import Link from "next/link";

export interface CatItem {
  n: string;
  title: string;
  cap: string;
  img: string;
  url: string;
}

/* Per-card bespoke treatment (bg tint, overlay, corner label) — matches the
   five hand-styled desktop cards in Homepage.dc.html. */
const META = [
  { bg: "#241f18", overlay: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(8,7,4,.5))", corner: "CUADERNO · 35MM" },
  { bg: "#2b2f2c", overlay: "radial-gradient(80% 60% at 62% 92%,rgba(6,7,5,.8),transparent 60%),linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(8,8,5,.5))", corner: "GATE · A16" },
  { bg: "#20252b", overlay: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(8,9,12,.55))", corner: "ANDES · 4200M" },
  { bg: "#141922", overlay: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(4,5,9,.55))", corner: "STUDIO · 02:14" },
  { bg: "#191a26", overlay: "linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(6,6,10,.5))", corner: "CIUDAD · 18:40" },
];

export function CategoryCards({ cats }: { cats: CatItem[] }) {
  return (
    <section
      data-screen-label="Archivo · categorías"
      style={{ position: "relative", zIndex: 2, padding: "20px 56px 70px" }}
    >
      <div style={{ position: "absolute", left: 30, top: -40, bottom: -40, width: 0, borderLeft: "1.5px dashed rgba(244,242,239,.3)" }} />
      <div style={{ position: "absolute", left: 22, top: 118, color: "rgba(157,184,236,.85)", fontSize: 24, fontWeight: 300, lineHeight: 1 }}>+</div>
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        {cats.map((c, i) => {
          const m = META[i] ?? META[0];
          return (
            <Link key={c.n} href={c.url} className="hcard" style={{ flex: 1, maxWidth: 212, display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", color: "rgba(244,242,239,.62)" }}>{c.n}</span>
              <h3
                style={{
                  margin: "9px 0 15px",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 500,
                  fontSize: "calc(25px*var(--h-scale,1))",
                  lineHeight: 1,
                  color: "#F7F5EF",
                }}
              >
                {c.title}
              </h3>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "212/302",
                  overflow: "hidden",
                  background: m.bg,
                  boxShadow: "inset 0 0 70px rgba(8,7,4,.55)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
                <div style={{ position: "absolute", inset: 0, background: m.overlay }} />
                <span style={{ position: "absolute", left: 12, bottom: 10, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".26em", color: "rgba(244,242,239,.32)" }}>
                  {m.corner}
                </span>
              </div>
              <p style={{ margin: "18px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "rgba(244,242,239,.82)", whiteSpace: "pre-line" }}>{c.cap}</p>
              <span style={{ marginTop: 16, fontSize: 19, color: "#F7F5EF" }}>&#8594;</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
