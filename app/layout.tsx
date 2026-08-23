import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Directorio SEEKET",
  description: "Prueba técnica de UX/UI: pantalla del Directorio, datos ficticios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}