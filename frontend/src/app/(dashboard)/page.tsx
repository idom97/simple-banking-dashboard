/* ***************************************************************
 * Nom ......... : src/app/(dashboard)/page.tsx
 * Rôle ........ : Définir la page d’accueil du dashboard bancaire,
 *                 ses métadonnées et l’affichage du composant
 *                 BankingDashboard.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npm run build
 * Usage ....... : Lancer npm run dev puis ouvrir
 *                 http://localhost:3000/.
 * *************************************************************** */

import type { Metadata } from "next";

import { BankingDashboard } from "@/components/dashboard/banking-dashboard";

export const metadata: Metadata = {
  title: "Accueil | Dashboard bancaire",
  description: "Vue d’ensemble des comptes bancaires",
};

export default function DashboardPage() {
  return <BankingDashboard />;
}
