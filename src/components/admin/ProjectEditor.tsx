"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project, ProjectStatus, Visibility } from "@/lib/types";
import { getProjectById, upsertProject, deleteProject } from "@/lib/cms";
import { useClientData } from "@/hooks/useClientData";
import { AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField, SegmentedField, ToggleField, ChipsField, Field } from "@/components/admin/fields";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { SeoTab } from "@/components/admin/PostEditor";

function blankProject(): Project {
  return {
    id: "",
    title: "",
    slug: "",
    subtitle: "",
    shortDescription: "",
    longDescription: "",
    type: "Proyecto",
    status: "draft",
    visibility: "public",
    sensitive: false,
    featured: false,
    heroImage: "/images/workspace.png",
    gallery: [],
    tags: [],
    technologies: [],
    links: [],
    role: "",
    timeline: "",
    blocks: [
      { type: "heading", text: "Qué es" },
      { type: "paragraph", text: "" },
    ],
    seo: { title: "", description: "", ogImage: "" },
  };
}

const TABS = [
  ["overview", "Resumen"],
  ["content", "Contenido"],
  ["media", "Media"],
  ["links", "Enlaces"],
  ["seo", "SEO"],
  ["vis", "Visibilidad"],
] as const;

export function ProjectEditor({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const router = useRouter();
  const { data: loaded, ready } = useClientData<Project | null>(() => (mode === "edit" && id ? getProjectById(id) : blankProject()));

  if (!ready) return <div style={{ padding: 40, fontFamily: "var(--font-mono)", fontSize: 12, color: "#9a988f" }}>Cargando…</div>;
  if (mode === "edit" && !loaded)
    return (
      <div style={{ padding: 40 }}>
        <p style={{ fontSize: 15, color: "#8a887f" }}>Proyecto no encontrado.</p>
        <AdminButton variant="ghost" href="/dashboard/proyectos">← Volver</AdminButton>
      </div>
    );
  return <Editor initial={loaded ?? blankProject()} mode={mode} router={router} />;
}

function Editor({ initial, mode, router }: { initial: Project; mode: "new" | "edit"; router: ReturnType<typeof useRouter> }) {
  const [pr, setPr] = useState<Project>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("overview");
  const [savedFlash, setSavedFlash] = useState(false);
  const [picker, setPicker] = useState<null | "hero" | "gallery">(null);
  const baseline = useMemo(() => JSON.stringify(initial), [initial]);
  const dirty = JSON.stringify(pr) !== baseline;
  const patch = (p: Partial<Project>) => setPr((cur) => ({ ...cur, ...p }));

  const save = () => {
    const saved = upsertProject({ ...pr });
    setPr(saved);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (mode === "new") router.replace(`/dashboard/proyectos/${saved.id}`);
    router.refresh();
  };
  const remove = () => {
    if (pr.id) deleteProject(pr.id);
    router.push("/dashboard/proyectos");
  };

  const dirtyLabel = savedFlash ? "✓ Guardado" : dirty ? "Cambios sin guardar" : "Sin cambios";
  const dirtyColor = savedFlash ? "#1f8a5b" : dirty ? "#b07a1e" : "#9a988f";

  return (
    <div style={{ width: "100%" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(244,242,239,.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e0dcd2", padding: "18px clamp(20px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <Link href="/dashboard/proyectos" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>← {mode === "new" ? "NUEVO PROYECTO" : "EDITAR PROYECTO"}</Link>
          <div style={{ marginTop: 4, fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 420 }}>{pr.title || "Sin título"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: dirtyColor }}>{dirtyLabel}</span>
          <AdminButton variant="ghost" href={`/proyectos/${pr.slug || ""}`}>↗ Ver</AdminButton>
          <AdminButton onClick={save}>{savedFlash ? "✓ Guardado" : "Guardar"}</AdminButton>
        </div>
      </header>

      <div style={{ position: "sticky", top: 77, zIndex: 15, background: "#F4F2EF", borderBottom: "1px solid #e0dcd2", padding: "0 clamp(20px,4vw,40px)", display: "flex", gap: 8, overflowX: "auto" }}>
        {TABS.map(([k, label]) => {
          const active = tab === k;
          return (
            <button key={k} onClick={() => setTab(k)} style={{ padding: "16px 6px", background: "none", border: "none", borderBottom: active ? "2px solid #2F5DAA" : "2px solid transparent", color: active ? "#1B1D20" : "#8a887f", fontFamily: "var(--font-sans)", fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
              {label}
            </button>
          );
        })}
      </div>

      <main style={{ maxWidth: 1000, padding: "32px clamp(20px,4vw,40px) 72px" }}>
        {tab === "overview" && (
          <div style={{ display: "grid", gap: 22 }}>
            <TextField label="NOMBRE DEL PROYECTO" value={pr.title} onChange={(v) => patch({ title: v })} big placeholder="Nombre del proyecto" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              <TextField label="SLUG" value={pr.slug} onChange={(v) => patch({ slug: v })} mono />
              <TextField label="TIPO" value={pr.type} onChange={(v) => patch({ type: v })} placeholder="Documental, Producto…" />
              <TextField label="ROL" value={pr.role ?? ""} onChange={(v) => patch({ role: v })} />
              <TextField label="CRONOLOGÍA" value={pr.timeline ?? ""} onChange={(v) => patch({ timeline: v })} placeholder="2025 — presente" />
            </div>
            <TextAreaField label="DESCRIPCIÓN CORTA" value={pr.shortDescription} onChange={(v) => patch({ shortDescription: v })} rows={3} />
            <ChipsField label="TAGS" values={pr.tags} onChange={(v) => patch({ tags: v })} />
            <ChipsField label="STACK / TECNOLOGÍAS" values={pr.technologies} onChange={(v) => patch({ technologies: v })} />
          </div>
        )}

        {tab === "content" && (
          <div style={{ display: "grid", gap: 22 }}>
            <TextAreaField label="DESCRIPCIÓN LARGA" value={pr.longDescription ?? ""} onChange={(v) => patch({ longDescription: v })} rows={4} serif />
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20" }}>Bloques de contenido</div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>{pr.blocks.length} BLOQUES</span>
              </div>
              <BlockEditor blocks={pr.blocks} onChange={(b) => patch({ blocks: b })} kinds={["heading", "paragraph", "quote", "image", "metric", "stack", "callout", "route"]} />
            </div>
          </div>
        )}

        {tab === "media" && (
          <div style={{ display: "grid", gap: 28 }}>
            <Field label="IMAGEN PRINCIPAL">
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ position: "relative", width: 340, height: 212, background: "#15130e", borderRadius: 4, overflow: "hidden", flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pr.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <AdminButton variant="ghost" onClick={() => setPicker("hero")}>Cambiar imagen</AdminButton>
              </div>
            </Field>
            <Field label={`GALERÍA (${pr.gallery.length})`}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {pr.gallery.map((g, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "3/2", background: "#15130e", borderRadius: 4, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={() => patch({ gallery: pr.gallery.filter((_, idx) => idx !== i) })} aria-label="Quitar" style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(13,13,14,.7)", color: "#fff", cursor: "pointer" }}>×</button>
                  </div>
                ))}
                <button onClick={() => setPicker("gallery")} style={{ aspectRatio: "3/2", border: "1px dashed #cbc7bc", borderRadius: 4, background: "transparent", cursor: "pointer", color: "#8a887f", fontSize: 22 }}>＋</button>
              </div>
            </Field>
          </div>
        )}

        {tab === "links" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20", marginBottom: 16 }}>Enlaces del proyecto</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pr.links.map((l, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 44px", gap: 10 }}>
                  <input value={l.label} onChange={(e) => patch({ links: pr.links.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)) })} placeholder="Etiqueta" style={rowInput} />
                  <input value={l.url} onChange={(e) => patch({ links: pr.links.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} placeholder="https://…" style={{ ...rowInput, fontFamily: "var(--font-mono)", fontSize: 13 }} />
                  <button onClick={() => patch({ links: pr.links.filter((_, idx) => idx !== i) })} aria-label="Quitar" style={{ border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", color: "#a23b3b", cursor: "pointer" }}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => patch({ links: [...pr.links, { label: "", url: "" }] })} style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#1B1D20", background: "transparent", border: "1px dashed #cbc7bc", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}>＋ Añadir enlace</button>
          </div>
        )}

        {tab === "seo" && <SeoTab title={pr.seo.title} description={pr.seo.description} fallbackTitle={pr.title} fallbackDesc={pr.shortDescription} slug={pr.slug} scope="proyectos" onTitle={(v) => patch({ seo: { ...pr.seo, title: v } })} onDesc={(v) => patch({ seo: { ...pr.seo, description: v } })} />}

        {tab === "vis" && (
          <div style={{ display: "grid", gap: 24, maxWidth: 640 }}>
            <SegmentedField<ProjectStatus> label="ESTADO" value={pr.status} onChange={(v) => patch({ status: v })} options={[
              { value: "building", label: "Construyendo" },
              { value: "active", label: "Activo" },
              { value: "paused", label: "En pausa" },
              { value: "archived", label: "Archivado" },
              { value: "draft", label: "Borrador" },
            ]} />
            <SegmentedField<Visibility> label="VISIBILIDAD" value={pr.visibility} onChange={(v) => patch({ visibility: v })} options={[
              { value: "public", label: "Público" },
              { value: "private", label: "Privado" },
              { value: "hidden", label: "Oculto" },
            ]} />
            <ToggleField label="Contenido sensible / privado" checked={pr.sensitive} onChange={(v) => patch({ sensitive: v })} hint="Si está activo, el proyecto nunca aparece en el sitio público." />
            <ToggleField label="Destacar en portada" checked={pr.featured} onChange={(v) => patch({ featured: v })} hint="Aparece como proyecto destacado en la home." />
            <div style={{ borderTop: "1px solid #e5e1d7", paddingTop: 22 }}>
              <AdminButton variant="danger" onClick={remove}>Eliminar proyecto</AdminButton>
            </div>
          </div>
        )}
      </main>

      <MediaPicker open={picker !== null} onClose={() => setPicker(null)} onPick={(url) => {
        if (picker === "hero") patch({ heroImage: url });
        else if (picker === "gallery") patch({ gallery: [...pr.gallery, url] });
      }} />
    </div>
  );
}

const rowInput = { width: "100%", height: 44, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 12px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" } as const;
