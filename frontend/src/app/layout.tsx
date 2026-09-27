/* ***************************************************************
 * Nom ......... : src/app/layout.tsx
 * Rôle ........ : Définir le layout racine de l’application,
 *                 charger les polices Geist, déclarer les
 *                 métadonnées globales et afficher les pages
 *                 au moyen de la propriété children.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npm run build
 * Usage ....... : Layout chargé automatiquement par Next.js pour
 *                 l’ensemble des routes de l’application.
 * *************************************************************** */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Bancaire",
  description:
    "Application web de consultation et d’analyse de données bancaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
