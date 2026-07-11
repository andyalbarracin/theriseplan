/* =============================================================================
   Archivo:     AboutAccordion.tsx
   Ruta:        web/src/components/public/sobre-mi/AboutAccordion.tsx
   Modificado:  2026-07-11
   Descripcion: Acordeón de "valores" de la página Sobre mí. Una sola columna;
                cada ítem tiene un título y un detalle que se despliega al tocar.
                El contenido se configura desde el dashboard (Sobre mí).
   ============================================================================= */
"use client";
import { useState } from "react";
import type { AboutValue } from "@/lib/types";

export function AboutAccordion({ values }: { values: AboutValue[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!values.length) return null;
  return (
    <div style={{ borderTop: "1px solid #d9d5cc", marginTop: 40 }}>
      {values.map((v, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid #e3e0d7" }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span style={{ display: "flex", alignItems: "baseline", gap: 16, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f", flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(18px,3vw,22px)", color: "#1B1D20" }}>{v.title}</span>
              </span>
              <span style={{ fontSize: 22, color: "#2F5DAA", flex: "none", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s ease" }}>+</span>
            </button>
            {isOpen && v.body && (
              <p style={{ margin: "0 0 22px 42px", fontSize: 15.5, lineHeight: 1.65, color: "#4a4c50", maxWidth: 560 }}>{v.body}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
