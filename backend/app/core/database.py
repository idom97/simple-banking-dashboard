# ***************************************************************
# Nom ......... : app/core/database.py
# Rôle ........ : Initialiser le client MongoDB, sélectionner la
#                 base de données du dashboard bancaire, vérifier
#                 la disponibilité du serveur et fermer proprement
#                 la connexion lors de l’arrêt de l’application.
# Auteur ...... : Dominique ERIN
# Version ..... : V0.1 du 31/07/2026
# Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
#                 Licence 3 Informatique — Université Paris 8 IED.
# Compilation . : python -m py_compile app/core/database.py
# Usage ....... : Module importé par l’application FastAPI.
#                 MongoDB doit être démarré avec :
#                 docker compose up -d
# ***************************************************************
from pymongo import MongoClient
from pymongo.database import Database
from app.core.config import get_settings

settings = get_settings()

mongo_client: MongoClient = MongoClient(
	settings.mongodb_uri,
	serverSelectionTimeoutMS=5000,
)

database: Database = mongo_client[settings.mongo_database]

def check_database_connection() -> None:
	"""Vérifie que le serveur MongoDB répond."""
	mongo_client.admin.command("ping")


def close_database_connection() -> None:
	"""Ferme proprement le client MongoDB."""
	mongo_client.close()
