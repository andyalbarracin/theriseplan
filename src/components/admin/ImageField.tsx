/* =============================================================================
   Archivo:     ImageField.tsx
   Ruta:        web/src/components/admin/ImageField.tsx
   Modificado:  2026-07-11
   Descripcion: Campos de imagen VISUALES para el dashboard:
     • ImageField     — una imagen: muestra la preview y un botón "Cambiar imagen"
                        que abre la Biblioteca (elegir o subir una nueva).
     • ImageListField — una lista/galería de imágenes: grilla con quitar (×) y una
                        casilla "＋" para agregar (elegir o subir).
   Ambos usan MediaPicker, así que "cambiar/subir" queda a un click.
   ============================================================================= */
"use client";
import { useState, type CSSProperties } from "react";
import { MediaPicker } from "./MediaPicker";

const label: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f", display: "block", marginBottom: 8 };
const changeBtn: CSSProperties = { marginTop: 10, height: 38, padding: "0 16px", borderRadius: 3, border: "1px solid #cbc7bc", background: "#fff", color: "#1B1D20", fontFamily: "var(--font-sans)", fontSize: 13.5, cursor: "pointer" };

/** Una sola imagen con preview + botón "Cambiar imagen". */
export function ImageField({
  label: l,
  value,
  onChange,
  aspect = "16/11",
  hint,
  clearable,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
  hint?: string;
  clearable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {l && <label style={label}>{l}</label>}
      <div style={{ position: "relative", width: "100%", aspectRatio: aspect, borderRadius: 4, overflow: "hidden", background: "#15130e", border: "1px solid #e5e1d7" }}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6c66", fontSize: 13 }}>Sin imagen</div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setOpen(true)} style={changeBtn}>{value ? "Cambiar imagen" : "Elegir imagen"}</button>
        {clearable && value && (
          <button onClick={() => onChange("")} style={{ ...changeBtn, border: "1px solid #d8b4b4", color: "#a23b3b" }}>Quitar</button>
        )}
      </div>
      {hint && <div style={{ marginTop: 6, fontSize: 12, color: "#8a887f" }}>{hint}</div>}
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(url) => onChange(url)} />
    </div>
  );
}

/** Galería editable: grilla de imágenes con quitar + casilla para agregar. */
export function ImageListField({
  label: l,
  values,
  onChange,
  hint,
}: {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {l && <label style={label}>{l}</label>}
      {hint && <div style={{ margin: "0 0 12px", fontSize: 12, color: "#8a887f" }}>{hint}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
        {values.map((url, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 6, overflow: "hidden", background: "#15130e", border: "1px solid #e5e1d7" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => onChange(values.filter((_, idx) => idx !== i))} aria-label="Quitar" style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(13,13,14,.7)", color: "#fff", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button onClick={() => setOpen(true)} style={{ aspectRatio: "4/3", border: "1px dashed #cbc7bc", borderRadius: 6, background: "transparent", cursor: "pointer", color: "#8a887f", fontSize: 26 }}>＋</button>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(url) => onChange([...values, url])} />
    </div>
  );
}
