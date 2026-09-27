# ***************************************************************
# Nom ......... : app/core/plaid_client.py
# Rôle ........ : Configurer le client Plaid à partir des variables
#                 d’environnement, sélectionner l’environnement
#                 Sandbox ou Production et fournir une instance
#                 PlaidApi utilisable par les routes du backend.
# Auteur ...... : Dominique ERIN
# Version ..... : V0.1 du 31/07/2026
# Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
#                 Licence 3 Informatique — Université Paris 8 IED.
# Compilation . : python -m py_compile app/core/plaid_client.py
# Usage ....... : Module importé par app/api/plaid.py afin d’appeler
#                 les services Plaid. Les variables PLAID_CLIENT_ID,
#                 PLAID_SECRET et PLAID_ENV doivent être définies
#                 dans le fichier backend/.env.
# ***************************************************************
import plaid
from plaid.api import plaid_api
from app.core.config import (
    PLAID_CLIENT_ID,
    PLAID_ENV,
    PLAID_SECRET,
)


PLAID_ENVIRONMENTS = {
    "sandbox": plaid.Environment.Sandbox,
    "production": plaid.Environment.Production,
}


plaid_host = PLAID_ENVIRONMENTS.get(PLAID_ENV)

if plaid_host is None:
    raise RuntimeError(
        "La variable PLAID_ENV doit être égale "
        "à 'sandbox' ou à 'production'."
    )


configuration = plaid.Configuration(
    host=plaid_host,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)


api_client = plaid.ApiClient(configuration)

plaid_client = plaid_api.PlaidApi(api_client)