/** Circular "AA · IDEAS EN TRÁNSITO" wax-stamp seal (port from Homepage.dc.html). */
export function Seal({
  color = "var(--accent)",
  size = 132,
  id = "seal-cir",
}: {
  color?: string;
  size?: number;
  id?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#bcd0f2",
        opacity: 0.95,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 9, borderRadius: "50%", border: `1px solid ${color}` }} />
      <span style={{ fontFamily: "var(--font-serif)", fontSize: 30 }}>AA</span>
      <div style={{ position: "absolute", inset: 0, fontFamily: "var(--font-mono)" }}>
        <svg viewBox="0 0 132 132" style={{ width: "100%", height: "100%" }}>
          <defs>
            <path id={id} d="M66,66 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
          </defs>
          <text style={{ fontSize: 9, letterSpacing: ".18em", fill: color }}>
            <textPath href={`#${id}`} startOffset="0%">
              · IDEAS EN TRÁNSITO · ARCHIVO PERSONAL{" "}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
