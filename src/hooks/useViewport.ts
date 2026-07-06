"use client";
import { useEffect, useState } from "react";

/** Viewport width, SSR-safe (defaults to a desktop width so the first render
    matches the server, then corrects on mount). */
export function useViewport(initial = 1440): number {
  const [vw, setVw] = useState<number>(initial);
  useEffect(() => {
    const read = () =>
      setVw(document.documentElement.clientWidth || window.innerWidth);
    read();
    window.addEventListener("resize", read, { passive: true });
    window.addEventListener("orientationchange", read);
    return () => {
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, []);
  return vw;
}
