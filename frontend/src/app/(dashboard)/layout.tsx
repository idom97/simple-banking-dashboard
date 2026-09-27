/* ***************************************************************
 * Nom ......... : src/app/(dashboard)/layout.tsx
 * Rôle ........ : Organiser l’interface commune du dashboard en
 *                 affichant la barre latérale, l’en-tête et le
 *                 contenu de chaque page transmis par children.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npm run build
 * Usage ....... : Layout appliqué automatiquement la route /.
 * *************************************************************** */
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
