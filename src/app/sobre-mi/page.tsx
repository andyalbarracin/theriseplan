import type { Metadata } from "next";
import Link from "next/link";
import { InteriorShell } from "@/components/layout/InteriorShell";
import { HeroPortrait } from "@/components/public/HeroPortrait";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Perfil creativo de Andy Albarracín — director creativo que construye ideas, viaja y crea sistemas con intención.",
};

const VALUES = [
  ["01", "Claridad sobre el ruido."],
  ["02", "Movimiento sobre destino."],
  ["03", "Detalles sobre decoración."],
  ["04", "Humano, no llamativo."],
];

export default function SobreMiPage() {
  return (
    <InteriorShell>
      <main data-screen-label="Sobre mí" style={{ position: "relative", padding: "64px 56px 40px" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", color: "#9a988f" }}>04 / SOBRE MÍ</div>
          <h1 style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 88, lineHeight: 0.98, letterSpacing: "-.02em", color: "#1A1C1F" }}>Sobre mí</h1>
          <p style={{ margin: "10px 0 0", fontFamily: "var(--font-hand)", fontSize: 32, color: "#2F5DAA" }}>creo, viajo, construyo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: 64, marginTop: 52, alignItems: "start" }}>
          <div style={{ position: "relative", width: "100%", height: 560, overflow: "hidden", background: "linear-gradient(168deg,#9ba0a2,#5f6461 34%,#33352f 66%,#151610)", boxShadow: "0 30px 58px -28px rgba(20,18,14,.5)" }}>
            <HeroPortrait image="/images/portrait-andy.png" alt="Retrato de Andy Albarracín" blend="normal" opacity={1} mask="none" position="center top" grayscale={0.18} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(8,8,6,.45))" }} />
            <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", color: "rgba(244,242,239,.34)" }}>RETRATO · BUE</span>
          </div>

          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 27, lineHeight: 1.42, color: "#1B1D20" }}>
              Soy Andy Albarracín, director creativo. Construyo ideas, viajo y creo sistemas con intención.
            </p>
            <p style={{ margin: "24px 0 0", fontSize: 15.5, lineHeight: 1.66, color: "#4a4c50", maxWidth: 560 }}>
              Mi trabajo vive entre la dirección creativa, el documental y el diseño de sistemas — siempre en movimiento.
              Documento lo importante y diseño lo que importa. Creo que las mejores ideas nacen en tránsito, entre un
              lugar y otro.
            </p>
            {/* Nota de origen: conecta el archivo del Cuaderno con su punto de partida.
                El texto completo de aquella bio de 2010 esta en .docs/WORDPRESS_PAGES.md
                y puede reescribirse desde el dashboard. */}
            <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.66, color: "#4a4c50", maxWidth: 560 }}>
              Esto empezó en 2010 como un blog — <em>The Rise Plan</em>. Aquellas notas siguen vivas en el{" "}
              <Link href="/cuaderno" style={{ color: "#2F5DAA", borderBottom: "1px solid #cbc7bc" }}>Cuaderno</Link>,
              hoy parte de este archivo en tránsito.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 40px", marginTop: 40, borderTop: "1px solid #d9d5cc", paddingTop: 8 }}>
              {VALUES.map(([n, v]) => (
                <div key={n} style={{ padding: "22px 0", borderBottom: "1px solid #e3e0d7" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f" }}>{n}</div>
                  <div style={{ marginTop: 8, fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64, padding: "56px 0", borderTop: "1px solid #d9d5cc", textAlign: "center" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-hand)", fontSize: 40, lineHeight: 1.4, color: "#2F5DAA" }}>
              No se trata de llegar primero,
              <br />
              sino de ver más en el camino.
            </p>
            <div style={{ width: 120, height: 1.5, background: "#2F5DAA", margin: "18px auto 0" }} />
            <div style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".2em", color: "#9a988f" }}>— ANDY ALBARRACÍN</div>
          </div>
        </div>
      </main>
    </InteriorShell>
  );
}
