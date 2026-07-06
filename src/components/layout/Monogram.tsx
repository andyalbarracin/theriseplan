import type { CSSProperties } from "react";

/** The overlapping "AA" wordmark (serif, second A tucked under the first). */
export function Monogram({
  color = "#1B1D20",
  size = 30,
  style,
}: {
  color?: string;
  size?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: "var(--font-serif)",
        fontSize: typeof size === "number" ? `${size}px` : size,
        lineHeight: 1,
        letterSpacing: "-.01em",
        color,
        ...style,
      }}
    >
      <span>A</span>
      <span style={{ marginLeft: "-.34em" }}>A</span>
    </span>
  );
}
