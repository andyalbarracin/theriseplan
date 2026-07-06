import type { CSSProperties } from "react";

/** Small film-gallery carousel in the archive band (port from Homepage.dc.html). */
export function GalleryCarousel({
  galBg,
  galNum,
  galTotal,
  onPrev,
  onNext,
}: {
  galBg: string;
  galNum: string;
  galTotal: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{ position: "absolute", left: 1024, top: 462, width: 216, height: 322 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#12140f", boxShadow: "0 22px 44px -22px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", inset: 0, background: galBg, transition: "background .5s ease" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 70px rgba(6,8,6,.6)", background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(6,8,6,.5))" }} />
        <div style={{ position: "absolute", left: 22, top: "44%", fontFamily: "var(--font-serif)", fontSize: 26, lineHeight: 1.1, color: "#f4f2ef" }}>
          {galNum}
          <br />
          <span style={{ opacity: 0.5 }}>/</span>
          <br />
          {galTotal}
        </div>
      </div>
      <div style={{ position: "absolute", left: -22, bottom: -20, display: "flex", gap: 10 }}>
        <button onClick={onPrev} aria-label="Anterior" style={galBtn(false)}>
          &#8592;
        </button>
        <button onClick={onNext} aria-label="Siguiente" style={galBtn(true)}>
          &#8594;
        </button>
      </div>
    </div>
  );
}

function galBtn(filled: boolean): CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: filled ? "none" : "1px solid #b9b6ad",
    background: filled ? "#1B1D20" : "#F4F2EF",
    color: filled ? "#F4F2EF" : "#1B1D20",
    fontSize: 17,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
