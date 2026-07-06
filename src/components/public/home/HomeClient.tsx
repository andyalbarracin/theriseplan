"use client";
import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { HomeSettings } from "@/lib/types";
import { ScaledStage } from "@/components/layout/ScaledStage";
import { PaperGrain } from "@/components/layout/PaperGrain";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Seal } from "@/components/public/Seal";
import { BoardingPass } from "./BoardingPass";
import { RouteSlider } from "./RouteSlider";
import { CategoryCards, type CatItem } from "./CategoryCards";
import { ArchiveBand, type ZaireBlock } from "./ArchiveBand";
import type { FilmItem } from "./FilmStrip";

const pad = (x: number) => String(x).padStart(2, "0");

export function HomeClient({
  home,
  films,
  cats,
  zaire,
  gallery,
}: {
  home: HomeSettings;
  films: FilmItem[];
  cats: CatItem[];
  zaire: ZaireBlock;
  gallery: string[];
}) {
  const [slide, setSlide] = useState(0);
  const [gal, setGal] = useState(2);

  const dests = home.heroDestinations;
  const origin = home.heroOrigin;
  const n = dests.length || 1;
  const i = ((slide % n) + n) % n;
  const cur = dests[i];
  const fade = home.heroFade;

  const pass = {
    code: cur.flight,
    from: origin.code,
    to: cur.code,
    fromCity: (origin.city || "").toUpperCase(),
    toCity: (cur.city || "").toUpperCase(),
    flight: cur.flight,
    date: cur.date,
    gate: cur.gate,
    seat: cur.seat,
    boarding: cur.boarding,
    zone: cur.zone,
  };

  const slideLayers = dests.map((dd, idx): { src: string; style: CSSProperties } => ({
    src: dd.image,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 40%",
      opacity: idx === i ? 1 : 0,
      transform: `translateY(${(idx - i) * 7}px) scale(${idx === i ? 1 : 1.05})`,
      transition: "opacity .85s ease, transform 1.3s ease",
      zIndex: 0,
    },
  }));

  const dots = dests.map((_, idx) => ({ active: idx === i, onClick: () => setSlide(idx) }));
  const slideCounter = `${pad(i + 1)} / ${pad(n)}`;

  const gtot = gallery.length || 1;
  const gi = ((gal % gtot) + gtot) % gtot;
  const galBg = `url(${gallery[gi]}) center/cover`;

  const next = () => setSlide((s) => s + 1);
  const prev = () => setSlide((s) => s - 1);

  const heroLines = home.heroHeadline.split("\n");
  const accentParts = home.heroAccent.split(" ");
  const accentHead = accentParts.slice(0, 2).join(" ");
  const accentTail = accentParts.slice(2).join(" ");
  const ctaUrl = home.ctas[0]?.url || "/cuaderno";
  const ctaLabel = home.ctas[0]?.label || "Explorar archivo";

  /* ---- shared hero background (slider + fades) ---- */
  const heroBg = (mobile: boolean) => (
    <>
      {slideLayers.map((layer, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={idx} src={layer.src} alt="" style={layer.style} />
      ))}
      {mobile ? (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(9,11,15,.6) 0%,rgba(9,11,15,.18) 34%,rgba(9,11,15,.62) 100%)" }} />
      ) : (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: fade.topHeight, background: `linear-gradient(180deg,${fade.topColor} 0%,transparent 100%)` }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fade.sideWidth}%`, background: `linear-gradient(90deg,${fade.sideColor} 0%,transparent 100%)` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,11,14,.12) 0%,rgba(10,11,14,.02) 32%,rgba(11,12,15,.28) 80%,rgba(11,12,15,.38) 100%)" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: fade.bottomHeight,
              background: `linear-gradient(180deg,transparent 0%,color-mix(in srgb,${fade.bottomColor} 3%,transparent) 24%,color-mix(in srgb,${fade.bottomColor} 12%,transparent) 46%,color-mix(in srgb,${fade.bottomColor} 34%,transparent) 66%,color-mix(in srgb,${fade.bottomColor} 72%,transparent) 84%,${fade.bottomColor} 100%)`,
            }}
          />
        </>
      )}
    </>
  );

  /* ================= DESKTOP ================= */
  const desktop = (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1960, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>{heroBg(false)}</div>

      <div style={{ position: "relative", zIndex: 30 }}>
        <SiteHeader tone="light" />
      </div>

      <section aria-label="Hero" style={{ position: "relative", height: 1140, zIndex: 2 }}>
        <div style={{ position: "absolute", left: 56, top: 150, width: 660, zIndex: 5 }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "calc(94px*var(--h-scale,1))", lineHeight: 0.96, letterSpacing: "-.022em", color: "#F7F5EF", whiteSpace: "nowrap", textShadow: "0 2px 34px rgba(8,7,4,.55)" }}>
            {heroLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < heroLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p style={{ margin: "16px 0 0", fontFamily: "var(--font-hand)", fontSize: 38, lineHeight: 1, color: "var(--hero-accent,#9db8ec)", textShadow: "0 2px 20px rgba(8,7,4,.45)" }}>
            {accentHead}{" "}
            <span style={{ borderBottom: "2px solid var(--hero-accent,#9db8ec)", paddingBottom: 4 }}>{accentTail}</span>
          </p>
          <p style={{ margin: "34px 0 0", fontSize: 15, lineHeight: 1.6, color: "rgba(244,242,239,.88)", maxWidth: 310, textShadow: "0 1px 12px rgba(8,7,4,.55)" }}>{home.heroSubtitle}</p>
          <Link href={ctaUrl} style={{ display: "inline-flex", alignItems: "center", gap: 16, marginTop: 30, fontSize: 15, color: "#F4F2EF", borderBottom: "1px solid rgba(244,242,239,.7)", paddingBottom: 5 }}>
            {ctaLabel} <span style={{ fontSize: 17 }}>&#8594;</span>
          </Link>
        </div>

        <RouteSlider
          originCode={origin.code}
          originCity={(origin.city || "").toUpperCase()}
          destCode={cur.code}
          destCity={(cur.city || "").toUpperCase()}
          dots={dots}
          onPrev={prev}
          onNext={next}
        />

        <p style={{ position: "absolute", left: 66, top: 700, margin: 0, fontFamily: "var(--font-hand)", fontSize: 23, lineHeight: 1.5, color: "#a9c2f0", textShadow: "0 2px 16px rgba(8,7,4,.5)", zIndex: 5 }}>
          No todo viaje
          <br />
          merece una foto.
          <br />
          Algunos solo
          <br />
          ordenan la cabeza.
          <span style={{ display: "block", width: 70, height: 1, background: "#a9c2f0", marginTop: 8, transform: "rotate(-3deg)" }} />
        </p>

        <div style={{ position: "absolute", left: 352, top: 648, width: 170, height: 210, transform: "rotate(-4deg)", background: "linear-gradient(150deg,#efece4,#e2ded3)", boxShadow: "0 8px 20px -8px rgba(0,0,0,.18)", opacity: 0.85, zIndex: 3 }}>
          <div style={{ position: "absolute", inset: 14, background: "repeating-linear-gradient(0deg,rgba(120,116,108,.16) 0 1px,transparent 1px 9px)" }} />
        </div>

        <BoardingPass pass={pass} slideCounter={slideCounter} onPrev={prev} onNext={next} />

        <div style={{ position: "absolute", left: 1150, top: 770, zIndex: 5 }}>
          <Seal />
        </div>

        <div style={{ position: "absolute", left: 1150, top: 1020, display: "flex", alignItems: "center", gap: 12, zIndex: 5 }}>
          <span style={{ fontSize: 22, color: "rgba(244,242,239,.72)", fontWeight: 300 }}>+</span>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", lineHeight: 1.6, color: "rgba(244,242,239,.82)", textShadow: "0 1px 10px rgba(8,7,4,.5)", maxWidth: 150 }}>{cur.coords}</div>
        </div>
      </section>

      <CategoryCards cats={cats} />

      <ArchiveBand
        films={films}
        galBg={galBg}
        galNum={pad(gi + 1)}
        galTotal={pad(gtot)}
        onGalPrev={() => setGal((g) => g - 1)}
        onGalNext={() => setGal((g) => g + 1)}
        zaire={zaire}
      />
    </>
  );

  /* ================= MOBILE ================= */
  const mobile = (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 40 }}>
        <SiteHeader tone="light" />
      </div>

      <section style={{ position: "relative", minHeight: 648, overflow: "hidden", background: "#0D0D0E", display: "flex" }}>
        {heroBg(true)}
        <div style={{ position: "relative", zIndex: 2, width: "100%", padding: "104px 22px 30px", display: "flex", flexDirection: "column", minHeight: 648 }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 46, lineHeight: 0.98, letterSpacing: "-.02em", color: "#F7F5EF", textShadow: "0 2px 24px rgba(8,7,4,.5)" }}>
            {heroLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < heroLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p style={{ margin: "12px 0 0", fontFamily: "var(--font-hand)", fontSize: 27, lineHeight: 1, color: "var(--hero-accent,#9db8ec)" }}>{home.heroAccent}</p>
          <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.6, color: "rgba(244,242,239,.9)", maxWidth: 320 }}>{home.heroSubtitle}</p>
          <Link href={ctaUrl} style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 20, fontSize: 14, color: "#F4F2EF", borderBottom: "1px solid rgba(244,242,239,.7)", paddingBottom: 5, width: "fit-content" }}>
            {ctaLabel} <span style={{ fontSize: 16 }}>&#8594;</span>
          </Link>

          <div style={{ flex: 1, minHeight: 24 }} />

          {/* mini boarding pass */}
          <div style={{ background: "linear-gradient(160deg,#faf8f3,#eeebe2)", borderRadius: 6, boxShadow: "0 20px 40px -20px rgba(12,11,8,.7)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1B1D20" }}>{pass.code}</div>
              <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#8a887f" }}>BOARDING PASS</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 700, color: "#1B1D20" }}>
                <span>{pass.from}</span>
                <span style={{ fontSize: 14, color: "#6E7C8B" }}>&#8594;</span>
                <span style={{ minWidth: 56, textAlign: "center" }}>{pass.to}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={prev} aria-label="Anterior" style={miniBtn(false)}>&#8249;</button>
                <button onClick={next} aria-label="Siguiente" style={miniBtn(true)}>&#8250;</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, letterSpacing: ".1em", color: "#8a887f" }}>
              <span>{pass.fromCity}</span>
              <span>{pass.toCity}</span>
            </div>
            <div style={{ height: 1, background: "repeating-linear-gradient(90deg,#cfccc2 0 6px,transparent 6px 12px)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
              {([["FLIGHT", pass.flight], ["DATE", pass.date], ["GATE", pass.gate], ["SEAT", pass.seat]] as const).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 8, letterSpacing: ".14em", color: "#a09e95" }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <div style={{ display: "flex", gap: 9 }}>
              {dots.map((d, idx) => (
                <button key={idx} onClick={d.onClick} aria-label="Destino" style={{ width: d.active ? 9 : 7, height: d.active ? 9 : 7, borderRadius: "50%", cursor: "pointer", padding: 0, background: d.active ? "var(--hero-accent,#9db8ec)" : "transparent", border: `1px solid rgba(157,184,236,${d.active ? "1" : "0.55"})` }} />
              ))}
            </div>
            <p style={{ margin: 0, fontFamily: "var(--font-hand)", fontSize: 17, color: "#a9c2f0" }}>No todo viaje merece una foto.</p>
          </div>
        </div>
      </section>

      {/* category cards (mobile 2-col) */}
      <section style={{ padding: "40px 20px 8px", background: "#F4F2EF" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", color: "#a5a29a" }}>01 — 05</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 26, color: "#1B1D20" }}>El archivo</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {cats.map((c) => (
            <Link key={c.n} href={c.url} style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#a5a29a" }}>{c.n}</span>
              <h3 style={{ margin: "6px 0 10px", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 19, lineHeight: 1.05, color: "#1B1D20" }}>{c.title}</h3>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", background: "#1d2016" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(8,7,4,.4))" }} />
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "#55565a", whiteSpace: "pre-line" }}>{c.cap}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* archive visual + zaire (mobile) */}
      <section style={{ padding: "34px 0 44px", background: "#F4F2EF" }}>
        <div style={{ padding: "0 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", color: "#a5a29a" }}>35MM</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 24, color: "#1B1D20" }}>Archivo visual</h2>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "6px 20px 14px", WebkitOverflowScrolling: "touch" }}>
          {films.map((f, idx) => (
            <Link key={idx} href={f.url} style={{ flex: "0 0 148px", position: "relative", height: 186, borderRadius: 4, overflow: "hidden", background: "#101010", textDecoration: "none", display: "block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt={f.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(6,7,6,.82))" }} />
              <div style={{ position: "absolute", left: 10, right: 10, bottom: 10 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "rgba(244,242,239,.7)" }}>{f.label}</div>
                <div style={{ marginTop: 3, fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.15, color: "#F4F2EF" }}>{f.title}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ padding: "0 20px", marginTop: 40 }}>
          <p style={{ margin: "0 0 20px", fontFamily: "var(--font-hand)", fontSize: 21, lineHeight: 1.5, color: "var(--accent,#2F5DAA)" }}>
            Ver el mundo, acercarse a los demás, encontrarse y sentir. Ese es el propósito de la vida. <span style={{ fontSize: 16 }}>— Walter Mitty.</span>
          </p>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: 4, background: "#12140f", marginBottom: 22 }}>
            <div style={{ position: "absolute", inset: 0, background: galBg, transition: "background .5s ease" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(6,8,6,.5))" }} />
            <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: "var(--font-serif)", fontSize: 22, color: "#f4f2ef" }}>
              {pad(gi + 1)} <span style={{ opacity: 0.5 }}>/ {pad(gtot)}</span>
            </div>
            <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 8 }}>
              <button onClick={() => setGal((g) => g - 1)} aria-label="Anterior" style={miniGal(false)}>&#8592;</button>
              <button onClick={() => setGal((g) => g + 1)} aria-label="Siguiente" style={miniGal(true)}>&#8594;</button>
            </div>
          </div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 44, letterSpacing: ".05em", color: "#1B1D20" }}>{zaire.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 0" }}>
            {zaire.tags.map((t) => (
              <span key={t} style={{ fontSize: 10, letterSpacing: ".14em", color: "#6b6c66", border: "1px solid #cbc7bc", borderRadius: 20, padding: "6px 13px" }}>{t}</span>
            ))}
          </div>
          <p style={{ margin: "18px 0 0", fontSize: 14.5, lineHeight: 1.62, color: "#4a4c50" }}>Documental en desarrollo. {zaire.description}</p>
          <Link href={zaire.href} style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 22, fontSize: 14.5, color: "#1B1D20", borderBottom: "1px solid #1B1D20", paddingBottom: 5 }}>
            Ver proyecto <span style={{ fontSize: 16 }}>&#8594;</span>
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#F4F2EF", overflowX: "hidden", fontFamily: "var(--font-sans)", color: "#1B1D20" }}>
      <PaperGrain fixed opacity={0.045} zIndex={70} />
      <ScaledStage mobile={mobile}>{desktop}</ScaledStage>
    </div>
  );
}

function miniBtn(filled: boolean): CSSProperties {
  return { width: 38, height: 38, borderRadius: "50%", border: filled ? "none" : "1px solid #cfcabd", background: filled ? "#1B1D20" : "#fff", color: filled ? "#F4F2EF" : "#1B1D20", fontSize: 16, cursor: "pointer" };
}
function miniGal(filled: boolean): CSSProperties {
  return { width: 38, height: 38, borderRadius: "50%", border: filled ? "none" : "1px solid rgba(244,242,239,.5)", background: filled ? "#F4F2EF" : "rgba(13,13,14,.4)", color: filled ? "#1B1D20" : "#F4F2EF", fontSize: 15, cursor: "pointer" };
}
