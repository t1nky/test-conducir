import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { QuizStoreProvider } from "./_provider/quiz-store-provider";
import { Suspense } from "react";

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
      <Suspense
        fallback={
          <div className="flex h-svh w-full items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        }
      >
        <QuizStoreProvider>
          <body>{children}</body>
        </QuizStoreProvider>
      </Suspense>
    </html>
  );
}
