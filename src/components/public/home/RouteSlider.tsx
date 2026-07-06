import type { CSSProperties } from "react";

/** Vertical route slider on the right of the hero (port from Homepage.dc.html). */
export function RouteSlider({
  originCode,
  originCity,
  destCode,
  destCity,
  dots,
  onPrev,
  onNext,
}: {
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  dots: { active: boolean; onClick: () => void }[];
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 1300,
        top: 146,
        height: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".24em",
        color: "rgba(244,242,239,.72)",
        zIndex: 6,
      }}
    >
      <button onClick={onPrev} aria-label="Anterior destino" style={roundBtn(false)}>
        &#8593;
      </button>
      <span style={{ writingMode: "vertical-rl", color: "#F7F5EF", fontWeight: 700 }}>{originCode}</span>
      <span style={{ writingMode: "vertical-rl", fontSize: 9, opacity: 0.75 }}>{originCity}</span>
      <span style={{ flex: 1, width: 1, background: "linear-gradient(rgba(244,242,239,.55),rgba(244,242,239,.12))" }} />
      <span style={{ fontSize: 15, color: "#F7F5EF", letterSpacing: 0, textShadow: "0 1px 8px rgba(8,7,4,.5)" }}>&#9992;</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, padding: "4px 0" }}>
        {dots.map((d, i) => (
          <button
            key={i}
            onClick={d.onClick}
            aria-label="Ir al destino"
            style={{
              width: d.active ? 9 : 7,
              height: d.active ? 9 : 7,
              borderRadius: "50%",
              cursor: "pointer",
              padding: 0,
              background: d.active ? "var(--hero-accent,#9db8ec)" : "transparent",
              border: `1px solid rgba(157,184,236,${d.active ? "1" : "0.55"})`,
            }}
          />
        ))}
      </div>
      <span style={{ flex: 1, width: 1, background: "linear-gradient(rgba(244,242,239,.12),rgba(244,242,239,.55))" }} />
      <span style={{ writingMode: "vertical-rl", color: "#F7F5EF", fontWeight: 700 }}>{destCode}</span>
      <span style={{ writingMode: "vertical-rl", fontSize: 9, opacity: 0.75 }}>{destCity}</span>
      <button onClick={onNext} aria-label="Siguiente destino" style={roundBtn(true)}>
        &#8595;
      </button>
    </div>
  );
}

function roundBtn(filled: boolean): CSSProperties {
  return {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: filled ? "none" : "1px solid rgba(244,242,239,.45)",
    background: filled ? "#F4F2EF" : "rgba(13,13,14,.28)",
    color: filled ? "#1B1D20" : "#F7F5EF",
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };
}
