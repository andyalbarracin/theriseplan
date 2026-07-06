"use client";
import type { CSSProperties, ReactNode } from "react";

const label: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f", display: "block", marginBottom: 8 };
const control: CSSProperties = { width: "100%", height: 46, border: "1px solid #cbc7bc", borderRadius: 3, padding: "0 14px", background: "#fff", color: "#1B1D20", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none" };
const hintStyle: CSSProperties = { margin: "8px 0 0", fontSize: 12, color: "#8a887f" };

export function Field({ label: l, children, hint, style }: { label?: ReactNode; children: ReactNode; hint?: string; style?: CSSProperties }) {
  return (
    <div style={style}>
      {l && <span style={label}>{l}</span>}
      {children}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

export function TextField({ label: l, value, onChange, placeholder, mono, big, hint }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; big?: boolean; hint?: string }) {
  return (
    <Field label={l} hint={hint}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...control,
          ...(mono ? { fontFamily: "var(--font-mono)", fontSize: 13 } : {}),
          ...(big ? { height: 60, fontFamily: "var(--font-serif)", fontSize: 24 } : {}),
        }}
      />
    </Field>
  );
}

export function TextAreaField({ label: l, value, onChange, placeholder, rows = 4, hint, mono, serif }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string; mono?: boolean; serif?: boolean }) {
  return (
    <Field label={l} hint={hint}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          ...control,
          height: "auto",
          minHeight: rows * 24,
          padding: "12px 14px",
          resize: "vertical",
          lineHeight: 1.5,
          ...(mono ? { fontFamily: "var(--font-mono)", fontSize: 13 } : {}),
          ...(serif ? { fontFamily: "var(--font-serif)", fontSize: 18 } : {}),
        }}
      />
    </Field>
  );
}

export function SelectField({ label: l, value, onChange, options, hint }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; hint?: string }) {
  return (
    <Field label={l} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...control, appearance: "none", cursor: "pointer" }}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ToggleField({ label: l, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "14px 0" }}>
      <div>
        <div style={{ fontSize: 14, color: "#1B1D20" }}>{l}</div>
        {hint && <div style={{ marginTop: 4, fontSize: 12.5, color: "#8a887f", maxWidth: 420 }}>{hint}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{ width: 46, height: 26, borderRadius: 20, border: "none", cursor: "pointer", flex: "none", background: checked ? "#2F5DAA" : "#cbc7bc", position: "relative", transition: "background .2s ease" }}
      >
        <span style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
      </button>
    </div>
  );
}

export function RangeField({ label: l, value, onChange, min, max, step = 1, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <Field label={`${l} · ${value}${suffix ?? ""}`}>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#2F5DAA" }} />
    </Field>
  );
}

export function ChipsField({ label: l, values, onChange, hint }: { label?: string; values: string[]; onChange: (v: string[]) => void; hint?: string }) {
  return (
    <Field label={l} hint={hint ?? "Separados por coma"}>
      <input
        value={values.join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        style={control}
        placeholder="uno, dos, tres"
      />
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {values.map((v) => (
            <span key={v} style={{ fontSize: 11, letterSpacing: ".04em", color: "#33352f", border: "1px solid #cbc7bc", borderRadius: 20, padding: "5px 12px" }}>{v}</span>
          ))}
        </div>
      )}
    </Field>
  );
}

export function SegmentedField<T extends string>({ label: l, value, onChange, options }: { label?: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <Field label={l}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                padding: "10px 18px",
                borderRadius: 3,
                cursor: "pointer",
                color: active ? "#F4F2EF" : "#55565a",
                background: active ? "#1B1D20" : "transparent",
                border: active ? "1px solid #1B1D20" : "1px solid #cbc7bc",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
