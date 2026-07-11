"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Monogram } from "@/components/layout/Monogram";
import { createBrowserSupabase } from "@/lib/supabase/client";

const ITEMS: [string, string][] = [
  ["Dashboard", "/dashboard"],
  ["Cuaderno", "/dashboard/cuaderno"],
  ["Proyectos", "/dashboard/proyectos"],
  ["Media", "/dashboard/media"],
  ["Inicio · Home", "/dashboard/home"],
  ["Sobre mí", "/dashboard/sobre-mi"],
  ["SEO", "/dashboard/seo"],
  ["Navegación", "/dashboard/navigation"],
  ["Ajustes", "/dashboard/ajustes"],
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (url: string) => (url === "/dashboard" ? pathname === url : pathname.startsWith(url));

  // Cierra la sesion de Supabase y vuelve al login (en demo/mock solo redirige).
  const logout = async () => {
    const supabase = createBrowserSupabase();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      style={{
        width: 248,
        minWidth: 248,
        minHeight: "100vh",
        background: "#0D0D0E",
        color: "#b7b5ad",
        display: "flex",
        flexDirection: "column",
        padding: "26px 18px",
        fontFamily: "var(--font-sans)",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
      }}
    >
      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px 4px" }}>
        <Monogram color="#F4F2EF" size={26} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "#6f6d66", lineHeight: 1.3 }}>
          ARCHIVO
          <br />
          ADMIN · CMS
        </span>
      </Link>

      <nav style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 3 }}>
        {ITEMS.map(([label, url]) => {
          const active = isActive(url);
          return (
            <Link
              key={url}
              href={url}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 7,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: ".01em",
                color: active ? "#F4F2EF" : "#918f87",
                background: active ? "rgba(47,93,170,0.18)" : "transparent",
                borderLeft: active ? "2px solid #2F5DAA" : "2px solid transparent",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", flex: "none", background: active ? "#2F5DAA" : "rgba(145,143,135,0.4)" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid rgba(244,242,239,.09)", paddingTop: 16 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, color: "#8f8d85" }}>↗ Ver sitio</Link>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, color: "#8f8d85", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left" }}>← Cerrar sesión</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 4px" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2F5DAA", color: "#F4F2EF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 14 }}>A</div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 12.5, color: "#d9d7d0" }}>Andy Albarracín</div>
            <div style={{ fontSize: 10, color: "#6f6d66" }}>Editor</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
