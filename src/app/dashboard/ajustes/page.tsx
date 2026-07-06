"use client";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { getSiteSettingsClient, updateSiteSettingsClient } from "@/lib/cms/client";
import { AdminTopbar, Card, AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField, SelectField, RangeField } from "@/components/admin/fields";

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 40, height: 40, border: "1px solid #cbc7bc", borderRadius: 6, background: "none", cursor: "pointer", padding: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "#9a988f" }}>{label}</div>
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #e5e1d7", fontFamily: "var(--font-mono)", fontSize: 13, color: "#1B1D20", padding: "4px 0", outline: "none", background: "none" }} />
      </div>
    </div>
  );
}

export default function DashboardAjustes() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    getSiteSettingsClient().then(setS);
  }, []);
  if (!s) return null;

  const setTheme = (patch: Partial<SiteSettings["theme"]>) => setS({ ...s, theme: { ...s.theme, ...patch } });
  const save = async () => {
    await updateSiteSettingsClient(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <>
      <AdminTopbar title="Ajustes" eyebrow="IDENTIDAD · MARCA · SEO · TEMA" actions={<AdminButton onClick={save}>{saved ? "✓ Guardado" : "Guardar cambios"}</AdminButton>} />
      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px", display: "grid", gap: 26, maxWidth: 1000 }}>
        <Card>
          <div style={cardTitle}>Identidad</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <TextField label="NOMBRE DEL SITIO" value={s.siteName} onChange={(v) => setS({ ...s, siteName: v })} />
            <TextField label="DOMINIO" value={s.domain} onChange={(v) => setS({ ...s, domain: v })} mono />
            <TextField label="MONOGRAMA" value={s.monogram} onChange={(v) => setS({ ...s, monogram: v })} />
            <TextField label="WORDMARK" value={s.wordmark} onChange={(v) => setS({ ...s, wordmark: v })} />
            <SelectField label="IDIOMA" value={s.language} onChange={(v) => setS({ ...s, language: v })} options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }]} />
            <TextField label="EMAIL DE CONTACTO" value={s.contactEmail} onChange={(v) => setS({ ...s, contactEmail: v })} mono />
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>Marca y OG</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <TextField label="LOGO (URL)" value={s.logoUrl} onChange={(v) => setS({ ...s, logoUrl: v })} mono placeholder="/images/logo.svg" />
            <TextField label="FAVICON (URL)" value={s.faviconUrl} onChange={(v) => setS({ ...s, faviconUrl: v })} mono placeholder="/favicon.svg" />
            <div style={{ gridColumn: "1 / -1" }}>
              <TextField label="OG IMAGE POR DEFECTO" value={s.defaultOgImage} onChange={(v) => setS({ ...s, defaultOgImage: v })} mono />
            </div>
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>SEO por defecto</div>
          <div style={{ display: "grid", gap: 20 }}>
            <TextField label="TÍTULO SEO" value={s.seo.title} onChange={(v) => setS({ ...s, seo: { ...s.seo, title: v } })} />
            <TextAreaField label="DESCRIPCIÓN SEO" value={s.seo.description} onChange={(v) => setS({ ...s, seo: { ...s.seo, description: v } })} rows={3} />
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>Footer</div>
          <div style={{ display: "grid", gap: 20 }}>
            <TextField label="TAGLINE" value={s.footerTagline} onChange={(v) => setS({ ...s, footerTagline: v })} />
            <TextField label="FRASE MANUSCRITA" value={s.footerQuote} onChange={(v) => setS({ ...s, footerQuote: v })} />
            <TextField label="COPYRIGHT" value={s.copyrightText} onChange={(v) => setS({ ...s, copyrightText: v })} />
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>Redes sociales</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {s.socialLinks.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input value={l.platform} onChange={(e) => setS({ ...s, socialLinks: s.socialLinks.map((x, idx) => (idx === i ? { ...x, platform: e.target.value } : x)) })} style={{ width: 140, height: 42, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 12px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" }} />
                <input value={l.url} onChange={(e) => setS({ ...s, socialLinks: s.socialLinks.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} placeholder="https://…" style={{ flex: 1, height: 42, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 12px", fontFamily: "var(--font-mono)", fontSize: 13, background: "#fff", outline: "none" }} />
                <button onClick={() => setS({ ...s, socialLinks: s.socialLinks.map((x, idx) => (idx === i ? { ...x, visible: !x.visible } : x)) })} role="switch" aria-checked={l.visible} aria-label={`Visibilidad ${l.platform}`} style={{ width: 46, height: 26, borderRadius: 20, border: "none", cursor: "pointer", flex: "none", background: l.visible ? "#2F5DAA" : "#cbc7bc", position: "relative" }}>
                  <span style={{ position: "absolute", top: 3, left: l.visible ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff" }} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>Tema · color</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <ColorRow label="ACENTO / BLUE" value={s.theme.blue} onChange={(v) => setTheme({ blue: v })} />
            <ColorRow label="ACENTO HERO" value={s.theme.heroAccent} onChange={(v) => setTheme({ heroAccent: v })} />
            <ColorRow label="PAPEL" value={s.theme.paper} onChange={(v) => setTheme({ paper: v })} />
            <ColorRow label="OBSIDIANA" value={s.theme.obsidian} onChange={(v) => setTheme({ obsidian: v })} />
            <ColorRow label="TINTA" value={s.theme.charcoal} onChange={(v) => setTheme({ charcoal: v })} />
            <ColorRow label="SLATE" value={s.theme.slate} onChange={(v) => setTheme({ slate: v })} />
          </div>
        </Card>

        <Card>
          <div style={cardTitle}>Tema · tipografía</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <SelectField label="TÍTULOS (SERIF)" value={s.theme.fontSerif} onChange={(v) => setTheme({ fontSerif: v })} options={[{ value: "Playfair Display", label: "Playfair Display" }, { value: "Cormorant Garamond", label: "Cormorant Garamond" }, { value: "Libre Baskerville", label: "Libre Baskerville" }]} />
            <SelectField label="TEXTO (SANS)" value={s.theme.fontSans} onChange={(v) => setTheme({ fontSans: v })} options={[{ value: "Inter", label: "Inter" }, { value: "Work Sans", label: "Work Sans" }]} />
            <SelectField label="MANUSCRITA" value={s.theme.fontHand} onChange={(v) => setTheme({ fontHand: v })} options={[{ value: "Over the Rainbow", label: "Over the Rainbow" }, { value: "Caveat", label: "Caveat" }]} />
            <div style={{ gridColumn: "1 / -1", maxWidth: 320 }}>
              <RangeField label="ESCALA DE TÍTULOS" value={s.theme.headingScale} onChange={(v) => setTheme({ headingScale: v })} min={0.8} max={1.25} step={0.05} suffix="×" />
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

const cardTitle = { fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", marginBottom: 18 } as const;
