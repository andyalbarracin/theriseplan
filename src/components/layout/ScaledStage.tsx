"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Escenario del home (desktop). Un lienzo fijo de `width`px se mide y se escala
 * con `transform: scale(vw/width)` para SIEMPRE llenar el ancho disponible:
 *   - en pantallas más angostas que `width` se achica para entrar,
 *   - en pantallas MÁS ANCHAS crece para ocupar el 100% (sin bandas blancas).
 * El diseño se mantiene idéntico (misma composición), solo cambia de tamaño.
 * Debajo de `breakpoint` se usa el layout mobile propio (que sí reflowea).
 */
export function ScaledStage({
  children,
  mobile,
  width = 1440,
  breakpoint = 860,
  initialHeight = 2760,
}: {
  children: ReactNode;
  mobile: ReactNode;
  width?: number;
  breakpoint?: number;
  initialHeight?: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState<number>(width);
  const [natH, setNatH] = useState<number>(initialHeight);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (el) {
        const h = el.scrollHeight;
        if (h) setNatH((prev) => (Math.abs(h - prev) > 6 ? h : prev));
      }
    };
    const onResize = () => {
      setVw(document.documentElement.clientWidth || window.innerWidth);
      measure();
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    const t = window.setTimeout(measure, 400);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(measure).catch(() => {});
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && stageRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(stageRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      ro?.disconnect();
    };
  }, []);

  const isMobile = vw <= breakpoint;

  if (isMobile) {
    return <div style={{ width: "100%", position: "relative" }}>{mobile}</div>;
  }

  const availW = Math.max(320, vw);
  // Sin tope en 1: el lienzo crece para llenar pantallas anchas (no más bandas).
  const scale = availW / width;
  const stageLeft = Math.max(0, Math.round((availW - width * scale) / 2));
  const stageHeight = Math.round(natH * scale);

  return (
    <div style={{ position: "relative", width: "100%", height: stageHeight, overflow: "hidden" }}>
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          top: 0,
          left: stageLeft,
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: "var(--color-paper)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
