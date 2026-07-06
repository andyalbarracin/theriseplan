"use client";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { getSEOOverview, getSiteSettings, getSitemapRoutes, updateSiteSettings } from "@/lib/cms";
import { AdminTopbar, Card, AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField } from "@/components/admin/fields";

export default function DashboardSeo() {
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [rows, setRows] = useState<ReturnType<typeof getSEOOverview>>([]);
  const [routes, setRoutes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSite(getSiteSettings());
    setRows(getSEOOverview());
    setRoutes(getSitemapRoutes());
  }, []);

  if (!site) return null;
  const warnings = rows.filter((r) => !r.ok).length;

  const save = () => {
    updateSiteSettings({ seo: site.seo, defaultOgImage: site.defaultOgImage });
    setRows(getSEOOverview());
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <>
      <AdminTopbar
        title="SEO"
        eyebrow={`${rows.length} PÁGINAS · ${warnings} ALERTAS`}
        actions={<AdminButton onClick={save}>{saved ? "✓ Guardado" : "Guardar"}</AdminButton>}
      />
      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px", display: "grid", gap: 26, maxWidth: 1000 }}>
        <Card>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", marginBottom: 18 }}>SEO global</div>
          <div style={{ display: "grid", gap: 20 }}>
            <TextField label="TÍTULO POR DEFECTO" value={site.seo.title} onChange={(v) => setSite({ ...site, seo: { ...site.seo, title: v } })} />
            <TextAreaField label="DESCRIPCIÓN POR DEFECTO" value={site.seo.description} onChange={(v) => setSite({ ...site, seo: { ...site.seo, description: v } })} rows={3} />
            <TextField label="OG IMAGE / TWITTER CARD" value={site.defaultOgImage} onChange={(v) => setSite({ ...site, defaultOgImage: v, seo: { ...site.seo, ogImage: v, twitterImage: v } })} mono />
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ position: "relative", width: 200, height: 120, background: "#15130e", borderRadius: 4, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={site.defaultOgImage} alt="OG" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#9a988f", lineHeight: 1.6 }}>
                Canonical base<br />
                <span style={{ color: "#1B1D20" }}>https://{site.domain}</span><br />
                robots: index, follow
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #eee9df", fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20" }}>Estado por página</div>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 90px 90px", gap: 12, padding: "12px 24px", borderBottom: "1px solid #eee9df", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "#9a988f" }}>
            <span>ÁMBITO</span>
            <span>NOMBRE</span>
            <span>TÍTULO</span>
            <span>DESC.</span>
            <span>OG</span>
          </div>
          {rows.map((r, i) => {
            const cell = (present: boolean) => (
              <span style={{ fontSize: 12, color: present ? "#1f8a5b" : "#b07a1e" }}>{present ? "✓" : "· falta"}</span>
            );
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 90px 90px", gap: 12, padding: "12px 24px", borderBottom: "1px solid #f1ede4", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", color: "#a5a29a" }}>{r.scope.toUpperCase()}</span>
                <span style={{ fontSize: 13.5, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                {cell(!r.missing.includes("title"))}
                {cell(!r.missing.includes("description"))}
                {cell(!r.missing.includes("ogImage"))}
              </div>
            );
          })}
        </Card>

        <Card>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20", marginBottom: 12 }}>Vista previa del sitemap</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "#55565a" }}>
            {routes.map((r) => (
              <span key={r}>https://{site.domain}/{r}</span>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
