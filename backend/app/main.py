# ***************************************************************
# Nom ......... : app/main.py
# Rôle ........ : Initialiser l’API FastAPI du dashboard bancaire,
#                 configurer les autorisations CORS, enregistrer
#                 les routes Plaid et gérer l’ouverture ainsi que
#                 la fermeture de la connexion à MongoDB.
# Auteur ...... : Dominique ERIN
# Version ..... : V0.1 du 31/07/2026
# Licence ..... : Réalisé dans le cadre de l’EC Projet tutoré,
#                 Licence 3 Informatique — Université Paris 8 IED.
# Compilation . : python -m py_compile app/main.py
# Usage ....... : Depuis le répertoire backend, exécuter :
#                 fastapi dev app/main.py
#                 L’API est ensuite disponible à l’adresse :
#                 http://127.0.0.1:8000
# ***************************************************************
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pymongo.errors import PyMongoError

from app.api.plaid import router as plaid_router
from app.core.database import (
    check_database_connection,
    close_database_connection,
    database,
)
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Gère la connexion MongoDB pendant la vie de l'application."""

    check_database_connection()

    try:
        yield
    finally:
        close_database_connection()


app = FastAPI(
    title="API du dashboard bancaire",
    description="Backend de l'application de consultation bancaire",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    plaid_router,
    prefix="/api/plaid",
    tags=["Plaid"],
)


@app.get("/", tags=["État de l'API"])
def read_root() -> dict[str, str]:
    """Vérifie que l'API est opérationnelle."""

    return {
        "message": "API du dashboard bancaire opérationnelle",
    }


@app.get(
    "/health/database",
    tags=["État de l'API"],
)
def database_health() -> dict[str, str]:
    """Vérifie l'état de la connexion à MongoDB."""

    try:
        check_database_connection()
    except PyMongoError as error:
        raise HTTPException(
            status_code=503,
            detail="La connexion à MongoDB est indisponible",
        ) from error

    return {
        "status": "ok",
        "database": database.name,
    }