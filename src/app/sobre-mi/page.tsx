/* =============================================================================
   Archivo:     page.tsx (Sobre mí — pública)
   Ruta:        web/src/app/sobre-mi/page.tsx
   Modificado:  2026-07-11
   Descripcion: Página "Sobre mí". Todo su contenido (intro, retrato, valores en
                acordeón, frase y widgets de posts/proyectos destacados) se
                configura desde el dashboard → Sobre mí (site_settings.data.about).
   ============================================================================= */
import type { Metadata } from "next";
import Link from "next/link";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { HeroPortrait } from "@/components/public/HeroPortrait";
import { AboutAccordion } from "@/components/public/sobre-mi/AboutAccordion";
import { getSiteSettingsSSR, getPostsSSR, getProjectsSSR } from "@/lib/cms/ssr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Perfil creativo de Andy Albarracín — director creativo que construye ideas, viaja y crea sistemas con intención.",
};

export default async function SobreMiPage() {
  const site = await getSiteSettingsSSR();
  const about = site.about!; // getSiteSettingsSSR siempre trae el seed como fallback

  // Widgets: resolver los posts/proyectos destacados elegidos en el dashboard.
  const posts = about.featuredPostIds?.length ? (await getPostsSSR()).filter((p) => about.featuredPostIds.includes(p.id)) : [];
  const projects = about.featuredProjectIds?.length ? (await getProjectsSSR()).filter((p) => about.featuredProjectIds.includes(p.id)) : [];

  const quoteLines = (about.quote?.text ?? "").split("\n");

  return (
    <InteriorShell>
      <main data-screen-label="Sobre mí" style={{ position: "relative", padding: "clamp(36px,5vw,64px) clamp(18px,5vw,56px) 40px" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>{about.eyebrow}</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(46px,9vw,88px)", lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>{about.title}</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: "clamp(24px,4vw,32px)", color: "#2F5DAA" }}>{about.tagline}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,440px) 1fr", gap: "clamp(28px,4vw,64px)", marginTop: 52, alignItems: "start" }}>
          <div style={{ position: "relative", width: "100%", height: 560, overflow: "hidden", background: "linear-gradient(168deg,#9ba0a2,#5f6461 34%,#33352f 66%,#151610)", boxShadow: "0 30px 58px -28px rgba(20,18,14,.5)" }}>
            <HeroPortrait image={about.portraitImage} alt={`Retrato · ${about.title}`} blend="normal" opacity={1} mask="none" position="center top" grayscale={0.18} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(8,8,6,.45))" }} />
            {about.portraitCaption && <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.34)" }}>{about.portraitCaption}</span>}
          </div>

          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "clamp(22px,3.4vw,27px)", lineHeight: 1.42, color: "#1B1D20" }}>{about.lead}</p>
            {about.body && <p style={{ margin: "24px 0 0", fontSize: 15.5, lineHeight: 1.66, color: "#4a4c50", maxWidth: 560 }}>{about.body}</p>}
            {about.originNote && <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.66, color: "#4a4c50", maxWidth: 560 }}>{about.originNote}</p>}
            {/* Valores en acordeón (una columna) */}
            <AboutAccordion values={about.values ?? []} />
          </div>
        </div>

        {/* Widgets: posts destacados */}
        {posts.length > 0 && <FeaturedRow label="ESCRITOS DESTACADOS" items={posts.map((p) => ({ href: `/cuaderno/${p.slug}`, img: p.heroImage, eyebrow: p.category, title: p.title }))} />}

        {/* Widgets: proyectos destacados */}
        {projects.length > 0 && <FeaturedRow label="PROYECTOS DESTACADOS" items={projects.map((pr) => ({ href: `/proyectos/${pr.slug}`, img: pr.heroImage, eyebrow: pr.type, title: pr.title }))} />}

        {/* Frase propia */}
        <div style={{ marginTop: 64, padding: "56px 0", borderTop: "1px solid #d9d5cc", textAlign: "center" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-hand)", fontSize: "clamp(28px,5vw,40px)", lineHeight: 1.4, color: "#2F5DAA" }}>
              {quoteLines.map((ln, i) => (
                <span key={i}>
                  {ln}
                  {i < quoteLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            {about.quote?.cite && (
              <>
                <div style={{ width: 120, height: 1.5, background: "#2F5DAA", margin: "18px auto 0" }} />
                <div style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".2em", color: "#9a988f" }}>— {about.quote.cite}</div>
              </>
            )}
          </div>
        </div>
      </main>
    </InteriorShell>
  );
}

/** Fila de tarjetas destacadas (posts o proyectos), estilo home. */
function FeaturedRow({ label, items }: { label: string; items: { href: string; img: string; eyebrow: string; title: string }[] }) {
  return (
    <div style={{ marginTop: 56 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#9a988f", borderTop: "1px solid #d9d5cc", paddingTop: 26 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 22, marginTop: 20 }}>
        {items.map((it, i) => (
          <Link key={i} href={it.href} className="hcard" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "#15130e", borderRadius: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#a5a29a" }}>{(it.eyebrow || "").toUpperCase()}</div>
            <h3 style={{ margin: "6px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 19, lineHeight: 1.18, color: "#1B1D20" }}>{it.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
