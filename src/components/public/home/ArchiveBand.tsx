import type { CSSProperties } from "react";
import Link from "next/link";
import { FilmStrip, type FilmItem } from "./FilmStrip";
import { GalleryCarousel } from "./GalleryCarousel";

export interface ZaireBlock {
  title: string;
  tags: string[];
  description: string;
  href: string;
}

export function ArchiveBand({
  films,
  galBg,
  galNum,
  galTotal,
  onGalPrev,
  onGalNext,
  zaire,
  quote,
  projCounter,
  showProjNav,
  onProjPrev,
  onProjNext,
}: {
  films: FilmItem[];
  galBg: string;
  galNum: string;
  galTotal: string;
  onGalPrev: () => void;
  onGalNext: () => void;
  zaire: ZaireBlock;
  quote: { text: string; cite: string };
  projCounter?: string;
  showProjNav?: boolean;
  onProjPrev?: () => void;
  onProjNext?: () => void;
}) {
  return (
    <section data-screen-label="Archivo visual · Zaire" style={{ position: "relative", height: 872, marginTop: 104 }}>
      {/* archive tag */}
      <div style={{ position: "absolute", left: 56, top: 70, width: 158, height: 298, transform: "rotate(-1.5deg)", background: "linear-gradient(160deg,#f3f0e8,#e6e2d7)", boxShadow: "0 14px 30px -14px rgba(0,0,0,.22)" }}>
        <div style={{ position: "absolute", left: 36, top: -12, width: 96, height: 26, transform: "rotate(-3deg)", background: "linear-gradient(180deg,rgba(220,206,182,.9),rgba(203,188,160,.8))", opacity: 0.85 }} />
        <div style={{ padding: "34px 20px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".12em", color: "#3b3a34" }}>
            ARCHIVO
            <br />
            <span style={{ fontSize: 15, fontWeight: 700 }}>35MM</span>
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--font-mono)" }}>
            {(
              [
                ["CABIN", "Y"],
                ["DATE", "28MAY"],
                ["ORIG", "ARG"],
                ["SEQ.", "0126"],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 8, letterSpacing: ".16em", color: "#a29f95" }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#28271f" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FilmStrip films={films} />

      {/* dotted world map */}
      <div
        style={{
          position: "absolute",
          left: 602,
          top: 176,
          width: 562,
          height: 248,
          opacity: 0.5,
          backgroundImage: "radial-gradient(circle,#8b97a0 1.1px,transparent 1.5px)",
          backgroundSize: "10px 10px",
          WebkitMaskImage: "radial-gradient(125% 100% at 42% 46%,#000 38%,transparent 80%)",
          maskImage: "radial-gradient(125% 100% at 42% 46%,#000 38%,transparent 80%)",
        }}
      />

      {/* route line + plane + circles */}
      <div style={{ position: "absolute", left: 470, top: 22, width: 712, height: 300, pointerEvents: "none" }}>
        <svg viewBox="0 0 712 300" style={{ width: "100%", height: "100%" }}>
          <path d="M 70,168 C 190,84 300,196 432,132 S 592,52 664,58" fill="none" stroke="#3a3a36" strokeWidth="1.4" strokeDasharray="2 6" strokeLinecap="round" />
          <path d="M 664,120 C 610,168 520,150 470,186 S 360,214 300,206" fill="none" stroke="#3a3a36" strokeWidth="1.4" strokeDasharray="2 6" strokeLinecap="round" />
          <ellipse cx="316" cy="206" rx="15" ry="8" transform="rotate(-14 316 206)" fill="none" stroke="var(--accent,#2F5DAA)" strokeWidth="1.4" />
          <ellipse cx="470" cy="186" rx="13" ry="7" transform="rotate(-10 470 186)" fill="none" stroke="var(--accent,#2F5DAA)" strokeWidth="1.4" />
          <ellipse cx="612" cy="150" rx="12" ry="7" transform="rotate(8 612 150)" fill="none" stroke="var(--accent,#2F5DAA)" strokeWidth="1.4" />
        </svg>
        <span style={{ position: "absolute", right: 36, top: 24, fontSize: 22, color: "#1B1D20", transform: "rotate(-8deg)" }}>&#9992;</span>
      </div>

      {/* Cita (editable desde Ajustes → Home) */}
      <div style={{ position: "absolute", left: 588, top: 22, width: 392, fontFamily: "var(--font-hand)", fontSize: 21, lineHeight: 1.5, color: "var(--accent,#2F5DAA)" }}>
        <p style={{ margin: 0 }}>{quote.text}</p>
        {quote.cite && (
          <>
            <div style={{ width: 64, height: 1, background: "var(--accent,#2F5DAA)", margin: "4px 0 0 84px" }} />
            <p style={{ margin: "10px 0 0", textAlign: "right", fontSize: 20 }}>— {quote.cite}.</p>
          </>
        )}
      </div>

      {/* polaroid */}
      <div style={{ position: "absolute", left: 56, top: 456, width: 366, height: 322, transform: "rotate(-3deg)", background: "#f6f3ec", padding: "14px 14px 0", boxShadow: "0 26px 46px -22px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: -14, top: 64, width: 92, height: 30, transform: "rotate(-64deg)", background: "linear-gradient(180deg,rgba(220,206,182,.92),rgba(200,185,157,.8))", opacity: 0.82 }} />
        <div style={{ position: "relative", width: "100%", height: 236, overflow: "hidden", background: "#1d2016" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/workspace.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(6,7,4,.6)" }} />
          <span style={{ position: "absolute", left: 12, bottom: 10, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".26em", color: "rgba(244,242,239,.34)" }}>STUDIO · BUE</span>
        </div>
        <p style={{ margin: 0, height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--accent,#2F5DAA)" }}>
          enfocado en lo que{" "}
          <span style={{ borderBottom: "2px solid var(--accent,#2F5DAA)", paddingBottom: 2, marginLeft: 6 }}>importa.</span>
        </p>
      </div>

      {/* PROYECTOS DESTACADOS — mini-slider (título/tags/descr del proyecto actual) */}
      <div style={{ position: "absolute", left: 470, top: 470, width: 352 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", color: "#9a988f" }}>
            PROYECTOS DESTACADOS{showProjNav && projCounter ? ` · ${projCounter}` : ""}
          </span>
          {showProjNav && (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onProjPrev} aria-label="Proyecto anterior" style={projBtn}>&#8249;</button>
              <button onClick={onProjNext} aria-label="Proyecto siguiente" style={projBtn}>&#8250;</button>
            </div>
          )}
        </div>
        <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 52, letterSpacing: ".06em", color: "#1B1D20" }}>{zaire.title}</h2>
        <div style={{ display: "flex", gap: 10, margin: "20px 0 0" }}>
          {zaire.tags.map((t) => (
            <span key={t} style={{ fontSize: 10, letterSpacing: ".14em", color: "#6b6c66", border: "1px solid #cbc7bc", borderRadius: 20, padding: "6px 13px" }}>
              {t}
            </span>
          ))}
        </div>
        <p style={{ margin: "22px 0 0", fontSize: 14.5, lineHeight: 1.62, color: "#4a4c50" }}>{zaire.description}</p>
        <Link href={zaire.href} style={{ display: "inline-flex", alignItems: "center", gap: 16, marginTop: 26, fontSize: 14.5, color: "#1B1D20", borderBottom: "1px solid #1B1D20", paddingBottom: 5 }}>
          Ver proyecto <span style={{ fontSize: 16 }}>&#8594;</span>
        </Link>
      </div>

      <GalleryCarousel galBg={galBg} galNum={galNum} galTotal={galTotal} onPrev={onGalPrev} onNext={onGalNext} />
    </section>
  );
}

const projBtn: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "1px solid #cfcabd",
  background: "#fff",
  color: "#1B1D20",
  fontSize: 15,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
