"use client";
import { useEffect, useState } from "react";
import type { HomeSettings, HeroDestination, Theme } from "@/lib/types";
import { getHomeSettingsClient, getSiteSettingsClient, updateHomeSettingsClient, updateSiteSettingsClient, listMedia } from "@/lib/cms/client";
import { AdminTopbar, Card, AdminButton } from "@/components/admin/ui";
import { TextField, TextAreaField, SelectField, RangeField, ChipsField, Field } from "@/components/admin/fields";
import { ImageField, ImageListField } from "@/components/admin/ImageField";

const cardTitle = { fontFamily: "var(--font-serif)", fontSize: 22, color: "#1B1D20", marginBottom: 4 } as const;
const cardHint = { margin: "0 0 18px", fontSize: 13, color: "#8a887f" } as const;
const smallInput = { width: "100%", height: 42, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 12px", fontFamily: "var(--font-sans)", fontSize: 14, background: "#fff", outline: "none" } as const;
const chipPill = (active: boolean) => ({ fontSize: 12.5, padding: "9px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "var(--font-sans)", color: active ? "#F4F2EF" : "#55565a", background: active ? "#1B1D20" : "transparent", border: active ? "1px solid #1B1D20" : "1px solid #cbc7bc" });

const TOP_FADES = [["Suave", "rgba(11,13,16,0.55)"], ["Media", "rgba(11,13,16,0.82)"], ["Fuerte", "rgba(6,8,10,0.95)"]];
const BOTTOM_FADES = [["Papel", "#F4F2EF"], ["Hueso", "#EDEAE3"], ["Blanco", "#FFFFFF"], ["Negro", "#0D0D0E"]];
const ACCENTS = ["#2F5DAA", "#1F6F5C", "#9A3B3B", "#6E4AA6", "#B4622A"];
const HERO_ACCENTS = ["#9db8ec", "#E7C9A0", "#A9C2F0", "#C9B08C", "#8FB6A6"];

export default function DashboardHomeEditor() {
  const [home, setHome] = useState<HomeSettings | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mediaOpts, setMediaOpts] = useState<{ value: string; label: string }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHomeSettingsClient().then(setHome);
    getSiteSettingsClient().then((site) => setTheme(site.theme));
    listMedia().then((list) => setMediaOpts(list.map((m) => ({ value: m.url, label: m.filename }))));
  }, []);

  if (!home || !theme) return null;
  const patch = (p: Partial<HomeSettings>) => setHome({ ...home, ...p });
  const setTh = (p: Partial<Theme>) => setTheme({ ...theme, ...p });
  const setDest = (i: number, p: Partial<HeroDestination>) => patch({ heroDestinations: home.heroDestinations.map((d, idx) => (idx === i ? { ...d, ...p } : d)) });
  const moveDest = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= home.heroDestinations.length) return;
    const copy = [...home.heroDestinations];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    patch({ heroDestinations: copy });
  };

  const save = async () => {
    await updateHomeSettingsClient(home);
    await updateSiteSettingsClient({ theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const destCount = String(home.heroDestinations.length).padStart(2, "0");

  return (
    <>
      <AdminTopbar
        title="Inicio · Home"
        eyebrow={`HERO · ${destCount} DESTINOS EN EL SLIDER`}
        actions={
          <>
            <AdminButton variant="ghost" href="/">↗ Ver sitio</AdminButton>
            <AdminButton onClick={save}>{saved ? "✓ Guardado" : "Guardar cambios"}</AdminButton>
          </>
        }
      />
      <main style={{ padding: "28px clamp(20px,4vw,40px) 72px", display: "grid", gap: 24, maxWidth: 900 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(47,93,170,.06)", border: "1px solid rgba(47,93,170,.18)", borderRadius: 8, padding: "16px 20px" }}>
          <span style={{ fontSize: 18 }}>✈</span>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#33352f" }}>
            El fondo del hero es un <strong>slider vertical</strong>. Cada destino define su imagen de fondo, la tarjeta de embarque (BUE → destino) y las coordenadas. El origen es siempre <strong>Buenos Aires (BUE)</strong>.
          </p>
        </div>

        {/* HERO COPY */}
        <Card>
          <div style={cardTitle}>Titular del hero</div>
          <p style={cardHint}>Titular, acento manuscrito, subtítulo y CTA.</p>
          <div style={{ display: "grid", gap: 18 }}>
            <TextAreaField label="TITULAR (una línea por salto)" value={home.heroHeadline} onChange={(v) => patch({ heroHeadline: v })} rows={2} serif />
            <TextField label="ACENTO MANUSCRITO" value={home.heroAccent} onChange={(v) => patch({ heroAccent: v })} />
            <TextAreaField label="SUBTÍTULO" value={home.heroSubtitle} onChange={(v) => patch({ heroSubtitle: v })} rows={2} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <TextField label="CTA · ETIQUETA" value={home.ctas[0]?.label ?? ""} onChange={(v) => patch({ ctas: [{ ...(home.ctas[0] ?? { url: "/cuaderno", style: "link" }), label: v }] })} />
              <TextField label="CTA · ENLACE" value={home.ctas[0]?.url ?? ""} onChange={(v) => patch({ ctas: [{ ...(home.ctas[0] ?? { label: "Explorar archivo", style: "link" }), url: v }] })} mono />
            </div>
          </div>
        </Card>

        {/* HERO TEXTS (nota manuscrita, cita, sello) */}
        <Card>
          <div style={cardTitle}>Textos y sello del hero</div>
          <p style={cardHint}>Textos manuscritos y el sello decorativo de la portada.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <TextAreaField label="NOTA MANUSCRITA (HERO)" value={home.heroNote ?? ""} onChange={(v) => patch({ heroNote: v })} rows={4} />
            <div style={{ maxWidth: 220 }}>
              <ImageField label="SELLO (IMAGEN OPCIONAL)" value={home.sealImage ?? ""} onChange={(v) => patch({ sealImage: v })} aspect="1/1" clearable hint="Vacío = sello por defecto (AA)." />
            </div>
            <TextAreaField label="CITA / FRASE" value={home.quote.text} onChange={(v) => patch({ quote: { ...home.quote, text: v } })} rows={3} />
            <TextField label="AUTOR DE LA CITA" value={home.quote.cite} onChange={(v) => patch({ quote: { ...home.quote, cite: v } })} />
          </div>
        </Card>

        {/* PORTRAIT */}
        <Card>
          <div style={cardTitle}>Retrato (HeroPortrait)</div>
          <p style={cardHint}>Tratamiento artístico configurable del retrato.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ gridColumn: "1 / -1", maxWidth: 260 }}>
              <ImageField label="IMAGEN DEL RETRATO" value={home.heroPortraitImage} onChange={(v) => patch({ heroPortraitImage: v })} aspect="3/4" />
            </div>
            <SelectField label="BLEND MODE" value={home.heroPortraitTreatment.blendMode} onChange={(v) => patch({ heroPortraitTreatment: { ...home.heroPortraitTreatment, blendMode: v } })} options={["normal", "luminosity", "screen", "multiply", "soft-light", "overlay"].map((o) => ({ value: o, label: o }))} />
            <SelectField label="MÁSCARA" value={home.heroPortraitTreatment.mask} onChange={(v) => patch({ heroPortraitTreatment: { ...home.heroPortraitTreatment, mask: v } })} options={["none", "left", "right", "bottom", "radial"].map((o) => ({ value: o, label: o }))} />
            <TextField label="POSICIÓN" value={home.heroPortraitTreatment.position} onChange={(v) => patch({ heroPortraitTreatment: { ...home.heroPortraitTreatment, position: v } })} />
            <div style={{ gridColumn: "1 / -1", maxWidth: 340 }}>
              <RangeField label="OPACIDAD" value={home.heroPortraitTreatment.opacity} onChange={(v) => patch({ heroPortraitTreatment: { ...home.heroPortraitTreatment, opacity: v } })} min={0} max={1} step={0.05} />
            </div>
          </div>
        </Card>

        {/* BOARDING PASS */}
        <Card>
          <div style={cardTitle}>Tarjeta de embarque</div>
          <p style={cardHint}>Los campos base del ticket del hero.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {(["code", "flight", "date", "boarding", "from", "to", "gate", "seat", "zone"] as const).map((k) => (
              <Field key={k} label={k.toUpperCase()}>
                <input value={home.boardingPass[k]} onChange={(e) => patch({ boardingPass: { ...home.boardingPass, [k]: e.target.value } })} style={smallInput} />
              </Field>
            ))}
          </div>
        </Card>

        {/* ORIGIN */}
        <Card>
          <div style={cardTitle}>Origen (fijo)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            <Field label="CÓDIGO"><input value={home.heroOrigin.code} onChange={(e) => patch({ heroOrigin: { ...home.heroOrigin, code: e.target.value.toUpperCase() } })} style={smallInput} /></Field>
            <Field label="CIUDAD"><input value={home.heroOrigin.city} onChange={(e) => patch({ heroOrigin: { ...home.heroOrigin, city: e.target.value } })} style={smallInput} /></Field>
            <Field label="AEROPUERTO"><input value={home.heroOrigin.airport} onChange={(e) => patch({ heroOrigin: { ...home.heroOrigin, airport: e.target.value.toUpperCase() } })} style={smallInput} /></Field>
          </div>
        </Card>

        {/* DESTINATIONS */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={cardTitle}>Destinos del slider</div>
            <AdminButton variant="ghost" onClick={() => patch({ heroDestinations: [...home.heroDestinations, { code: "NEW", city: "Nuevo destino", flight: "AR 000", date: "ENE 01", gate: "A1", seat: "1A", boarding: "12:00", zone: "1", image: mediaOpts[0]?.value ?? "/images/airport-hero.png", coords: "0.0000° N   0.0000° W" }] })}>＋ Agregar destino</AdminButton>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {home.heroDestinations.map((d, i) => (
              <div key={i} style={{ border: "1px solid #e5e1d7", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#faf8f3", padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#2F5DAA" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "#1B1D20" }}>BUE → {d.code}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => moveDest(i, -1)} aria-label="Subir" style={ctrl}>↑</button>
                    <button onClick={() => moveDest(i, 1)} aria-label="Bajar" style={ctrl}>↓</button>
                    <button onClick={() => patch({ heroDestinations: home.heroDestinations.filter((_, idx) => idx !== i) })} aria-label="Quitar" style={{ ...ctrl, color: "#a23b3b" }}>×</button>
                  </div>
                </div>
                <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
                  <ImageField label="IMAGEN DE FONDO" value={d.image} onChange={(v) => setDest(i, { image: v })} aspect="16/11" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12 }}>
                    {(["code", "city", "flight", "date", "gate", "seat", "boarding", "zone"] as const).map((k) => (
                      <Field key={k} label={k.toUpperCase()} style={k === "city" ? { gridColumn: "span 2" } : undefined}>
                        <input value={String(d[k] ?? "")} onChange={(e) => setDest(i, { [k]: e.target.value } as Partial<HeroDestination>)} style={smallInput} />
                      </Field>
                    ))}
                    <Field label="COORDENADAS" style={{ gridColumn: "1 / -1" }}>
                      <input value={d.coords} onChange={(e) => setDest(i, { coords: e.target.value })} style={{ ...smallInput, fontFamily: "var(--font-mono)", fontSize: 13 }} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* FADES */}
        <Card>
          <div style={cardTitle}>Fundidos del hero</div>
          <p style={cardHint}>Se aplican sobre cualquier imagen de fondo.</p>
          <div style={{ position: "relative", height: 158, borderRadius: 6, overflow: "hidden", marginBottom: 18, background: "#2a2820" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={home.heroDestinations[0]?.image ?? "/images/airport-hero.png"} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: home.heroFade.topHeight / 3, background: `linear-gradient(180deg,${home.heroFade.topColor},transparent)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: home.heroFade.bottomHeight / 4, background: `linear-gradient(0deg,${home.heroFade.bottomColor},transparent)` }} />
            <span style={{ position: "absolute", left: 12, bottom: 10, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", color: "rgba(244,242,239,.7)" }}>VISTA PREVIA</span>
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            <Field label="OSCURIDAD SUPERIOR · HACIA EL HEADER">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TOP_FADES.map(([label, val]) => (
                  <button key={label} onClick={() => patch({ heroFade: { ...home.heroFade, topColor: val } })} style={chipPill(home.heroFade.topColor === val)}>{label}</button>
                ))}
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <RangeField label="ALTURA SUPERIOR" value={home.heroFade.topHeight} onChange={(v) => patch({ heroFade: { ...home.heroFade, topHeight: v } })} min={100} max={480} suffix="px" />
              <RangeField label="ANCHO DEL LATERAL" value={home.heroFade.sideWidth} onChange={(v) => patch({ heroFade: { ...home.heroFade, sideWidth: v } })} min={0} max={80} suffix="%" />
            </div>
            <Field label="COLOR INFERIOR · HACIA LA SECCIÓN">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BOTTOM_FADES.map(([label, val]) => (
                  <button key={label} onClick={() => patch({ heroFade: { ...home.heroFade, bottomColor: val } })} style={{ ...chipPill(home.heroFade.bottomColor === val), display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: val, border: "1px solid rgba(0,0,0,.15)" }} />
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ maxWidth: 340 }}>
              <RangeField label="ALTURA INFERIOR" value={home.heroFade.bottomHeight} onChange={(v) => patch({ heroFade: { ...home.heroFade, bottomHeight: v } })} min={200} max={680} suffix="px" />
            </div>
          </div>
        </Card>

        {/* FRAGMENTS */}
        <Card>
          <div style={cardTitle}>Fragmentos (tarjetas del archivo)</div>
          <p style={cardHint}>Las cinco tarjetas de categoría.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {home.fragments.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 180px", gap: 12, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#9a988f" }}>{f.n}</span>
                <input value={f.title} onChange={(e) => patch({ fragments: home.fragments.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)) })} placeholder="Título" style={smallInput} />
                <input value={f.caption} onChange={(e) => patch({ fragments: home.fragments.map((x, idx) => (idx === i ? { ...x, caption: e.target.value } : x)) })} placeholder="Caption" style={smallInput} />
                <input value={f.url} onChange={(e) => patch({ fragments: home.fragments.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} placeholder="/ruta" style={{ ...smallInput, fontFamily: "var(--font-mono)", fontSize: 12 }} />
              </div>
            ))}
          </div>
        </Card>

        {/* FEATURED + NEWSLETTER */}
        {/* Carrusel decorativo "archivo visual" (la escena final, junto a
            Proyectos destacados). Editá las imágenes acá. */}
        <Card>
          <div style={cardTitle}>Archivo visual (carrusel)</div>
          <ImageListField label="IMÁGENES DEL CARRUSEL" values={home.visualArchiveImages ?? []} onChange={(v) => patch({ visualArchiveImages: v })} hint="Carrusel decorativo del final de la home. Elegí o subí imágenes; arrastrá el × para quitar." />
        </Card>

        <Card>
          <div style={cardTitle}>Destacados y newsletter</div>
          <div style={{ display: "grid", gap: 18 }}>
            <ChipsField label="POSTS DESTACADOS (IDs)" values={home.featuredPosts} onChange={(v) => patch({ featuredPosts: v })} hint="Ej: p5, p1" />
            <TextField label="PROYECTO DESTACADO (SLUG)" value={home.featuredProject} onChange={(v) => patch({ featuredProject: v })} mono />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <TextField label="NEWSLETTER · TÍTULO" value={home.newsletter.heading} onChange={(v) => patch({ newsletter: { ...home.newsletter, heading: v } })} />
              <TextField label="NEWSLETTER · NOTA" value={home.newsletter.note} onChange={(v) => patch({ newsletter: { ...home.newsletter, note: v } })} />
            </div>
          </div>
        </Card>

        {/* THEME */}
        <Card>
          <div style={cardTitle}>Tipografía y color</div>
          <div style={{ display: "grid", gap: 20 }}>
            <Field label="TIPOGRAFÍA DE TÍTULOS">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Playfair Display", "Cormorant Garamond", "Libre Baskerville"].map((f) => (
                  <button key={f} onClick={() => setTh({ fontSerif: f })} style={chipPill(theme.fontSerif === f)}>{f}</button>
                ))}
              </div>
            </Field>
            <Field label="TIPOGRAFÍA DE TEXTO">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Inter", "Work Sans"].map((f) => (
                  <button key={f} onClick={() => setTh({ fontSans: f })} style={chipPill(theme.fontSans === f)}>{f}</button>
                ))}
              </div>
            </Field>
            <Field label="MANUSCRITA">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Over the Rainbow", "Caveat"].map((f) => (
                  <button key={f} onClick={() => setTh({ fontHand: f })} style={chipPill(theme.fontHand === f)}>{f}</button>
                ))}
              </div>
            </Field>
            <div style={{ maxWidth: 340 }}>
              <RangeField label="ESCALA DE TÍTULOS" value={theme.headingScale} onChange={(v) => setTh({ headingScale: v })} min={0.8} max={1.25} step={0.05} suffix="×" />
            </div>
            <Field label="COLOR DE ACENTO">
              <div style={{ display: "flex", gap: 10 }}>
                {ACCENTS.map((c) => (
                  <button key={c} onClick={() => setTh({ blue: c })} aria-label={c} style={{ width: 32, height: 32, borderRadius: 6, background: c, cursor: "pointer", border: theme.blue === c ? "2px solid #1B1D20" : "1px solid rgba(0,0,0,.15)", boxShadow: theme.blue === c ? "inset 0 0 0 2px #fff" : "none" }} />
                ))}
              </div>
            </Field>
            <Field label="ACENTO DEL HERO">
              <div style={{ display: "flex", gap: 10 }}>
                {HERO_ACCENTS.map((c) => (
                  <button key={c} onClick={() => setTh({ heroAccent: c })} aria-label={c} style={{ width: 32, height: 32, borderRadius: 6, background: c, cursor: "pointer", border: theme.heroAccent === c ? "2px solid #1B1D20" : "1px solid rgba(0,0,0,.15)", boxShadow: theme.heroAccent === c ? "inset 0 0 0 2px #fff" : "none" }} />
                ))}
              </div>
            </Field>
          </div>
        </Card>
      </main>
    </>
  );
}

const ctrl = { width: 28, height: 28, border: "1px solid #cbc7bc", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#55565a", lineHeight: 1 } as const;
