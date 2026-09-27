/* ***************************************************************
 * Nom ......... : postcss.config.mjs
 * Rôle ........ : Configurer PostCSS afin d’activer le traitement
 *                 des feuilles de style avec le plugin Tailwind CSS
 *                 utilisé par le frontend Next.js.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 31/07/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npm run build
 * Usage ....... : Fichier chargé automatiquement par Next.js et
 *                 PostCSS lors du développement ou de la
 *                 construction du frontend.
 * *************************************************************** */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
