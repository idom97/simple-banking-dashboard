/* ***************************************************************
 * Nom ......... : src/services/plaid.service.ts
 * Rôle ........ : Centraliser les appels HTTP du frontend vers
 *                 l’API FastAPI afin de créer le link_token,
 *                 échanger le public_token et récupérer les
 *                 comptes bancaires depuis Plaid Sandbox.
 * Auteur ...... : Dominique ERIN
 * Version ..... : V0.1 du 31/07/2026
 * Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
 *                 Licence 3 Informatique — Université Paris 8 IED.
 * Compilation . : npx tsc --noEmit && npm run build
 * Usage ....... : Importer createLinkToken(),
 *                 exchangePublicToken() ou getAccounts() dans un
 *                 composant client. Le backend doit être lancé
 *                 sur l’URL définie par NEXT_PUBLIC_API_URL.
 * *************************************************************** */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type LinkTokenResponse = {
  link_token: string;
  expiration: string;
};

export type PlaidInstitution = {
  institution_id: string | null;
  name: string | null;
};

export type PlaidAccount = {
  account_id: string;
  institution_name: string | null;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string;
  mask: string | null;
  current_balance: number | null;
  available_balance: number | null;
  currency: string | null;
};

export type AccountsResponse = {
  account_count: number;
  total_current_balance: number | null;
  total_available_balance: number | null;
  currency: string | null;
  accounts: PlaidAccount[];
};

async function getErrorMessage(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const body = (await response.json()) as {
      detail?: string;
    };

    return body.detail ?? defaultMessage;
  } catch {
    return defaultMessage;
  }
}

export async function createLinkToken(): Promise<string> {
  const response = await fetch(`${API_URL}/api/plaid/link-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "La création du link_token a échoué.",
    );

    throw new Error(message);
  }

  const data = (await response.json()) as LinkTokenResponse;

  return data.link_token;
}

export async function exchangePublicToken(
  publicToken: string,
  institution: PlaidInstitution | null,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/plaid/exchange-public-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_token: publicToken,
      institution_id: institution?.institution_id ?? null,
      institution_name: institution?.name ?? null,
    }),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "L'échange du public_token a échoué.",
    );

    throw new Error(message);
  }
}

export async function getAccounts(): Promise<AccountsResponse> {
  const response = await fetch(`${API_URL}/api/plaid/accounts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "La récupération des comptes a échoué.",
    );

    throw new Error(message);
  }

  return (await response.json()) as AccountsResponse;
}
