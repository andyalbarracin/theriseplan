import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F2EF", fontFamily: "var(--font-sans)", color: "#1B1D20" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }} className="thin-scroll">
        {children}
      </div>
    </div>
  );
}
