"use client";
import { useEffect, useRef, useState } from "react";
import type { ContentBlock } from "@/lib/types";
import { MediaPicker } from "./MediaPicker";

const NEW_BLOCK: Record<string, () => ContentBlock> = {
  html: () => ({ type: "html", html: "" }),
  paragraph: () => ({ type: "paragraph", text: "" }),
  heading: () => ({ type: "heading", text: "" }),
  quote: () => ({ type: "quote", text: "", cite: "" }),
  image: () => ({ type: "image", url: "/images/mountains.png", caption: "" }),
  callout: () => ({ type: "callout", text: "" }),
  route: () => ({ type: "route", from: "CDG", to: "MEX", meta: {} }),
  handwritten: () => ({ type: "handwritten", text: "" }),
  video: () => ({ type: "video", url: "", caption: "" }),
  metric: () => ({ type: "metric", label: "", value: "" }),
  stack: () => ({ type: "stack", items: [] }),
  feature: () => ({ type: "feature", items: [] }),
};

const ADD_LABELS: Record<string, string> = {
  html: "Texto enriquecido",
  paragraph: "Párrafo",
  heading: "Encabezado",
  quote: "Cita",
  image: "Imagen",
  callout: "Destacado",
  route: "Ticket",
  handwritten: "Manuscrito",
  video: "Video",
  metric: "Métrica",
  stack: "Stack",
  feature: "Lista",
};

const inputStyle = { width: "100%", border: "1px solid #cbc7bc", borderRadius: 3, padding: "8px 12px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" } as const;
const ctrlBtn = { width: 28, height: 28, border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#55565a", lineHeight: 1 } as const;

export function BlockEditor({ blocks, onChange, kinds }: { blocks: ContentBlock[]; onChange: (b: ContentBlock[]) => void; kinds: string[] }) {
  const [picker, setPicker] = useState<number | null>(null);

  const update = (i: number, patch: Record<string, unknown>) =>
    onChange(blocks.map((b, idx) => (idx === i ? ({ ...b, ...patch } as ContentBlock) : b)));
  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const copy = [...blocks];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i));
  const add = (kind: string) => onChange([...blocks, NEW_BLOCK[kind]()]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {blocks.map((b, i) => (
          <div key={i} style={{ border: "1px solid #e5e1d7", borderRadius: 6, background: "#faf8f3", padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", color: "#9a988f", background: "#fff", border: "1px solid #e5e1d7", borderRadius: 4, padding: "3px 8px" }}>{b.type.toUpperCase()}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => move(i, -1)} aria-label="Subir" style={ctrlBtn}>↑</button>
                <button onClick={() => move(i, 1)} aria-label="Bajar" style={ctrlBtn}>↓</button>
                <button onClick={() => remove(i)} aria-label="Eliminar" style={{ ...ctrlBtn, color: "#a23b3b" }}>×</button>
              </div>
            </div>
            <BlockInputs block={b} onUpdate={(patch) => update(i, patch)} onPick={() => setPicker(i)} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {kinds.map((k) => (
          <button key={k} onClick={() => add(k)} style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#1B1D20", background: "transparent", border: "1px dashed #cbc7bc", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}>
            ＋ {ADD_LABELS[k] ?? k}
          </button>
        ))}
      </div>

      <MediaPicker open={picker !== null} onClose={() => setPicker(null)} onPick={(url) => picker !== null && update(picker, { url })} />
    </div>
  );
}

function BlockInputs({ block, onUpdate, onPick }: { block: ContentBlock; onUpdate: (patch: Record<string, unknown>) => void; onPick: () => void }) {
  switch (block.type) {
    case "html":
      return <HtmlBlockEditor html={block.html} onChange={(html) => onUpdate({ html })} />;
    case "paragraph":
    case "callout":
      return <textarea value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Escribe el texto…" style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.5 }} />;
    case "heading":
      return <input value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Texto del encabezado" style={{ ...inputStyle, fontFamily: "var(--font-serif)", fontSize: 18 }} />;
    case "handwritten":
      return <input value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Nota manuscrita" style={{ ...inputStyle, fontFamily: "var(--font-serif)", fontSize: 16 }} />;
    case "quote":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <textarea value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Texto de la cita" style={{ ...inputStyle, minHeight: 60, fontFamily: "var(--font-serif)", fontSize: 16, resize: "vertical" }} />
          <input value={block.cite ?? ""} onChange={(e) => onUpdate({ cite: e.target.value })} placeholder="Autor / fuente" style={inputStyle} />
        </div>
      );
    case "image":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={block.url} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="URL de la imagen (/images/…)" style={inputStyle} />
            <button onClick={onPick} style={{ ...ctrlBtn, width: "auto", height: 36, padding: "0 12px", whiteSpace: "nowrap" }}>Biblioteca</button>
          </div>
          <input value={block.caption ?? ""} onChange={(e) => onUpdate({ caption: e.target.value })} placeholder="Leyenda" style={inputStyle} />
        </div>
      );
    case "video":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <input value={block.url} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="URL del video" style={inputStyle} />
          <input value={block.caption ?? ""} onChange={(e) => onUpdate({ caption: e.target.value })} placeholder="Descripción del video" style={inputStyle} />
        </div>
      );
    case "route":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={block.from} onChange={(e) => onUpdate({ from: e.target.value.toUpperCase() })} placeholder="ORIGEN" style={{ ...inputStyle, fontFamily: "var(--font-mono)", maxWidth: 120 }} />
          <span style={{ color: "#6E7C8B" }}>→</span>
          <input value={block.to} onChange={(e) => onUpdate({ to: e.target.value.toUpperCase() })} placeholder="DESTINO" style={{ ...inputStyle, fontFamily: "var(--font-mono)", maxWidth: 120 }} />
        </div>
      );
    case "metric":
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <input value={block.label} onChange={(e) => onUpdate({ label: e.target.value })} placeholder="Etiqueta" style={inputStyle} />
          <input value={block.value} onChange={(e) => onUpdate({ value: e.target.value })} placeholder="Valor" style={inputStyle} />
        </div>
      );
    case "stack":
    case "feature":
      return <input value={block.items.join(", ")} onChange={(e) => onUpdate({ items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="item, item, item" style={inputStyle} />;
    default:
      return <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#9a988f" }}>Bloque «{block.type}»</div>;
  }
}

/* =============================================================================
   Editor de texto enriquecido (bloque "html") — estilo WordPress clásico.
   Dos modos:
     • VISUAL: escribís con formato (negrita, listas, títulos, links, cita) en un
       área editable. La barra usa comandos del navegador (execCommand).
     • HTML: ves y editás el HTML puro en un área de texto monoespaciada.
   El contenido siempre queda guardado como HTML en el bloque, así el post se
   ve igual en el sitio (clase .legacy-html).
   ============================================================================= */
const TOOLBAR: { cmd: string; arg?: string; label: string; title: string }[] = [
  { cmd: "bold", label: "B", title: "Negrita" },
  { cmd: "italic", label: "I", title: "Cursiva" },
  { cmd: "formatBlock", arg: "H2", label: "H2", title: "Encabezado" },
  { cmd: "formatBlock", arg: "BLOCKQUOTE", label: "❝", title: "Cita" },
  { cmd: "insertUnorderedList", label: "•", title: "Lista con viñetas" },
  { cmd: "insertOrderedList", label: "1.", title: "Lista numerada" },
  { cmd: "removeFormat", label: "⌫", title: "Quitar formato" },
];

function HtmlBlockEditor({ html, onChange }: { html: string; onChange: (html: string) => void }) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const ref = useRef<HTMLDivElement>(null);

  // Carga el HTML en el área visual al montar y cada vez que se vuelve a "visual".
  // No se re-inyecta mientras se tipea (para no perder el cursor).
  useEffect(() => {
    if (mode === "visual" && ref.current && ref.current.innerHTML !== html) {
      ref.current.innerHTML = html || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const syncFromDom = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };
  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    syncFromDom();
  };
  const addLink = () => {
    const url = window.prompt("URL del enlace:", "https://");
    if (url) exec("createLink", url);
  };

  const tab = (m: "visual" | "html", label: string) => (
    <button
      onClick={() => setMode(m)}
      style={{
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        letterSpacing: ".08em",
        padding: "6px 12px",
        border: "1px solid #cbc7bc",
        borderBottom: mode === m ? "1px solid #faf8f3" : "1px solid #cbc7bc",
        borderRadius: "5px 5px 0 0",
        background: mode === m ? "#fff" : "#efece4",
        color: mode === m ? "#1B1D20" : "#8a887f",
        cursor: "pointer",
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* pestañas Visual / HTML */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #cbc7bc" }}>
        {tab("visual", "VISUAL")}
        {tab("html", "HTML")}
      </div>

      {mode === "visual" ? (
        <>
          {/* barra de formato */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 0", borderBottom: "1px solid #eee5d9" }}>
            {TOOLBAR.map((t) => (
              <button
                key={t.label}
                title={t.title}
                onMouseDown={(e) => e.preventDefault() /* no perder la selección */}
                onClick={() => exec(t.cmd, t.arg)}
                style={{ minWidth: 32, height: 30, border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#33352f", fontWeight: t.label === "B" ? 700 : 400, fontStyle: t.label === "I" ? "italic" : "normal" }}
              >
                {t.label}
              </button>
            ))}
            <button title="Enlace" onMouseDown={(e) => e.preventDefault()} onClick={addLink} style={{ minWidth: 32, height: 30, border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#33352f" }}>🔗</button>
          </div>
          {/* área editable con el mismo estilo que el sitio (.legacy-html) */}
          <div
            ref={ref}
            className="legacy-html"
            contentEditable
            suppressContentEditableWarning
            onInput={syncFromDom}
            onBlur={syncFromDom}
            style={{ minHeight: 260, background: "#fff", border: "1px solid #cbc7bc", borderTop: "none", borderRadius: "0 0 4px 4px", padding: "16px 18px", outline: "none", fontSize: 16 }}
          />
        </>
      ) : (
        <textarea
          value={html}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>HTML del artículo…</p>"
          spellCheck={false}
          style={{ width: "100%", minHeight: 300, background: "#fff", border: "1px solid #cbc7bc", borderTop: "none", borderRadius: "0 0 4px 4px", padding: "16px 18px", outline: "none", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6, resize: "vertical", color: "#33352f" }}
        />
      )}
    </div>
  );
}
