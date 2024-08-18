import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de Conducir",
  description: "Simula la experiencia de test de conducir",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  other: {
    "theme-color": "#fafafa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable} bg-neutral-50`}>
      <body>{children}</body>
    </html>
  );
}
