from fastapi import APIRouter
import asyncio
from typing import Optional

router = APIRouter(tags=["General"])

@router.get("/")
async def bienvenida():
    return {"mensaje": "¡Bienvenido a mi API!"}

@router.get("/HolaMundo")
async def hola():
    await asyncio.sleep(3)
    return {
        "mensaje": "¡Hola Mundo FastAPI!",
        "estatus": "200"
    }

@router.get("/v1/parametroOb/{id}")
async def consultaUno(id: int):
    return {"Se encontro usuario": id}

