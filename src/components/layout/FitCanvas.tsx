import type { CSSProperties, ReactNode } from "react";

/**
 * Contenedor de las páginas interiores.
 *
 * ANTES: escalaba un lienzo fijo de 1440px con `zoom` para que "entrara" en la
 * pantalla — en celulares eso achicaba el texto hasta hacerlo ilegible.
 *
 * AHORA: es FLUIDO y responsivo. El fondo (papel) ocupa el 100% del ancho
 * (sin bandas en blanco a los lados) y el contenido se centra con un ancho
 * máximo legible. Las vistas internas reflowean solo (usan `clamp()` y grids
 * responsivos), así el texto se mantiene grande y legible en cualquier pantalla.
 *
 * `width` = ancho máximo del contenido (por defecto 1440).
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
  return (
    <div
      style={{
        width: "100%",
        background: "var(--color-paper)",
        overflowX: "hidden",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        data-fit-width={width}
        style={{
          width: "100%",
          maxWidth: width,
          margin: "0 auto",
          position: "relative",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
