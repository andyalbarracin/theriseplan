import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { getAhoraContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Ahora",
  description: "Una foto de mi presente. Dónde estoy, qué construyo y qué ocupa mi cabeza ahora mismo.",
};

export default function AhoraPage() {
  const a = getAhoraContent();

  return (
    <InteriorShell>
      <main data-screen-label="Ahora" style={{ position: "relative", padding: "64px 56px 40px" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>03 / AHORA</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 88, lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Ahora</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: 32, color: "#2F5DAA" }}>{a.accent}</p>
          <p style={{ margin: "26px 0 0", fontSize: 15.5, lineHeight: 1.62, color: "#4a4c50", maxWidth: 460 }}>{a.intro}</p>
          <div style={{ marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", color: "#a5a29a" }}>{a.updated}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, marginTop: 56, alignItems: "start" }}>
          {/* now-list */}
          <div>
            {a.rows.map((row, idx) => (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 1fr",
                  gap: 32,
                  padding: "30px 0",
                  borderTop: "1px solid #d9d5cc",
                  borderBottom: idx === a.rows.length - 1 ? "1px solid #d9d5cc" : undefined,
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", color: "#9a988f" }}>{row.label}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 23, lineHeight: 1.35, color: "#1B1D20" }}>
                  {row.emphasis && row.value.startsWith(row.emphasis) ? (
                    <>
                      <span style={{ fontWeight: 600 }}>{row.emphasis}</span>
                      {row.value.slice(row.emphasis.length)}
                    </>
                  ) : (
                    row.value
                  )}
                </div>
              </div>
            ))}
            <p style={{ marginTop: 34, fontFamily: "var(--font-hand)", fontSize: 26, color: "#2F5DAA" }}>{a.closing}</p>
          </div>

          {/* image + status */}
          <div>
            <div style={{ position: "relative", width: "100%", height: 480, overflow: "hidden", background: "linear-gradient(184deg,#c9a67e,#9a8b93 20%,#5c5c72 42%,#31334a 66%,#171826)", boxShadow: "0 26px 50px -26px rgba(20,18,14,.5)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.image} alt="Ciudad al anochecer" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(6,6,10,.55))" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "#F4F2EF" }}>{a.imageTime}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: ".1em", color: "#cdcabf" }}>{a.imagePlace}</span>
              </div>
              <span style={{ position: "absolute", right: 16, top: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.4)" }}>{a.imageCorner}</span>
            </div>
            <div style={{ marginTop: 22, background: "#EAE6DD", padding: "24px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "#a29f95" }}>{a.statusLabel}</div>
                <div style={{ marginTop: 6, fontSize: 20, fontWeight: 600, color: "#1B1D20" }}>{a.statusRoute}</div>
              </div>
              <span style={{ fontSize: 10, letterSpacing: ".12em", color: "#2F5DAA", border: "1px solid #2F5DAA", borderRadius: 20, padding: "6px 13px" }}>{a.statusChip}</span>
            </div>
          </div>
        </div>
      </main>
    </InteriorShell>
  );
}
