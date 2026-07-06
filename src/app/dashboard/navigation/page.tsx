"use client";
import { useEffect, useState } from "react";
import type { NavSettings } from "@/lib/types";
import { getNavSettings, updateNavSettings } from "@/lib/cms";
import { AdminTopbar, Card, AdminButton } from "@/components/admin/ui";
import { ChipsField, ToggleField } from "@/components/admin/fields";

export default function DashboardNavigation() {
  const [nav, setNav] = useState<NavSettings | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => setNav(getNavSettings()), []);
  if (!nav) return null;

  const save = () => {
    updateNavSettings(nav);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const rowInput = { flex: 1, height: 42, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 12px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" } as const;

  return (
    <>
      <AdminTopbar title="Navegación" eyebrow="MENÚ PRINCIPAL · FOOTER · SOCIAL" actions={<AdminButton onClick={save}>{saved ? "✓ Guardado" : "Guardar"}</AdminButton>} />
      <main style={{ padding: "28px clamp(20px,4vw,40px) 56px", display: "grid", gap: 26, maxWidth: 900 }}>
        <Card>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", marginBottom: 6 }}>Menú principal</div>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "#8a887f" }}>Etiquetas, enlaces y visibilidad de la navegación superior.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {nav.main.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input value={item.label} onChange={(e) => setNav({ ...nav, main: nav.main.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)) })} style={rowInput} placeholder="Etiqueta" />
                <input value={item.url} onChange={(e) => setNav({ ...nav, main: nav.main.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} style={{ ...rowInput, fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="/ruta" />
                <button
                  onClick={() => setNav({ ...nav, main: nav.main.map((x, idx) => (idx === i ? { ...x, visible: !x.visible } : x)) })}
                  role="switch"
                  aria-checked={item.visible}
                  aria-label={`Visibilidad ${item.label}`}
                  style={{ width: 46, height: 26, borderRadius: 20, border: "none", cursor: "pointer", flex: "none", background: item.visible ? "#2F5DAA" : "#cbc7bc", position: "relative" }}
                >
                  <span style={{ position: "absolute", top: 3, left: item.visible ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20", marginBottom: 16 }}>Footer</div>
          <ChipsField label="ENLACES DEL FOOTER" values={nav.footerNav} onChange={(v) => setNav({ ...nav, footerNav: v })} />
        </Card>

        <Card>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#1B1D20", marginBottom: 16 }}>Redes sociales</div>
          <ChipsField label="ORDEN DE REDES" values={nav.socialOrder} onChange={(v) => setNav({ ...nav, socialOrder: v })} hint="Instagram, LinkedIn, YouTube, Behance" />
        </Card>
      </main>
    </>
  );
}
