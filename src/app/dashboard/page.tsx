"use client";
import Link from "next/link";
import { getDashboardData } from "@/lib/cms/client";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminTopbar, Card, AdminButton, Badge, postBadge, projectBadge } from "@/components/admin/ui";
import { formatDateES } from "@/lib/utils/format";

export default function DashboardHome() {
  const { data } = useAsyncData(() => getDashboardData());

  const st = data?.stats;
  const v = (x?: number) => (x == null ? "—" : String(x));

  const cards = [
    { label: "CUADERNO · PUBLICADOS", value: v(st?.postsPublished), hint: "entradas visibles", href: "/dashboard/cuaderno", bar: "#2F5DAA" },
    { label: "BORRADORES", value: v(st?.postsDrafts), hint: "sin publicar", href: "/dashboard/cuaderno", bar: "#b07a1e" },
    { label: "DESTACADOS", value: v(st?.postsFeatured), hint: "en portada", href: "/dashboard/cuaderno", bar: "#1f8a5b" },
    { label: "PROYECTOS · PÚBLICOS", value: v(st?.projectsPublished), hint: "visibles", href: "/dashboard/proyectos", bar: "#2F5DAA" },
    { label: "PRIVADOS · OCULTOS", value: v(st?.projectsHidden), hint: "no visibles", href: "/dashboard/proyectos", bar: "#a23b3b" },
    { label: "MEDIA", value: v(st?.media), hint: "archivos", href: "/dashboard/media", bar: "#6E7C8B" },
    { label: "MÓDULOS DE HOME", value: v(st?.homeModules), hint: "editables", href: "/dashboard/home", bar: "#2F5DAA" },
    { label: "ALERTAS SEO", value: v(st?.seoWarnings), hint: "campos faltantes", href: "/dashboard/seo", bar: (st?.seoWarnings ?? 0) > 0 ? "#b07a1e" : "#1f8a5b" },
  ];

  const actions = [
    { label: "＋ Nuevo artículo", href: "/dashboard/cuaderno/new", variant: "primary" as const },
    { label: "＋ Nuevo proyecto", href: "/dashboard/proyectos/new", variant: "ghost" as const },
    { label: "⬆ Subir media", href: "/dashboard/media", variant: "ghost" as const },
    { label: "Editar Home", href: "/dashboard/home", variant: "ghost" as const },
    { label: "Editar SEO", href: "/dashboard/seo", variant: "ghost" as const },
    { label: "Ajustes", href: "/dashboard/ajustes", variant: "ghost" as const },
  ];

  return (
    <>
      <AdminTopbar
        title="Panel"
        eyebrow="RESUMEN DEL SISTEMA · ANDYALBARRACIN.COM"
        actions={
          <>
            <AdminButton variant="ghost" href="/">↗ Ver sitio</AdminButton>
            <AdminButton href="/dashboard/cuaderno/new">＋ Nuevo artículo</AdminButton>
          </>
        }
      />

      <main style={{ padding: "34px clamp(20px,4vw,40px) 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {cards.map((c) => (
            <Link key={c.label} href={c.href} style={{ position: "relative", display: "block", background: "#fff", border: "1px solid #e5e1d7", borderRadius: 9, padding: "22px 22px 20px" }}>
              <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 3, borderRadius: 3, background: c.bar }} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "#9a988f" }}>{c.label}</div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-serif)", fontSize: 44, lineHeight: 1, color: "#1A1C1F" }}>{c.value}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#8a887f" }}>{c.hint}</div>
            </Link>
          ))}
        </div>

        <Card style={{ marginTop: 30 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>ACCIONES RÁPIDAS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
            {actions.map((a) => (
              <AdminButton key={a.label} variant={a.variant} href={a.href}>{a.label}</AdminButton>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 30 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20" }}>Últimas entradas</div>
              <Link href="/dashboard/cuaderno" style={{ fontSize: 12.5, color: "#2F5DAA" }}>Ver todo →</Link>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
              {(data?.posts ?? []).slice(0, 5).map((p) => {
                const b = postBadge(p.status);
                return (
                  <Link key={p.id} href={`/dashboard/cuaderno/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: "1px solid #eee9df" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.heroImage} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 3, flex: "none", background: "#15130e" }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14.5, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                      <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "#a5a29a" }}>{`${p.category} · ${p.publishedAt || "sin fecha"}`.toUpperCase()}</div>
                    </div>
                    <Badge {...b} />
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20" }}>Proyectos</div>
              <Link href="/dashboard/proyectos" style={{ fontSize: 12.5, color: "#2F5DAA" }}>Ver todo →</Link>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
              {(data?.projects ?? []).slice(0, 6).map((pr) => {
                const b = projectBadge(pr);
                return (
                  <Link key={pr.id} href={`/dashboard/proyectos/${pr.id}`} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: "1px solid #eee9df" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pr.heroImage} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 3, flex: "none", background: "#15130e" }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14.5, color: "#1B1D20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pr.title}</div>
                      <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "#a5a29a" }}>{(pr.type || "").toUpperCase()}</div>
                    </div>
                    <Badge {...b} />
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
