"use client";
import { listMedia } from "@/lib/cms/client";
import { useAsyncData } from "@/hooks/useAsyncData";

export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  // Se carga la biblioteca al montar (aunque este cerrado); barato y simple.
  const { data } = useAsyncData(() => listMedia());
  if (!open) return null;
  const media = data ?? [];
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(13,13,14,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: 820, maxWidth: "100%", maxHeight: "82vh", overflow: "auto", background: "#F4F2EF", borderRadius: 8, padding: "26px 28px" }} className="thin-scroll">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "#1B1D20" }}>Biblioteca de Media</div>
          <button onClick={onClose} aria-label="Cerrar" style={{ width: 40, height: 40, border: "none", background: "none", fontSize: 26, color: "#1B1D20", cursor: "pointer", lineHeight: 1 }}>×</button>
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
        </div>
      </div>
    </div>
  );
}
