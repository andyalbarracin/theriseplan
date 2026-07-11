/* =============================================================================
   Archivo:     page.tsx (Sobre mí — dashboard)
   Ruta:        web/src/app/dashboard/sobre-mi/page.tsx
   Modificado:  2026-07-11
   Descripcion: Editor de la página "Sobre mí". Permite configurar TODO: intro,
                retrato, valores (acordeón), frase propia y los widgets de posts
                y proyectos destacados. Se guarda en site_settings.data.about.
   ============================================================================= */
"use client";
import { useEffect, useState } from "react";
import type { AboutSettings, Post, Project } from "@/lib/types";
import { getSiteSettingsClient, updateSiteSettingsClient, listPosts, listProjects } from "@/lib/cms/client";
import { AdminTopbar, Card, AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";

const cardTitle = { fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", marginBottom: 4 } as const;
const cardHint = { margin: "0 0 18px", fontSize: 13, color: "#8a887f" } as const;
const ctrl = { width: 28, height: 28, border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#55565a" } as const;

const DEFAULT_ABOUT: AboutSettings = {
  eyebrow: "04 / SOBRE MÍ", title: "Sobre mí", tagline: "", portraitImage: "", portraitCaption: "",
  lead: "", body: "", originNote: "", values: [], quote: { text: "", cite: "" }, featuredPostIds: [], featuredProjectIds: [],
};

export default function DashboardSobreMi() {
  const [about, setAbout] = useState<AboutSettings | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettingsClient().then((s) => setAbout({ ...DEFAULT_ABOUT, ...(s.about ?? {}) }));
    listPosts().then(setPosts);
    listProjects().then(setProjects);
  }, []);

  if (!about) return null;
  const patch = (p: Partial<AboutSettings>) => setAbout({ ...about, ...p });

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteSettingsClient({ about });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      alert("No se pudo guardar: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  // ----- valores (acordeón) -----
  const setValue = (i: number, p: Partial<AboutSettings["values"][number]>) => patch({ values: about.values.map((v, idx) => (idx === i ? { ...v, ...p } : v)) });
  const addValue = () => patch({ values: [...about.values, { title: "", body: "" }] });
  const removeValue = (i: number) => patch({ values: about.values.filter((_, idx) => idx !== i) });
  const moveValue = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= about.values.length) return;
    const copy = [...about.values];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    patch({ values: copy });
  };

  // ----- widgets destacados -----
  const togglePost = (id: string) => patch({ featuredPostIds: about.featuredPostIds.includes(id) ? about.featuredPostIds.filter((x) => x !== id) : [...about.featuredPostIds, id] });
  const toggleProject = (id: string) => patch({ featuredProjectIds: about.featuredProjectIds.includes(id) ? about.featuredProjectIds.filter((x) => x !== id) : [...about.featuredProjectIds, id] });
  const filteredPosts = posts.filter((p) => !q.trim() || p.title.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <AdminTopbar title="Sobre mí" eyebrow="EDITAR LA PÁGINA · SOBRE MÍ" actions={<AdminButton onClick={save}>{saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar cambios"}</AdminButton>} />
      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px", display: "grid", gap: 26, maxWidth: 1000 }}>
        {/* INTRO */}
        <Card>
          <div style={cardTitle}>Encabezado e intro</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <TextField label="EYEBROW" value={about.eyebrow} onChange={(v) => patch({ eyebrow: v })} mono />
            <TextField label="TÍTULO" value={about.title} onChange={(v) => patch({ title: v })} />
            <div style={{ gridColumn: "1 / -1" }}>
              <TextField label="TAGLINE (MANUSCRITA)" value={about.tagline} onChange={(v) => patch({ tagline: v })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <TextAreaField label="FRASE DE INTRO (GRANDE)" value={about.lead} onChange={(v) => patch({ lead: v })} rows={2} serif />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <TextAreaField label="PÁRRAFO" value={about.body} onChange={(v) => patch({ body: v })} rows={3} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <TextAreaField label="NOTA DE ORIGEN" value={about.originNote} onChange={(v) => patch({ originNote: v })} rows={2} />
            </div>
          </div>
        </Card>

        {/* RETRATO */}
        <Card>
          <div style={cardTitle}>Retrato</div>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22, alignItems: "start" }}>
            <ImageField label="IMAGEN DEL RETRATO" value={about.portraitImage} onChange={(v) => patch({ portraitImage: v })} aspect="3/4" />
            <TextField label="LEYENDA DEL RETRATO" value={about.portraitCaption} onChange={(v) => patch({ portraitCaption: v })} mono />
          </div>
        </Card>

        {/* VALORES (acordeón) */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={cardTitle}>Valores (acordeón)</div>
            <AdminButton variant="ghost" onClick={addValue}>＋ Agregar valor</AdminButton>
          </div>
          <p style={cardHint}>Se muestran como un acordeón de una columna. Título visible + detalle que se despliega.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {about.values.map((v, i) => (
              <div key={i} style={{ border: "1px solid #e5e1d7", borderRadius: 8, padding: "14px 16px", background: "#faf8f3" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#2F5DAA" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => moveValue(i, -1)} aria-label="Subir" style={ctrl}>↑</button>
                    <button onClick={() => moveValue(i, 1)} aria-label="Bajar" style={ctrl}>↓</button>
                    <button onClick={() => removeValue(i)} aria-label="Quitar" style={{ ...ctrl, color: "#a23b3b" }}>×</button>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <TextField label="TÍTULO" value={v.title} onChange={(val) => setValue(i, { title: val })} />
                  <TextAreaField label="DETALLE (se despliega)" value={v.body} onChange={(val) => setValue(i, { body: val })} rows={2} />
                </div>
              </div>
            ))}
            {about.values.length === 0 && <p style={{ fontSize: 14, color: "#8a887f" }}>Sin valores. Agregá el primero.</p>}
          </div>
        </Card>

        {/* FRASE */}
        <Card>
          <div style={cardTitle}>Frase propia</div>
          <div style={{ display: "grid", gap: 16 }}>
            <TextAreaField label="FRASE" value={about.quote.text} onChange={(v) => patch({ quote: { ...about.quote, text: v } })} rows={2} hint="Una línea por renglón." />
            <TextField label="FIRMA / AUTOR" value={about.quote.cite} onChange={(v) => patch({ quote: { ...about.quote, cite: v } })} />
          </div>
        </Card>

        {/* WIDGET: posts destacados */}
        <Card>
          <div style={cardTitle}>Escritos destacados (widget)</div>
          <p style={cardHint}>Elegí qué posts aparecen como tarjetas en la página. {about.featuredPostIds.length} seleccionados.</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar post…" style={{ height: 40, width: "100%", maxWidth: 320, border: "1px solid #cbc7bc", borderRadius: 6, padding: "0 12px", fontSize: 14, outline: "none", marginBottom: 14, background: "#fff" }} />
          <div style={{ maxHeight: 260, overflow: "auto", border: "1px solid #eee9df", borderRadius: 8 }} className="thin-scroll">
            {filteredPosts.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid #f1ede4", cursor: "pointer" }}>
                <input type="checkbox" checked={about.featuredPostIds.includes(p.id)} onChange={() => togglePost(p.id)} />
                <span style={{ fontSize: 14, color: "#1B1D20" }}>{p.title}</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "#a5a29a" }}>{(p.category || "").toUpperCase()}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* WIDGET: proyectos destacados */}
        <Card>
          <div style={cardTitle}>Proyectos destacados (widget)</div>
          <p style={cardHint}>Elegí qué proyectos aparecen como tarjetas. {about.featuredProjectIds.length} seleccionados.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {projects.map((pr) => (
              <label key={pr.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid #eee9df", borderRadius: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={about.featuredProjectIds.includes(pr.id)} onChange={() => toggleProject(pr.id)} />
                <span style={{ fontSize: 14, color: "#1B1D20" }}>{pr.title}</span>
              </label>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
