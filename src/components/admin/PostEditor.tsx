"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post, PostStatus, PostType, Visibility } from "@/lib/types";
import { getPostById, upsertPost, deletePost } from "@/lib/cms";
import { useClientData } from "@/hooks/useClientData";
import { AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField, SelectField, SegmentedField, ToggleField, Field } from "@/components/admin/fields";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";

function blankPost(): Post {
  return {
    id: "",
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    category: "Reflexiones",
    type: "cronica",
    status: "draft",
    visibility: "public",
    featured: false,
    heroImage: "/images/notebook.png",
    gallery: [],
    bodyBlocks: [{ type: "paragraph", text: "" }],
    readingTime: 4,
    publishedAt: "",
    location: null,
    related: [],
    seo: { title: "", description: "", ogImage: "" },
  };
}

const TABS = [
  ["content", "Contenido"],
  ["media", "Media"],
  ["meta", "Metadatos"],
  ["seo", "SEO"],
  ["vis", "Visibilidad"],
] as const;

export function PostEditor({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const router = useRouter();
  const { data: loaded, ready } = useClientData<Post | null>(() => (mode === "edit" && id ? getPostById(id) : blankPost()));

  if (!ready) return <LoadingBar />;
  if (mode === "edit" && !loaded) return <NotFoundNote />;
  return <Editor initial={loaded ?? blankPost()} mode={mode} router={router} />;
}

function Editor({ initial, mode, router }: { initial: Post; mode: "new" | "edit"; router: ReturnType<typeof useRouter> }) {
  const [post, setPost] = useState<Post>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("content");
  const [savedFlash, setSavedFlash] = useState(false);
  const [picker, setPicker] = useState<null | "hero" | "gallery">(null);
  const baseline = useMemo(() => JSON.stringify(initial), [initial]);
  const dirty = JSON.stringify(post) !== baseline;

  const patch = (p: Partial<Post>) => setPost((cur) => ({ ...cur, ...p }));

  const save = () => {
    const saved = upsertPost({ ...post });
    setPost(saved);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (mode === "new") router.replace(`/dashboard/cuaderno/${saved.id}`);
    router.refresh();
  };
  const remove = () => {
    if (post.id) deletePost(post.id);
    router.push("/dashboard/cuaderno");
  };

  const dirtyLabel = savedFlash ? "✓ Guardado" : dirty ? "Cambios sin guardar" : "Sin cambios";
  const dirtyColor = savedFlash ? "#1f8a5b" : dirty ? "#b07a1e" : "#9a988f";

  return (
    <div style={{ width: "100%" }}>
      {/* header */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(244,242,239,.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e0dcd2", padding: "18px clamp(20px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <Link href="/dashboard/cuaderno" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>
            ← {mode === "new" ? "NUEVO ARTÍCULO" : "EDITAR ARTÍCULO · CUADERNO"}
          </Link>
          <div style={{ marginTop: 4, fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 420 }}>{post.title || "Sin título"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: dirtyColor }}>{dirtyLabel}</span>
          <AdminButton variant="ghost" href={`/cuaderno/${post.slug || ""}`}>↗ Ver</AdminButton>
          <AdminButton onClick={save}>{savedFlash ? "✓ Guardado" : "Guardar"}</AdminButton>
        </div>
      </header>

      {/* tabs */}
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
        {tab === "content" && (
          <div style={{ display: "grid", gap: 22 }}>
            <TextField label="TÍTULO" value={post.title} onChange={(v) => patch({ title: v })} big placeholder="Título del artículo" />
            <TextField label="SLUG" value={post.slug} onChange={(v) => patch({ slug: v })} mono placeholder="se-genera-del-titulo" />
            <TextField label="SUBTÍTULO" value={post.subtitle ?? ""} onChange={(v) => patch({ subtitle: v })} />
            <TextAreaField label="EXTRACTO" value={post.excerpt ?? ""} onChange={(v) => patch({ excerpt: v })} rows={3} />
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20" }}>Cuerpo del artículo</div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>{post.bodyBlocks.length} BLOQUES</span>
              </div>
              <BlockEditor blocks={post.bodyBlocks} onChange={(b) => patch({ bodyBlocks: b })} kinds={["paragraph", "heading", "quote", "image", "callout", "route", "handwritten"]} />
            </div>
          </div>
        )}

        {tab === "media" && (
          <div style={{ display: "grid", gap: 28 }}>
            <Field label="IMAGEN PRINCIPAL (HERO)" hint="Se usa como portada y como imagen social (OG) por defecto.">
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ position: "relative", width: 320, height: 200, background: "#15130e", borderRadius: 4, overflow: "hidden", flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <AdminButton variant="ghost" onClick={() => setPicker("hero")}>Cambiar imagen</AdminButton>
              </div>
            </Field>
            <Field label={`GALERÍA (${post.gallery.length})`}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {post.gallery.map((g, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "3/2", background: "#15130e", borderRadius: 4, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={() => patch({ gallery: post.gallery.filter((_, idx) => idx !== i) })} aria-label="Quitar" style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(13,13,14,.7)", color: "#fff", cursor: "pointer" }}>×</button>
                  </div>
                ))}
                <button onClick={() => setPicker("gallery")} style={{ aspectRatio: "3/2", border: "1px dashed #cbc7bc", borderRadius: 4, background: "transparent", cursor: "pointer", color: "#8a887f", fontSize: 22 }}>＋</button>
              </div>
            </Field>
          </div>
        )}

        {tab === "meta" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, maxWidth: 720 }}>
            <TextField label="CATEGORÍA" value={post.category} onChange={(v) => patch({ category: v })} />
            <SelectField label="TIPO" value={post.type} onChange={(v) => patch({ type: v as PostType })} options={[
              { value: "cronica", label: "Crónica" },
              { value: "ensayo", label: "Ensayo" },
              { value: "video", label: "Video" },
              { value: "reflexion", label: "Reflexión" },
              { value: "proyecto", label: "Proyecto" },
            ]} />
            <TextField label="FECHA DE PUBLICACIÓN" value={post.publishedAt ?? ""} onChange={(v) => patch({ publishedAt: v })} mono placeholder="2026-05-04" />
            <TextField label="TIEMPO DE LECTURA (MIN)" value={String(post.readingTime ?? "")} onChange={(v) => patch({ readingTime: parseInt(v) || 0 })} />
            <div style={{ gridColumn: "1 / -1" }}>
              <TextField label="UBICACIÓN (OPCIONAL)" value={post.location?.name ?? ""} onChange={(v) => patch({ location: v ? { ...(post.location ?? { name: v }), name: v } : null })} placeholder="Ciudad, País" />
            </div>
          </div>
        )}

        {tab === "seo" && <SeoTab title={post.seo.title} description={post.seo.description} fallbackTitle={post.title} fallbackDesc={post.excerpt ?? ""} slug={post.slug} scope="cuaderno" onTitle={(v) => patch({ seo: { ...post.seo, title: v } })} onDesc={(v) => patch({ seo: { ...post.seo, description: v } })} />}

        {tab === "vis" && (
          <div style={{ display: "grid", gap: 24, maxWidth: 640 }}>
            <SegmentedField<PostStatus> label="ESTADO" value={post.status} onChange={(v) => patch({ status: v })} options={[
              { value: "draft", label: "Borrador" },
              { value: "published", label: "Publicado" },
              { value: "archived", label: "Archivado" },
            ]} />
            <SegmentedField<Visibility> label="VISIBILIDAD" value={post.visibility} onChange={(v) => patch({ visibility: v })} options={[
              { value: "public", label: "Público" },
              { value: "private", label: "Privado" },
              { value: "hidden", label: "Oculto" },
            ]} />
            <ToggleField label="Destacar en portada" checked={post.featured} onChange={(v) => patch({ featured: v })} hint="Aparece en los módulos destacados de la home." />
            <div style={{ borderTop: "1px solid #e5e1d7", paddingTop: 22 }}>
              <AdminButton variant="danger" onClick={remove}>Eliminar artículo</AdminButton>
            </div>
          </div>
        )}
      </main>

      <MediaPicker open={picker !== null} onClose={() => setPicker(null)} onPick={(url) => {
        if (picker === "hero") patch({ heroImage: url });
        else if (picker === "gallery") patch({ gallery: [...post.gallery, url] });
      }} />
    </div>
  );
}

export function SeoTab({ title, description, fallbackTitle, fallbackDesc, slug, scope, onTitle, onDesc }: { title: string; description: string; fallbackTitle: string; fallbackDesc: string; slug: string; scope: string; onTitle: (v: string) => void; onDesc: (v: string) => void }) {
  const warn = (ok: boolean) => (
    <span style={{ fontSize: 10, marginLeft: 8, color: ok ? "#1f8a5b" : "#b07a1e" }}>{ok ? "✓" : "· falta"}</span>
  );
  return (
    <div style={{ display: "grid", gap: 22, maxWidth: 720 }}>
      <Field label={<>SEO · TÍTULO {warn(!!title)}</>}>
        <input value={title} onChange={(e) => onTitle(e.target.value)} style={{ width: "100%", height: 46, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" }} />
      </Field>
      <Field label={<>SEO · DESCRIPCIÓN {warn(!!description)}</>}>
        <textarea value={description} onChange={(e) => onDesc(e.target.value)} rows={3} style={{ width: "100%", minHeight: 72, border: "1px solid #cbc7bc", borderRadius: 3, padding: "12px 14px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
      </Field>
      <div style={{ background: "#fff", border: "1px solid #e5e1d7", borderRadius: 8, padding: "18px 20px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>VISTA PREVIA EN BUSCADORES</div>
        <div style={{ marginTop: 12, color: "#1f7a34", fontSize: 13 }}>andyalbarracin.com › {scope} › {slug || "…"}</div>
        <div style={{ marginTop: 4, color: "#1a0dab", fontSize: 19 }}>{title || fallbackTitle || "Título"}</div>
        <div style={{ marginTop: 4, color: "#4d5156", fontSize: 13.5, lineHeight: 1.5 }}>{description || fallbackDesc || "Descripción para buscadores…"}</div>
      </div>
    </div>
  );
}

function LoadingBar() {
  return <div style={{ padding: 40, fontFamily: "var(--font-mono)", fontSize: 12, color: "#9a988f" }}>Cargando…</div>;
}
function NotFoundNote() {
  return (
    <div style={{ padding: 40 }}>
      <p style={{ fontSize: 15, color: "#8a887f" }}>Artículo no encontrado.</p>
      <AdminButton variant="ghost" href="/dashboard/cuaderno">← Volver</AdminButton>
    </div>
  );
}
