/* =============================================================================
   Archivo:     MediaPicker.tsx
   Ruta:        web/src/components/admin/MediaPicker.tsx
   Modificado:  2026-07-11
   Descripcion: Modal para elegir una imagen de la Biblioteca de Media, o SUBIR
                una nueva (que queda guardada en el banco de media y se elige al
                instante). Se usa desde el editor de posts/proyectos y desde los
                campos de imagen del dashboard (ImageField / ImageListField).
   ============================================================================= */
"use client";
import { useRef, useState } from "react";
import { listMedia, uploadMedia } from "@/lib/cms/client";
import { useAsyncData } from "@/hooks/useAsyncData";

export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const { data, refresh } = useAsyncData(() => listMedia());
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!open) return null;
  const media = data ?? [];

  // Sube el archivo al banco de media y lo elige de una.
  const onFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploading(true);
    try {
      const asset = await uploadMedia(files[0]);
      onPick(asset.url);
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      refresh();
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(13,13,14,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 820, maxWidth: "100%", maxHeight: "82vh", overflow: "auto", background: "#F4F2EF", borderRadius: 8, padding: "26px 28px" }} className="thin-scroll">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "#1B1D20" }}>Biblioteca de Media</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ height: 40, padding: "0 16px", borderRadius: 3, border: "none", background: "#0D0D0E", color: "#F4F2EF", fontFamily: "var(--font-sans)", fontSize: 13.5, cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.7 : 1 }}>
              {uploading ? "Subiendo…" : "⬆ Subir imagen"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFiles(e.target.files)} />
            <button onClick={onClose} aria-label="Cerrar" style={{ width: 40, height: 40, border: "none", background: "none", fontSize: 26, color: "#1B1D20", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {media.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onPick(m.url);
                onClose();
              }}
              style={{ padding: 0, border: "1px solid #e5e1d7", borderRadius: 6, overflow: "hidden", background: "#fff", cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#15130e" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".04em", color: "#6b6c66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.filename}</div>
            </button>
          ))}
          {media.length === 0 && <div style={{ gridColumn: "1 / -1", padding: "30px 0", textAlign: "center", fontSize: 14, color: "#8a887f" }}>La biblioteca está vacía. Subí una imagen con el botón de arriba.</div>}
        </div>
      </div>
    </div>
  );
}
