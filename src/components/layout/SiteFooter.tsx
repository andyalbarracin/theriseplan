"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Monogram } from "./Monogram";
import { SITE_SETTINGS } from "@/lib/data/seed/site";
import { NAV_SETTINGS } from "@/lib/data/seed/nav";

const NAV_HREF: Record<string, string> = {
  Cuaderno: "/cuaderno",
  Proyectos: "/proyectos",
  Ahora: "/ahora",
  "Sobre mí": "/sobre-mi",
  Hablemos: "/hablemos",
};

const ICONS: Record<string, ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 10.9 21 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.3v5.4l4.6-2.7z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Behance: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 15.4c2.6 0 3.6-.5 3.6-1.9 0-1-.7-1.5-1.9-1.5H8zm0-4.6h1.5c1 0 1.6-.4 1.6-1.3S10.6 8.3 9.6 8.3H8zM14.5 13.4c.15 1.1 1 1.7 2.1 1.6.7-.05 1.2-.35 1.45-.9M13.9 12.4c.1-1.7 1.05-2.7 2.6-2.7 1.5 0 2.35 1 2.35 2.7z" />
    </svg>
  ),
};

const col = { fontSize: 11, letterSpacing: ".18em", color: "#77756e", marginBottom: 20 } as const;

export function SiteFooter() {
  const [sent, setSent] = useState(false);
  const socials = NAV_SETTINGS.socialOrder
    .map((p) => SITE_SETTINGS.socialLinks.find((s) => s.platform === p))
    .filter((s): s is NonNullable<typeof s> => !!s && s.visible);

  return (
    <footer
      style={{
        background: "#0D0D0E",
        color: "#b7b5ad",
        padding: "clamp(48px,8vw,76px) clamp(22px,5vw,56px) 30px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "clamp(28px,4vw,48px)", flexWrap: "wrap" }}>
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 31, color: "#F4F2EF", letterSpacing: "-.01em" }}>
            {SITE_SETTINGS.wordmark}
          </div>
          <p style={{ margin: "20px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "#8f8d85", maxWidth: 250 }}>
            {SITE_SETTINGS.footerTagline}
          </p>
          <p style={{ margin: "22px 0 0", fontFamily: "var(--font-hand)", fontSize: 22, lineHeight: 1.35, color: "#4f7ac2" }}>
            gracias por estar aquí.
            <br />
            <span style={{ marginLeft: 34 }}>— andy x</span>
          </p>
        </div>

        <div style={{ width: 320, maxWidth: "100%" }}>
          <div style={{ fontSize: 11, letterSpacing: ".18em", color: "#8f8d85" }}>RECIBE NOTAS DESDE EL CAMINO</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            style={{ position: "relative", marginTop: 20 }}
          >
            <input
              type="email"
              required
              placeholder={sent ? "¡Gracias! Nos vemos en el camino." : "Tu email"}
              disabled={sent}
              aria-label="Email para el boletín"
              style={{
                width: "100%",
                height: 56,
                borderRadius: 40,
                border: "1px solid rgba(244,242,239,.16)",
                background: "transparent",
                color: "#F4F2EF",
                padding: "0 62px 0 26px",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="submit"
              aria-label="Suscribir"
              style={{
                position: "absolute",
                right: 7,
                top: 7,
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "none",
                background: "#F4F2EF",
                color: "#0D0D0E",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sent ? "✓" : "→"}
            </button>
          </form>
          <p style={{ margin: "16px 0 0", fontSize: 12.5, color: "#77756e" }}>No spam. Solo ideas, viajes y proyectos.</p>
        </div>

        <div>
          <div style={col}>NAVEGA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14, color: "#b7b5ad" }}>
            {NAV_SETTINGS.footerNav.map((label) => (
              <Link key={label} href={NAV_HREF[label] ?? "/"} style={{ width: "fit-content", color: "#b7b5ad" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={col}>CONTACTO</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "#b7b5ad", maxWidth: 190 }}>
            <span>{SITE_SETTINGS.contactEmail}</span>
            <span>Buenos Aires</span>
            <span style={{ lineHeight: 1.5 }}>Disponible para proyectos globales.</span>
          </div>
        </div>

        <div>
          <div style={col}>CONECTA</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,42px)", gap: 16, color: "#b7b5ad" }}>
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url && s.url !== "#" ? s.url : "/hablemos"}
                aria-label={s.platform}
                target={s.url && s.url !== "#" ? "_blank" : undefined}
                rel={s.url && s.url !== "#" ? "noopener noreferrer" : undefined}
                style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", color: "#b7b5ad" }}
              >
                {ICONS[s.platform] ?? s.platform.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 60,
          paddingTop: 22,
          borderTop: "1px solid rgba(244,242,239,.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12.5,
          color: "#6f6d66",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span>{SITE_SETTINGS.copyrightText}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <span>Diseñado y creado con intención.</span>
          <Monogram color="#c9c7c0" size={22} />
        </div>
      </div>
    </footer>
  );
}
