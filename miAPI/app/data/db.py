from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# -------------------------------------------------------------------------
# OBTENER LA URL DE CONEXIÓN A LA BASE DE DATOS
# -------------------------------------------------------------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@postgres:5432/DB_miapi"
)

# -------------------------------------------------------------------------
# CREACIÓN DEL ENGINE (MOTOR DE CONEXIÓN)
# -------------------------------------------------------------------------
engine = create_engine(DATABASE_URL)


# -------------------------------------------------------------------------
# CREACIÓN DEL FACTORY DE SESIONES
# -------------------------------------------------------------------------
# sessionmaker: "fábrica de sesiones".
# Una sesión representa una conversación con la base de datos
# durante una operación de la aplicación.

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -------------------------------------------------------------------------
# BASE DECLARATIVA PARA LOS MODELOS
# -------------------------------------------------------------------------

Base = declarative_base()


# Esta función se usa como dependencia en FastAPI para
# obtener una sesión de base de datos por cada request.

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()