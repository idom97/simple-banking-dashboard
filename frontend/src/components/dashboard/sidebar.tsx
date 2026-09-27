"use client";
/* ***************************************************************
 * Nom ......... : src/components/dashboard/sidebar.tsx
 * Rôle ........ : Afficher la barre latérale du dashboard, générer
 *                 les liens de navigation et mettre en évidence
 *                 la route actuellement consultée.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Composant importé par le layout du dashboard et
 *                 affiché sur les écrans à partir de 768 pixels.
 * *************************************************************** */
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigation } from "@/constants/navigation";

function routeIsActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6 md:flex">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
          DB
        </span>

        <span>
          <span className="block text-base font-bold text-slate-950">
            Dashboard
          </span>

          <span className="block text-xs text-slate-500">Bancaire</span>
        </span>
      </Link>

      <nav
        aria-label="Navigation principale"
        className="mt-10 flex flex-1 flex-col gap-2"
      >
        {dashboardNavigation.map((item) => {
          const isActive = routeIsActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                }`}
              >
                {item.abbreviation}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-950">
          Mode démonstration
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-800">
          Les données affichées sont récupérées depuis Plaid Sandbox.
        </p>
      </div>
    </aside>
  );
}
