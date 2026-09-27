"use client";
"use client";

/* ***************************************************************
 * Nom ......... : src/components/plaid/plaid-link-button.tsx
 * Rôle ........ : Initialiser Plaid Link, ouvrir l’interface de
 *                 connexion bancaire, récupérer le public_token,
 *                 demander son échange au backend et transmettre
 *                 les comptes chargés au composant parent.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 31/07/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Composant importé dans BankingDashboard.
 *                 Le backend FastAPI doit être lancé et les
 *                 paramètres Plaid Sandbox doivent être configurés.
 * *************************************************************** */
import { useCallback, useEffect, useState } from "react";

import { type PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";

import {
  createLinkToken,
  exchangePublicToken,
  getAccounts,
  type AccountsResponse,
} from "@/services/plaid.service";

type PlaidLinkButtonProps = {
  hasAccounts: boolean;

  onAccountsLoaded: (accounts: AccountsResponse) => void;
};

export function PlaidLinkButton({
  hasAccounts,
  onAccountsLoaded,
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState(
    "Initialisation de la connexion bancaire...",
  );

  useEffect(() => {
    let componentIsMounted = true;

    async function initializePlaid(): Promise<void> {
      try {
        const token = await createLinkToken();

        if (componentIsMounted) {
          setLinkToken(token);

          setMessage(
            hasAccounts
              ? "Une banque est actuellement connectée."
              : "La connexion bancaire est disponible.",
          );
        }
      } catch (exception) {
        if (componentIsMounted) {
          setMessage(
            exception instanceof Error
              ? exception.message
              : "Impossible d'initialiser Plaid Link.",
          );
        }
      }
    }

    void initializePlaid();

    return () => {
      componentIsMounted = false;
    };
  }, [hasAccounts]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      if (!publicToken) {
        setMessage("Plaid n'a retourné aucun public_token.");

        return;
      }

      setIsLoading(true);

      setMessage("Récupération des comptes en cours...");

      const institution = metadata.institution
        ? {
            institution_id: metadata.institution.institution_id ?? null,

            name: metadata.institution.name ?? null,
          }
        : null;

      try {
        await exchangePublicToken(publicToken, institution);

        const accounts = await getAccounts();

        /*
         * Les données sont envoyées au composant
         * BankingDashboard.
         */
        onAccountsLoaded(accounts);

        setMessage("Les comptes ont été chargés.");
      } catch (exception) {
        setMessage(
          exception instanceof Error
            ? exception.message
            : "La récupération des comptes a échoué.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onAccountsLoaded],
  );

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess,

    onExit: (plaidError) => {
      if (plaidError) {
        setMessage("La fenêtre Plaid a été fermée après une erreur.");
      }
    },
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">
        Connexion bancaire
      </h2>

      <p className="mt-2 text-sm text-slate-600">{message}</p>

      {error ? (
        <p className="mt-2 text-sm text-red-700">
          {error.message ?? "Une erreur Plaid est survenue."}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => open()}
        disabled={!ready || linkToken === null || isLoading}
        className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Connexion en cours..."
          : hasAccounts
            ? "Reconnecter une banque"
            : "Connecter une banque"}
      </button>
    </section>
  );
}
