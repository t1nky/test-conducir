import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import BackgroundGrid from "./_components/background-grid";

export const metadata: Metadata = {
  title: "Test de Conducir",
  description: "Simula la experiencia de test de conducir",
  icons: [{ rel: "icon", url: (process.env.BASE_PATH ?? "") + "/favicon.ico" }],
  other: {
    "theme-color": "#fafafa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable} bg-neutral-50`}>
      <body>
        {children}
        <div className="absolute inset-0 -z-10">
          <BackgroundGrid />
        </div>
      </body>
    </html>
  );
}
