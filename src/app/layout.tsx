import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Licence Gestion de Projet AI",
  description: "Assistant pédagogique universitaire de Licence 1 à Licence 3."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}