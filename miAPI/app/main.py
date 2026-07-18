from fastapi import FastAPI
from app.routers import usuarios
from app.data.db import engine
from app.data import usuarioDB
from fastapi.middleware.cors import CORSMiddleware

# pertenece al funcionamiento del ORM de SQLAlchemy y sirve para
# crear automáticamente las tablas en la base de datos si aún no existen.
usuarioDB.Base.metadata.create_all(bind=engine)


app = FastAPI(title="API usuarios ", description="Ivan Isay Guerra", version="1.0.0")

app.include_router(usuarios.router)

origins = ["http://localhost:5000", "http://localhost:8081"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
