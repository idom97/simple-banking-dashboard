/* ***************************************************************
 * Nom ......... : src/constants/navigation.ts
 * Rôle ........ : Définir le type des éléments de navigation et
 *                 centraliser les libellés, les routes et les
 *                 abréviations utilisés par le dashboard.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Module importé par les composants Header et
 *                 Sidebar pour générer les liens de navigation.
 * *************************************************************** */
export type DashboardNavigationItem = {
  label: string;
  href: string;
  abbreviation: string;
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    label: "Accueil",
    href: "/",
    abbreviation: "A",
  },
];
