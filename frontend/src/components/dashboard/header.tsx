"use client";
/* ***************************************************************
 * Nom ......... : src/components/dashboard/header.tsx
 * Rôle ........ : Afficher l’en-tête responsive du dashboard,
 *                 présenter son état général et construire la
 *                 navigation mobile selon la route active.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Composant importé par le layout du dashboard et
 *                 affiché automatiquement sur ses différentes pages.
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

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 md:hidden"
          aria-label="Revenir à l’accueil"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            DB
          </span>
          <span className="font-bold text-slate-950">Dashboard bancaire</span>
        </Link>

        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-900">
            Tableau de bord bancaire
          </p>
          <p className="text-xs text-slate-500">
            Consultation et analyse des données bancaires
          </p>
        </div>

        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          Données à connecter
        </span>
      </div>

      <nav
        aria-label="Navigation mobile"
        className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 md:hidden"
      >
        {dashboardNavigation.map((item) => {
          const isActive = routeIsActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
