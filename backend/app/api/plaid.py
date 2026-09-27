# ***************************************************************
# Nom ......... : app/api/plaid.py
# Rôle ........ : Définir les routes FastAPI nécessaires à la
#                 connexion avec Plaid Sandbox, créer le link_token,
#                 échanger le public_token contre un access_token,
#                 enregistrer la connexion dans MongoDB et récupérer
#                 les comptes bancaires ainsi que leurs soldes.
# Auteur ...... : Dominique ERIN
# Version ..... : V0.1 du 31/07/2026
# Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
#                 Licence 3 Informatique — Université Paris 8 IED.
# Compilation . : python -m py_compile app/api/plaid.py
# Usage ....... : Depuis le répertoire backend, démarrer l’API avec :
#                 fastapi dev app/main.py
#                 Les routes sont ensuite accessibles sous :
#                 POST /api/plaid/link-token
#                 POST /api/plaid/exchange-public-token
#                 GET  /api/plaid/accounts
# ***************************************************************
import plaid
from fastapi import APIRouter, HTTPException, status
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import (
    LinkTokenCreateRequest,
)
from plaid.model.link_token_create_request_user import (
    LinkTokenCreateRequestUser,
)
from plaid.model.products import Products

from pydantic import BaseModel
from plaid.model.accounts_get_request import (
    AccountsGetRequest,
)
from plaid.model.item_public_token_exchange_request import (
    ItemPublicTokenExchangeRequest,
)
from app.core.config import (
    PLAID_CLIENT_NAME,
    PLAID_COUNTRY_CODES,
    PLAID_LANGUAGE,
    PLAID_PRODUCTS,
    PLAID_DEMO_USER_ID,
)
from app.core.database import database

from app.core.plaid_client import plaid_client


router = APIRouter()


@router.post("/link-token")
def create_link_token() -> dict[str, str]:
    request = LinkTokenCreateRequest(
        products=[
            Products(product)
            for product in PLAID_PRODUCTS
        ],
        client_name=PLAID_CLIENT_NAME,
        country_codes=[
            CountryCode(country_code)
            for country_code in PLAID_COUNTRY_CODES
        ],
        language=PLAID_LANGUAGE,
        user=LinkTokenCreateRequestUser(
            client_user_id=PLAID_DEMO_USER_ID,
        ),
    )

    try:
        response = plaid_client.link_token_create(request)

    except plaid.ApiException as exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "La création du link_token a échoué "
                "auprès de Plaid Sandbox."
            ),
        ) from exception

    return {
        "link_token": response["link_token"],
        "expiration": response["expiration"].isoformat(),
    }

class PublicTokenRequest(BaseModel):
    """Données reçues après la réussite de Plaid Link."""

    public_token: str
    institution_id: str | None = None
    institution_name: str | None = None


plaid_connections = database[
    "plaid_connections"
]

@router.post("/exchange-public-token")
def exchange_public_token(
    payload: PublicTokenRequest,
) -> dict[str, str]:
    """Échange le public_token contre un access_token."""

    request = ItemPublicTokenExchangeRequest(
        public_token=payload.public_token,
    )

    try:
        response = (
            plaid_client
            .item_public_token_exchange(request)
        )
    except plaid.ApiException as exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "L'échange du public_token "
                "a échoué auprès de Plaid Sandbox."
            ),
        ) from exception

    response_data = response.to_dict()

    plaid_connections.update_one(
        {
            "profile": PLAID_DEMO_USER_ID,
        },
        {
            "$set": {
                "access_token":
                    response_data["access_token"],
                "item_id":
                    response_data["item_id"],
                "institution_id":
                    payload.institution_id,
                "institution_name":
                    payload.institution_name,
            },
        },
        upsert=True,
    )

    return {
        "status": "connected",
    }

# Fonction de normalisation
def get_string_value(value: object) -> str:
    """Convertit une valeur ou une énumération en chaîne."""

    return str(
        getattr(value, "value", value)
    )

@router.get("/accounts")
def get_accounts() -> dict[str, object]:
    """Récupère les comptes du profil de démonstration."""

    connection = plaid_connections.find_one(
        {
            "profile": PLAID_DEMO_USER_ID,
        }
    )

    if (
        connection is None
        or not connection.get("access_token")
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Aucune banque n'est encore connectée."
            ),
        )

    request = AccountsGetRequest(
        access_token=str(
            connection["access_token"]
        ),
    )

    try:
        response = plaid_client.accounts_get(
            request
        )
    except plaid.ApiException as exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "La récupération des comptes "
                "a échoué auprès de Plaid Sandbox."
            ),
        ) from exception

    response_data = response.to_dict()
    accounts: list[dict[str, object]] = []

    for account in response_data["accounts"]:
        balances = account["balances"]

        account_type = get_string_value(
            account["type"]
        )

        account_subtype = get_string_value(
            account["subtype"]
        )

        currency = (
            balances.get("iso_currency_code")
            or balances.get(
                "unofficial_currency_code"
            )
        )

        accounts.append(
            {
                "account_id":
                    str(account["account_id"]),
                "institution_name":
                    connection.get(
                        "institution_name"
                    ),
                "name":
                    str(account["name"]),
                "official_name":
                    account.get("official_name"),
                "type":
                    account_type,
                "subtype":
                    account_subtype,
                "mask":
                    account.get("mask"),
                "current_balance":
                    balances.get("current"),
                "available_balance":
                    balances.get("available"),
                "currency":
                    currency,
            }
        )

    depository_accounts = [
        account
        for account in accounts
        if account["type"] == "depository"
    ]

    currencies = {
        str(account["currency"])
        for account in depository_accounts
        if account["currency"] is not None
    }

    currency = (
        next(iter(currencies))
        if len(currencies) == 1
        else None
    )

    current_balances = [
        float(account["current_balance"])
        for account in depository_accounts
        if (
            account["currency"] == currency
            and account["current_balance"]
                is not None
        )
    ]

    available_balances = [
        float(account["available_balance"])
        for account in depository_accounts
        if (
            account["currency"] == currency
            and account["available_balance"]
                is not None
        )
    ]

    return {
        "account_count": len(accounts),
        "total_current_balance": (
            sum(current_balances)
            if current_balances
            else None
        ),
        "total_available_balance": (
            sum(available_balances)
            if available_balances
            else None
        ),
        "currency": currency,
        "accounts": accounts,
    }