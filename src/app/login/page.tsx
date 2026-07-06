import type { Metadata } from "next";
import { LoginView } from "@/components/public/login/LoginView";

export const metadata: Metadata = {
  title: "Acceso · Admin",
  description: "Panel de administración de andyalbarracin.com.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginView />;
}
