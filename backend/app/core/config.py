# ***************************************************************
# Nom ......... : app/core/config.py
# Rôle ........ : Charger les variables d’environnement du backend,
#                 vérifier la présence des paramètres obligatoires
#                 et centraliser la configuration de MongoDB ainsi
#                 que celle de l’API Plaid.
# Auteur ...... : Dominique ERIN
# Version ..... : V0.1 du 31/07/2026
# Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
#                 Licence 3 Informatique — Université Paris 8 IED.
# Compilation . : python -m py_compile app/core/config.py
# Usage ....... : Module importé automatiquement par les composants
#                 du backend. Le fichier backend/.env doit contenir
#                 les variables MongoDB et Plaid nécessaires.
# ***************************************************************
import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIRECTORY / ".env"

load_dotenv(ENV_FILE)


def get_required_environment_variable(name: str) -> str:
    """Lit une variable obligatoire depuis l'environnement."""

    value = os.getenv(name)

    if value is None or not value.strip():
        raise RuntimeError(
            f"La variable d'environnement {name} est absente ou vide."
        )

    return value.strip()


def get_comma_separated_values(
    name: str,
    default: str,
) -> tuple[str, ...]:
    """Transforme une liste séparée par des virgules en tuple."""

    value = os.getenv(name, default)

    return tuple(
        element.strip()
        for element in value.split(",")
        if element.strip()
    )


@dataclass(frozen=True)
class Settings:
    """Paramètres nécessaires au fonctionnement du backend."""

    mongodb_uri: str
    mongo_database: str

    plaid_client_id: str
    plaid_secret: str
    plaid_env: str
    plaid_client_name: str
    plaid_language: str
    plaid_country_codes: tuple[str, ...]
    plaid_products: tuple[str, ...]
    plaid_demo_user_id: str


@lru_cache
def get_settings() -> Settings:
    """Charge et conserve les paramètres de configuration."""

    return Settings(
        mongodb_uri=get_required_environment_variable(
            "MONGODB_URI"
        ),
        mongo_database=get_required_environment_variable(
            "MONGO_DATABASE"
        ),
        plaid_client_id=get_required_environment_variable(
            "PLAID_CLIENT_ID"
        ),
        plaid_secret=get_required_environment_variable(
            "PLAID_SECRET"
        ),
        plaid_env=os.getenv(
            "PLAID_ENV",
            "sandbox",
        ).strip().lower(),
        plaid_client_name=os.getenv(
            "PLAID_CLIENT_NAME",
            "Dashboard bancaire",
        ).strip(),
        plaid_language=os.getenv(
            "PLAID_LANGUAGE",
            "fr",
        ).strip(),
        plaid_country_codes=get_comma_separated_values(
            "PLAID_COUNTRY_CODES",
            "FR",
        ),
        plaid_products=get_comma_separated_values(
            "PLAID_PRODUCTS",
            "transactions",
        ),
        plaid_demo_user_id=os.getenv(
            "PLAID_DEMO_USER_ID",
            "demo-dashboard-user",
        ).strip(),
    )


settings = get_settings()

# Constantes conservées afin de rester compatibles avec les
# importations déjà présentes dans les autres fichiers.
PLAID_CLIENT_ID = settings.plaid_client_id
PLAID_SECRET = settings.plaid_secret
PLAID_ENV = settings.plaid_env
PLAID_CLIENT_NAME = settings.plaid_client_name
PLAID_LANGUAGE = settings.plaid_language
PLAID_COUNTRY_CODES = settings.plaid_country_codes
PLAID_PRODUCTS = settings.plaid_products
PLAID_DEMO_USER_ID = settings.plaid_demo_user_id