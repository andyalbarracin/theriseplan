"use client";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types";
import { getMediaAssets, upsertMedia, deleteMedia } from "@/lib/cms";
import { AdminTopbar, AdminButton } from "@/components/admin/ui";

const FILTERS = [
  { key: "all", label: "Todo" },
  { key: "landscape", label: "Horizontal" },
  { key: "portrait", label: "Vertical" },
];

export default function DashboardMedia() {
  const [media, setMedia] = useState<MediaAsset[] | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [sel, setSel] = useState<MediaAsset | null>(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = (keep?: string) => {
    const list = getMediaAssets();
    setMedia(list);
    const next = keep ? list.find((m) => m.id === keep) : list[0];
    if (next) {
      setSelId(next.id);
      setSel({ ...next });
    }
  };
  useEffect(() => reload(), []);

  const list = (media ?? [])
    .filter((m) => (filter === "all" ? true : m.type === filter))
    .filter((m) => {
      const s = q.trim().toLowerCase();
      return !s || (m.filename + " " + m.alt).toLowerCase().includes(s);
    });

  const select = (m: MediaAsset) => {
    setSelId(m.id);
    setSel({ ...m });
    setCopied(false);
  };

  const onFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const asset = upsertMedia({
        id: "",
        url: String(reader.result),
        filename: file.name,
        alt: "",
        caption: "",
        type: "landscape",
        size: Math.round(file.size / 1024),
        createdAt: new Date().toISOString(),
        usedIn: [],
      });
      reload(asset.id);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <AdminTopbar
        title="Media"
        eyebrow={`BIBLIOTECA · ${media?.length ?? 0} ARCHIVOS`}
        actions={
          <>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o alt…" style={{ height: 44, width: 260, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none", background: "#fff" }} />
            <AdminButton onClick={() => fileRef.current?.click()}>⬆ Subir archivo</AdminButton>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFiles(e.target.files)} />
          </>
        }
      />

      <div style={{ display: "flex", minHeight: "calc(100vh - 90px)" }}>
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px 56px" }} className="thin-scroll">
          {/* dropzone */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFiles(e.dataTransfer.files);
            }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, height: 150, borderRadius: 8, cursor: "pointer", border: dragging ? "2px dashed #2F5DAA" : "2px dashed #cbc7bc", background: dragging ? "rgba(47,93,170,.06)" : "transparent" }}
          >
            <input type="file" accept="image/*" hidden onChange={(e) => onFiles(e.target.files)} />
            <span style={{ fontSize: 24, color: "#8a887f" }}>⬆</span>
            <span style={{ fontSize: 14, color: "#55565a" }}>
              Arrastra imágenes aquí o <span style={{ color: "#2F5DAA" }}>selecciona archivos</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "#a5a29a" }}>PNG · JPG · WEBP · SVG — HASTA 10MB</span>
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f", marginRight: 4 }}>FILTRAR</span>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "var(--font-sans)", color: active ? "#F4F2EF" : "#55565a", background: active ? "#0D0D0E" : "transparent", border: active ? "1px solid #0D0D0E" : "1px solid #cbc7bc" }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {list.map((m) => {
              const active = m.id === selId;
              return (
                <button key={m.id} onClick={() => select(m)} style={{ padding: 0, border: active ? "2px solid #2F5DAA" : "1px solid #e5e1d7", borderRadius: 6, overflow: "hidden", background: "#fff", cursor: "pointer", textAlign: "left", boxShadow: active ? "0 8px 20px -12px rgba(47,93,170,.5)" : "none" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#15130e" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", left: 8, top: 8, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", color: "#F4F2EF", background: "rgba(13,13,14,.55)", borderRadius: 12, padding: "3px 8px" }}>{m.type.toUpperCase()}</span>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#6b6c66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.filename}</div>
                    <div style={{ marginTop: 3, fontSize: 10, color: "#a5a29a" }}>{m.size} KB</div>
                  </div>
                </button>
              );
            })}
          </div>
        </main>

        {/* detail */}
        <aside style={{ width: 352, minWidth: 352, borderLeft: "1px solid #e0dcd2", background: "#fff", padding: 26, overflow: "auto" }} className="thin-scroll">
          {sel ? (
            <div>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#15130e", borderRadius: 6, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sel.url} alt={sel.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>ARCHIVO</div>
              <div style={{ marginTop: 4, fontSize: 14, color: "#1B1D20", wordBreak: "break-all" }}>{sel.filename}</div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <div style={{ flex: 1, background: "#faf8f3", border: "1px solid #eee9df", borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", color: "#9a988f" }}>TIPO</div>
                  <div style={{ fontSize: 13, color: "#1B1D20", textTransform: "capitalize", marginTop: 3 }}>{sel.type}</div>
                </div>
                <div style={{ flex: 1, background: "#faf8f3", border: "1px solid #eee9df", borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", color: "#9a988f" }}>PESO</div>
                  <div style={{ fontSize: 13, color: "#1B1D20", marginTop: 3 }}>{sel.size} KB</div>
                </div>
              </div>

              <label style={detailLabel}>TEXTO ALT</label>
              <textarea value={sel.alt} onChange={(e) => setSel({ ...sel, alt: e.target.value })} rows={2} style={{ ...detailInput, resize: "vertical" }} />
              <label style={detailLabel}>LEYENDA</label>
              <input value={sel.caption} onChange={(e) => setSel({ ...sel, caption: e.target.value })} style={detailInput} />

              <label style={detailLabel}>URL</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly value={sel.url.length > 60 ? sel.url.slice(0, 60) + "…" : sel.url} style={{ ...detailInput, fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 0 }} />
                <button onClick={() => { navigator.clipboard?.writeText(sel.url); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{ border: "1px solid #cbc7bc", borderRadius: 3, background: "#fff", padding: "0 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
              </div>

              <label style={detailLabel}>EN USO ({sel.usedIn.length})</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {sel.usedIn.length === 0 && <span style={{ fontSize: 12, color: "#a5a29a" }}>Sin referencias.</span>}
                {sel.usedIn.map((u) => (
                  <span key={u} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#55565a", border: "1px solid #e5e1d7", borderRadius: 12, padding: "4px 9px" }}>{u}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                <AdminButton onClick={() => { upsertMedia(sel); setSaved(true); setTimeout(() => setSaved(false), 1500); reload(sel.id); }}>{saved ? "✓ Guardado" : "Guardar cambios"}</AdminButton>
                <AdminButton variant="danger" onClick={() => { deleteMedia(sel.id); reload(); }}>Eliminar</AdminButton>
              </div>
            </div>
          ) : (
            <div style={{ paddingTop: 60, textAlign: "center", color: "#a5a29a" }}>
              <div style={{ fontSize: 30 }}>🗂</div>
              <p style={{ marginTop: 14, fontSize: 13.5 }}>Selecciona un archivo para ver y editar sus detalles.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

const detailLabel = { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f", margin: "18px 0 8px" } as const;
const detailInput = { width: "100%", border: "1px solid #cbc7bc", borderRadius: 3, padding: "9px 12px", fontFamily: "var(--font-sans)", fontSize: 13.5, background: "#fff", outline: "none", marginTop: 0 } as const;
