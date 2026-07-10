import type { CSSProperties } from "react";
import Link from "next/link";
import type { BoardingPassFields } from "@/lib/types";

/** Desktop boarding-pass ticket (BUE → destino), interactive via prev/next.
    Ported 1:1 from Homepage.dc.html.
    `href` (opcional): si el destino viene de un post, el código de vuelo y la
    franja PRIORITY se vuelven un enlace al post — sin cambiar nada visual. */
export function BoardingPass({
  pass,
  slideCounter,
  onPrev,
  onNext,
  href,
}: {
  pass: BoardingPassFields;
  slideCounter: string;
  onPrev: () => void;
  onNext: () => void;
  href?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 322,
        top: 592,
        width: 648,
        transform: "rotate(-1.1deg)",
        display: "flex",
        boxShadow: "0 26px 50px -22px rgba(20,18,14,.5)",
        zIndex: 5,
      }}
    >
      <div style={{ flex: 1, background: "linear-gradient(160deg,#faf8f3,#eeebe2)", position: "relative", padding: "24px 30px 22px" }}>
        <div
          style={{
            position: "absolute",
            left: -6,
            top: 0,
            bottom: 0,
            width: 12,
            background: "radial-gradient(circle at left,transparent 0 5px,#faf8f3 5px)",
            backgroundSize: "12px 16px",
            backgroundRepeat: "repeat-y",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {href ? (
              <Link href={href} title="Ver nota" style={{ fontSize: 26, fontWeight: 600, letterSpacing: ".02em", color: "#1B1D20", textDecoration: "none", cursor: "pointer" }}>{pass.code}</Link>
            ) : (
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: ".02em", color: "#1B1D20" }}>{pass.code}</div>
            )}
            <div style={{ fontSize: 10, letterSpacing: ".22em", color: "#8a887f", marginTop: 3 }}>BOARDING PASS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 600, color: "#1B1D20" }}>
            <span>{pass.from}</span>
            <span style={{ fontSize: 16, color: "#6E7C8B" }}>&#8594;</span>
            <button onClick={onPrev} aria-label="Destino anterior" style={circBtn(false)}>
              &#8249;
            </button>
            <span style={{ minWidth: 74, textAlign: "center" }}>{pass.to}</span>
            <button onClick={onNext} aria-label="Destino siguiente" style={circBtn(true)}>
              &#8250;
            </button>
            <span style={{ fontSize: 20 }}>&#9992;</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 3, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 9, letterSpacing: ".14em", color: "#a09e95", textAlign: "left" }}>{pass.fromCity}</span>
          <span style={{ fontSize: 9, letterSpacing: ".14em", color: "#8a887f" }}>&#183;</span>
          <span style={{ fontSize: 9, letterSpacing: ".14em", color: "#a09e95" }}>{pass.toCity}</span>
        </div>
        <div style={{ height: 1, background: "repeating-linear-gradient(90deg,#cfccc2 0 6px,transparent 6px 12px)", margin: "15px 0 13px" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div
            style={{
              height: 44,
              flex: 1,
              backgroundImage:
                "repeating-linear-gradient(90deg,#1B1D20 0 1px,transparent 1px 2px,#1B1D20 2px 4px,transparent 4px 7px,#1B1D20 7px 9px,transparent 9px 12px)",
              maxWidth: 210,
            }}
          />
          <div style={{ display: "flex", gap: 24, textAlign: "left" }}>
            {(
              [
                ["FLIGHT", pass.flight],
                ["DATE", pass.date],
                ["GATE", pass.gate],
                ["SEAT", pass.seat],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 8, letterSpacing: ".16em", color: "#a09e95" }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: 150, background: "linear-gradient(160deg,#f7f5f0,#eceadf)", padding: "24px 22px", borderLeft: "1px dashed #cbc8be" }}>
        <div style={{ fontSize: 8, letterSpacing: ".16em", color: "#a09e95" }}>BOARDING</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 3 }}>{pass.boarding}</div>
        <div style={{ fontSize: 8, letterSpacing: ".16em", color: "#a09e95", marginTop: 14 }}>ZONE</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>{pass.zone}</div>
        <div style={{ fontSize: 8, letterSpacing: ".16em", color: "#a09e95", marginTop: 14 }}>DESTINO</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3, fontFamily: "var(--font-mono)" }}>{slideCounter}</div>
      </div>
      {href ? (
        <Link href={href} title="Ver nota" style={{ width: 56, background: "#0D0D0E", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}>
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 12, letterSpacing: ".34em", color: "#f4f2ef" }}>PRIORITY</span>
        </Link>
      ) : (
        <div style={{ width: 56, background: "#0D0D0E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 12, letterSpacing: ".34em", color: "#f4f2ef" }}>PRIORITY</span>
        </div>
      )}
    </div>
  );
}

function circBtn(filled: boolean): CSSProperties {
  return {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: filled ? "none" : "1px solid #cfcabd",
    background: filled ? "#1B1D20" : "#fff",
    color: filled ? "#F4F2EF" : "#1B1D20",
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };
}
