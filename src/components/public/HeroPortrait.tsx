import type { CSSProperties } from "react";

type Blend = NonNullable<CSSProperties["mixBlendMode"]>;
type MaskKey = "none" | "left" | "right" | "bottom" | "radial";

const MASKS: Record<MaskKey, string> = {
  none: "none",
  left: "linear-gradient(90deg,transparent 0%,#000 52%)",
  right: "linear-gradient(270deg,transparent 0%,#000 52%)",
  bottom: "linear-gradient(0deg,#000 30%,rgba(0,0,0,0.4) 62%,transparent 100%)",
  radial: "radial-gradient(72% 82% at 55% 42%,#000 40%,transparent 80%)",
};

/**
 * Reusable, admin-configurable artistic portrait treatment (port of
 * HeroPortrait.dc.html). Wired from HomeSettings.heroPortraitImage +
 * heroPortraitTreatment; used on /sobre-mi and available for the home hero.
 */
export function HeroPortrait({
  image = "/images/portrait-andy.png",
  alt = "Retrato artístico",
  blend = "luminosity",
  opacity = 0.9,
  mask = "bottom",
  position = "center top",
  grayscale = 0.5,
  style,
}: {
  image?: string;
  alt?: string;
  blend?: Blend;
  opacity?: number;
  mask?: MaskKey;
  position?: string;
  grayscale?: number;
  style?: CSSProperties;
}) {
  const maskImage = MASKS[mask] ?? "none";
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          mixBlendMode: blend,
          opacity,
          filter: `grayscale(${grayscale}) contrast(1.06) brightness(1.02)`,
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskSize: "cover",
          maskSize: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(180deg,rgba(20,18,14,0) 40%,rgba(12,11,8,0.35) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
