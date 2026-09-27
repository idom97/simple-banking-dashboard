"use client";
/* ***************************************************************
 * Nom ......... : src/components/dashboard/banking-dashboard.tsx
 * Rôle ........ : Récupérer les comptes Plaid enregistrés, gérer
 *                 l’état du dashboard, formater les montants et
 *                 afficher les cartes de synthèse ainsi que le
 *                 tableau détaillé des comptes bancaires.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 01/08/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Composant importé par la page d’accueil et
 *                 affiché à l’adresse http://localhost:3000/.
 * *************************************************************** */
import { useCallback, useEffect, useState } from "react";

import { PlaidLinkButton } from "@/components/plaid/plaid-link-button";

import { getAccounts, type AccountsResponse } from "@/services/plaid.service";

function formatAmount(amount: number | null, currency: string | null): string {
  if (amount === null || currency === null) {
    return "—";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function BankingDashboard() {
  const [dashboardData, setDashboardData] = useState<AccountsResponse | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const handleAccountsLoaded = useCallback((accounts: AccountsResponse) => {
    setDashboardData(accounts);
    setLoadError(null);
  }, []);

  useEffect(() => {
    let componentIsMounted = true;

    async function loadSavedAccounts(): Promise<void> {
      try {
        const accounts = await getAccounts();

        if (componentIsMounted) {
          setDashboardData(accounts);
        }
      } catch (exception) {
        /*
         * L'absence de banque est normale lors de la
         * première ouverture de l'application.
         */
        if (
          componentIsMounted &&
          exception instanceof Error &&
          !exception.message.includes("Aucune banque")
        ) {
          setLoadError(exception.message);
        }
      } finally {
        if (componentIsMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedAccounts();

    return () => {
      componentIsMounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <header>
        <p className="text-sm font-medium text-blue-600">Vue d’ensemble</p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tableau de bord bancaire
        </h1>

        <p className="mt-2 text-slate-600">
          Consultez la situation générale de vos comptes bancaires.
        </p>
      </header>

      <PlaidLinkButton
        hasAccounts={dashboardData !== null}
        onAccountsLoaded={handleAccountsLoaded}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">
          Chargement des comptes enregistrés...
        </p>
      ) : null}

      {loadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Nombre de comptes</p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {dashboardData?.account_count ?? "—"}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Solde total</p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatAmount(
              dashboardData?.total_current_balance ?? null,
              dashboardData?.currency ?? null,
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Solde disponible</p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatAmount(
              dashboardData?.total_available_balance ?? null,
              dashboardData?.currency ?? null,
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Devise</p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {dashboardData?.currency ?? "—"}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Comptes associés
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Les comptes récupérés depuis Plaid Sandbox sont affichés dans ce
            tableau.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Établissement</th>

                <th className="pb-3 font-medium">Compte</th>

                <th className="pb-3 font-medium">Type</th>

                <th className="pb-3 font-medium">Numéro</th>

                <th className="pb-3 font-medium">Solde disponible</th>

                <th className="pb-3 font-medium">Solde comptable</th>

                <th className="pb-3 font-medium">Devise</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData?.accounts.length ? (
                dashboardData.accounts.map((account) => (
                  <tr
                    key={account.account_id}
                    className="border-b border-slate-100 text-sm text-slate-700"
                  >
                    <td className="py-4 pr-4">
                      {account.institution_name ?? "—"}
                    </td>

                    <td className="py-4 pr-4">{account.name}</td>

                    <td className="py-4 pr-4">{account.subtype}</td>

                    <td className="py-4 pr-4">
                      {account.mask ? `•••• ${account.mask}` : "—"}
                    </td>

                    <td className="py-4 pr-4">
                      {formatAmount(
                        account.available_balance,
                        account.currency,
                      )}
                    </td>

                    <td className="py-4 pr-4">
                      {formatAmount(account.current_balance, account.currency)}
                    </td>

                    <td className="py-4">{account.currency ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucun compte bancaire n’a encore été chargé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
