"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monogram } from "./Monogram";
import { NAV_SETTINGS } from "@/lib/data/seed/nav";

const NAV = NAV_SETTINGS.main.filter((n) => n.visible);

export function SiteHeader({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vw, setVw] = useState(1440);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setVw(w);
      if (w > 860) setMenuOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const light = tone === "light";
  const isMobile = vw <= 860;
  const itemSize = vw <= 400 ? "32px" : vw <= 520 ? "40px" : "50px";
  const logoColor = light ? "#F7F5EF" : "#1B1D20";
  const navColor = light ? "rgba(244,242,239,.9)" : "#33352f";
  const barBg = light ? "#F4F2EF" : "#1B1D20";
  const shadow = light ? "drop-shadow(0 1px 10px rgba(8,7,4,.4))" : "none";
  const hdrPad = isMobile ? "22px 22px 0" : "32px 56px 0";

  return (
    <div style={{ position: "relative", zIndex: 30, fontFamily: "var(--font-sans)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: hdrPad,
          filter: shadow,
        }}
      >
        <Link href="/" aria-label="Inicio" style={{ display: "inline-flex" }}>
          <Monogram color={logoColor} size={30} />
        </Link>
        <nav
          style={{
            display: isMobile ? "none" : "flex",
            position: "absolute",
            left: "50%",
            top: 38,
            transform: "translateX(-50%)",
            gap: 36,
            fontSize: 13,
            letterSpacing: ".01em",
            color: navColor,
          }}
        >
          {NAV.map((item) => (
            <Link key={item.url} href={item.url} style={{ color: navColor }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={menuOpen}
          style={{
            display: isMobile ? "flex" : "none",
            flexDirection: "column",
            gap: 6,
            width: 38,
            padding: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ height: 2.5, width: "100%", background: barBg, borderRadius: 2 }} />
          ))}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "#0D0D0E",
              color: "#F4F2EF",
              display: "flex",
              flexDirection: "column",
              padding: "26px 24px 30px",
              fontFamily: "var(--font-sans)",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Monogram color="#F4F2EF" size={30} />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar"
                style={{
                  width: 44,
                  height: 44,
                  background: "none",
                  border: "none",
                  color: "#F4F2EF",
                  fontSize: 30,
                  fontWeight: 300,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                &#215;
              </button>
            </div>
            <motion.nav
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {NAV.map((item, i) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "7px 0" }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5f6b7c" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: itemSize,
                      lineHeight: 1.06,
                      color: "#F4F2EF",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </motion.nav>
            <div style={{ borderTop: "1px solid rgba(244,242,239,.14)", paddingTop: 20, marginTop: 8 }}>
              <p style={{ margin: "0 0 14px", fontFamily: "var(--font-hand)", fontSize: 22, color: "#4f7ac2" }}>
                Ideas en tránsito.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 12, letterSpacing: ".06em", color: "#77756e" }}>
                  <span style={{ color: "#F4F2EF" }}>ES</span> · EN
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".08em", color: "#6f6d66" }}>
                  © 2026 andyalbarracin.com — Todos los derechos reservados.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
