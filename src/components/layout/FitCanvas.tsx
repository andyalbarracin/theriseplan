"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Faithful port of responsive-fit.js: a fixed `width`px canvas scaled DOWN with
 * CSS `zoom = min(1, vw/width)` so the whole design fits any viewport width (no
 * horizontal scroll), never scaled above 1. `zoom` (not transform) so layout
 * reflows and fixed overlays stay pinned to the real viewport.
 */
export function FitCanvas({
  width = 1440,
  children,
  style,
}: {
  width?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const avail = document.documentElement.clientWidth || window.innerWidth;
      const z = Math.min(1, avail / width);
      el.style.setProperty("zoom", String(z));
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });
    window.addEventListener("orientationchange", fit);
    // DC-style re-fit window while async content settles / fonts load.
    let tries = 0;
    const iv = window.setInterval(() => {
      fit();
      if (++tries > 10) window.clearInterval(iv);
    }, 150);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
      window.clearInterval(iv);
    };
  }, [width]);

  return (
    <div
      ref={ref}
      data-fit-width={width}
      style={{
        width,
        margin: "0 auto",
        position: "relative",
        background: "var(--color-paper)",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink)",
        WebkitFontSmoothing: "antialiased",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
