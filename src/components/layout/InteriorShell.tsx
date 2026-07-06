import type { ReactNode } from "react";
import { FitCanvas } from "./FitCanvas";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PaperGrain } from "./PaperGrain";

/** The shared interior-page shell: a fit-to-width 1440 canvas with paper grain,
    the (dark-tone) site header, page content, and the footer — matching every
    interior `.dc.html` page's scaffolding. */
export function InteriorShell({ children }: { children: ReactNode }) {
  return (
    <FitCanvas>
      <PaperGrain opacity={0.05} zIndex={60} />
      <SiteHeader />
      {children}
      <SiteFooter />
    </FitCanvas>
  );
}
