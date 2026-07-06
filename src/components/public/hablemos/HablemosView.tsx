"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SITE_SETTINGS } from "@/lib/data/seed/site";

const schema = z.object({
  nombre: z.string().min(1, "Escribe tu nombre"),
  email: z.string().min(1, "Escribe tu email").email("Email inválido"),
  tipo: z.string().min(1),
  mensaje: z.string().min(1, "Cuéntame algo sobre tu proyecto"),
});
type FormValues = z.infer<typeof schema>;

const TIPOS = ["Colaboración", "Documental / Video", "Producto / Web", "Dirección creativa", "Otro"];

const labelStyle = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" } as const;
const inputStyle = { width: "100%", height: 52, border: "1px solid #cbc7bc", borderRadius: 2, padding: "0 16px", background: "transparent", color: "#1B1D20", fontFamily: "var(--font-sans)", fontSize: 14.5, outline: "none", marginTop: 8 } as const;
const errStyle = { margin: "6px 0 0", fontSize: 11, color: "#a23b3b" } as const;

export function HablemosView() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", email: "", tipo: TIPOS[0], mensaje: "" },
  });

  return (
    <main data-screen-label="Hablemos" style={{ position: "relative", padding: "64px 56px 60px" }}>
      <div style={{ maxWidth: 700 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>05 / HABLEMOS</div>
        <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 88, lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Hablemos</h1>
        <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: 32, color: "#2F5DAA" }}>cuéntame tu idea.</p>
        <p style={{ margin: "26px 0 0", fontSize: 15.5, lineHeight: 1.62, color: "#4a4c50", maxWidth: 500 }}>
          ¿Tienes un proyecto, una historia o una idea en tránsito? Escríbeme. Respondo personalmente.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 80, marginTop: 56, alignItems: "start" }}>
        {/* form / success */}
        <div>
          {sent ? (
            <div style={{ border: "1px solid #cbc7bc", background: "#EAE6DD", padding: "56px 48px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "#2F5DAA" }}>MENSAJE ENVIADO</div>
              <h2 style={{ margin: "16px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 40, color: "#1B1D20" }}>Gracias por escribir.</h2>
              <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4a4c50" }}>
                Te responderé pronto, personalmente. Mientras tanto, buen viaje.
              </p>
              <button
                onClick={() => {
                  reset();
                  setSent(false);
                }}
                style={{ marginTop: 26, background: "none", border: "none", borderBottom: "1px solid #1B1D20", fontFamily: "var(--font-sans)", fontSize: 14, color: "#1B1D20", paddingBottom: 4, cursor: "pointer" }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(() => setSent(true))} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
                <div>
                  <label style={labelStyle} htmlFor="nombre">NOMBRE</label>
                  <input id="nombre" style={inputStyle} placeholder="Escribe tu nombre" {...register("nombre")} />
                  {errors.nombre && <p style={errStyle}>{errors.nombre.message}</p>}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="email">EMAIL</label>
                  <input id="email" type="email" style={inputStyle} placeholder="tu@correo.com" {...register("email")} />
                  {errors.email && <p style={errStyle}>{errors.email.message}</p>}
                </div>
              </div>
              <div style={{ marginTop: 26 }}>
                <label style={labelStyle} htmlFor="tipo">TIPO DE PROYECTO</label>
                <select id="tipo" style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} {...register("tipo")}>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 26 }}>
                <label style={labelStyle} htmlFor="mensaje">MENSAJE</label>
                <textarea id="mensaje" style={{ ...inputStyle, height: 170, padding: "14px 16px", resize: "none" }} placeholder="Cuéntame sobre tu proyecto..." {...register("mensaje")} />
                {errors.mensaje && <p style={errStyle}>{errors.mensaje.message}</p>}
              </div>
              <button
                type="submit"
                style={{ marginTop: 26, background: "#0D0D0E", borderRadius: 3, height: 58, padding: "0 30px", color: "#F4F2EF", border: "none", display: "inline-flex", alignItems: "center", gap: 44, fontFamily: "var(--font-sans)", fontSize: 14.5, letterSpacing: ".02em", cursor: "pointer" }}
              >
                Enviar mensaje <span style={{ fontSize: 16 }}>&#8594;</span>
              </button>
            </form>
          )}
        </div>

        {/* info */}
        <div>
          {[
            ["ESCRÍBEME", SITE_SETTINGS.contactEmail],
            ["UBICACIÓN", "Buenos Aires"],
            ["DISPONIBILIDAD", "Proyectos globales · 2026"],
          ].map(([k, v], i) => (
            <div key={k} style={{ borderTop: "1px solid #d9d5cc", paddingTop: 18, marginTop: i === 0 ? 0 : 32 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "#9a988f" }}>{k}</div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20" }}>{v}</div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href="/hablemos" aria-label={s.label} style={{ width: 44, height: 44, border: "1px solid #cbc7bc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#55565a" }}>
                {s.icon}
              </a>
            ))}
          </div>
          <p style={{ marginTop: 34, fontFamily: "var(--font-hand)", fontSize: 24, lineHeight: 1.4, color: "#2F5DAA" }}>
            respondo
            <br />
            personalmente.
          </p>
        </div>
      </div>
    </main>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 10.9 21 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.2 9.3v5.4l4.6-2.7z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];
