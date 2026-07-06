import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export function AdminTopbar({ title, eyebrow, actions }: { title: string; eyebrow?: string; actions?: ReactNode }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(244,242,239,.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e0dcd2",
        padding: "22px clamp(20px,4vw,40px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 30, lineHeight: 1, color: "#1A1C1F" }}>{title}</h1>
        {eyebrow && <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em", color: "#9a988f" }}>{eyebrow}</div>}
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>{actions}</div>}
    </header>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e1d7", borderRadius: 9, padding: "24px 26px", ...style }}>
      {children}
    </div>
  );
}

const btnBase: CSSProperties = {
  height: 46,
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  padding: "0 20px",
  borderRadius: 3,
  fontSize: 13.5,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  textDecoration: "none",
  border: "none",
  whiteSpace: "nowrap",
};

const variants: Record<string, CSSProperties> = {
  primary: { background: "#0D0D0E", color: "#F4F2EF" },
  ghost: { background: "transparent", color: "#1B1D20", border: "1px solid #cbc7bc" },
  danger: { background: "transparent", color: "#a23b3b", border: "1px solid #d8b4b4" },
};

type BtnProps = {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  style?: CSSProperties;
};

export function AdminButton({ variant = "primary", children, href, onClick, type = "button", style }: BtnProps) {
  const s = { ...btnBase, ...variants[variant], ...style };
  if (href) {
    return (
      <Link href={href} style={s}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} style={s}>
      {children}
    </button>
  );
}

export function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 10, letterSpacing: ".1em", color, background: bg, borderRadius: 20, padding: "5px 11px", whiteSpace: "nowrap", flex: "none" }}>
      {label}
    </span>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "#9a988f", ...style }}>{children}</div>;
}

/* status → badge colors, shared by lists + editors */
export function postBadge(status: string): { label: string; color: string; bg: string } {
  const map: Record<string, [string, string, string]> = {
    published: ["Publicado", "#2F5DAA", "rgba(47,93,170,.1)"],
    draft: ["Borrador", "#b07a1e", "rgba(176,122,30,.13)"],
    archived: ["Archivado", "#6b6c66", "rgba(107,108,102,.14)"],
  };
  const [label, color, bg] = map[status] ?? ["—", "#6b6c66", "rgba(107,108,102,.14)"];
  return { label, color, bg };
}

export function projectBadge(pr: { status: string; visibility: string; sensitive: boolean }): { label: string; color: string; bg: string } {
  if (pr.visibility !== "public" || pr.sensitive) return { label: "Privado", color: "#a23b3b", bg: "rgba(162,59,59,.12)" };
  const map: Record<string, [string, string, string]> = {
    active: ["Activo", "#1f8a5b", "rgba(31,138,91,.12)"],
    building: ["Construyendo", "#2F5DAA", "rgba(47,93,170,.1)"],
    paused: ["En pausa", "#b07a1e", "rgba(176,122,30,.13)"],
    archived: ["Archivado", "#6b6c66", "rgba(107,108,102,.14)"],
    draft: ["Borrador", "#6b6c66", "rgba(107,108,102,.14)"],
  };
  const [label, color, bg] = map[pr.status] ?? ["—", "#6b6c66", "rgba(107,108,102,.14)"];
  return { label, color, bg };
}
