"use client";
import { useState } from "react";
import Link from "next/link";
import { Monogram } from "@/components/layout/Monogram";
import { useViewport } from "@/hooks/useViewport";

const labelStyle = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" } as const;
const inputStyle = { width: "100%", height: 52, background: "#fff", border: "1px solid #d5d1c7", borderRadius: 3, padding: "0 16px", fontFamily: "var(--font-sans)", fontSize: 14.5, color: "#1B1D20", outline: "none", marginTop: 8 } as const;

export function LoginView() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [magic, setMagic] = useState(false);
  const vw = useViewport();
  const stacked = vw <= 860;

  const cta = magic ? "Enviar enlace mágico" : "Entrar al panel";
  const magicLabel = magic ? "Usar contraseña" : "Enviar enlace mágico (magic link)";

  const leftPane = (
    <div style={{ position: "relative", flex: stacked ? undefined : 1, width: stacked ? "100%" : undefined, height: stacked ? 220 : undefined, minHeight: stacked ? undefined : "100vh", overflow: "hidden", background: "#111" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/airport-hero.png" alt="Archivo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.4) contrast(1.05) brightness(.82)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,9,6,.55),rgba(10,9,6,.2) 40%,rgba(10,9,6,.8))" }} />
      <div style={{ position: "absolute", left: 44, top: 40 }}>
        <Monogram color="#F4F2EF" size={30} />
      </div>
      {!stacked && (
        <div style={{ position: "absolute", left: 44, bottom: 52, right: 44 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-hand)", fontSize: 30, color: "#7ea0d8" }}>ideas en tránsito.</p>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 44, lineHeight: 1.05, color: "#F4F2EF", maxWidth: 460 }}>El archivo, desde dentro.</h1>
          <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.6, color: "#cdcabf", maxWidth: 420 }}>
            Panel de administración de andyalbarracin.com. Gestiona el cuaderno, los proyectos, la home y todo el sistema.
          </p>
        </div>
      )}
      <span style={{ position: "absolute", right: 20, bottom: 16, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.4)" }}>TERMINAL · CDG · 06:14</span>
    </div>
  );

  const rightPane = (
    <div style={{ width: stacked ? "100%" : 520, minWidth: stacked ? 0 : 520, background: "#F4F2EF", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".24em", color: "#9a988f" }}>ACCESO · ADMIN</div>
        <h2 style={{ margin: "14px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 42, lineHeight: 1, color: "#1A1C1F" }}>
          Bienvenido
          <br />
          de vuelta.
        </h2>
        <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.6, color: "#6b6c66" }}>Inicia sesión para gestionar el sitio.</p>

        <div style={{ marginTop: 34 }}>
          <label style={labelStyle} htmlFor="login-email">EMAIL</label>
          <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@andyalbarracin.com" style={inputStyle} />
        </div>
        {!magic && (
          <div style={{ marginTop: 20 }}>
            <label style={labelStyle} htmlFor="login-pass">CONTRASEÑA</label>
            <input id="login-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>
        )}

        <Link href="/dashboard" style={{ marginTop: 24, height: 56, background: "#0D0D0E", borderRadius: 3, color: "#F4F2EF", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 14.5 }}>
          {cta} <span style={{ fontSize: 16 }}>&#8594;</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#dcd8ce" }} />
          <span style={{ fontSize: 11, color: "#a5a29a" }}>o</span>
          <div style={{ flex: 1, height: 1, background: "#dcd8ce" }} />
        </div>

        <button
          onClick={() => setMagic((m) => !m)}
          style={{ width: "100%", height: 52, background: "transparent", border: "1px solid #cbc7bc", borderRadius: 3, color: "#1B1D20", fontFamily: "var(--font-sans)", fontSize: 14, cursor: "pointer" }}
        >
          {magicLabel}
        </button>

        <p style={{ marginTop: 26, fontSize: 12, color: "#9a988f" }}>
          ¿Problemas para entrar? <Link href="/hablemos" style={{ color: "#2F5DAA" }}>Contacto</Link>
        </p>
        <Link href="/" style={{ display: "inline-block", marginTop: 20, fontSize: 13, color: "#6b6c66", borderBottom: "1px solid #c9c5bb" }}>
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: stacked ? "column" : "row", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      {leftPane}
      {rightPane}
    </div>
  );
}
