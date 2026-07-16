from fastapi import APIRouter, status, HTTPException, Depends
from app.models.usuario import UsuarioBase
from app.security.auth import verificar_peticion

from sqlalchemy.orm import Session
from app.data.db import get_db
from app.data.usuarioDB import Usuario

router = APIRouter(
    prefix="/v1/usuarios",
    tags=["CRUD HTTP"]
)

@router.get("/")
async def leer_usuarios(db: Session = Depends(get_db)):
    
    usuarios = db.query(Usuario).all()
    
    return {
        "status": "200",
        "total": len(usuarios),
        "usuarios": usuarios
    }
    

@router.post("/", status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: UsuarioBase, db: Session = Depends(get_db)):
     nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        edad=usuario.edad )
     
     db.add(nuevo_usuario)
     db.commit()
     db.refresh(nuevo_usuario)
     
     return {
        "mensaje": "Usuario Agregado",
        "usuario": nuevo_usuario
    }
    
    
@router.put("/{id}", status_code=status.HTTP_200_OK)
async def actualizar_usuario(
    id: int,
    usuario_actualizado: UsuarioBase,
    db: Session = Depends(get_db),
    username: str = Depends(verificar_peticion)
):
    usuario = db.query(Usuario).filter(Usuario.id == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.nombre = usuario_actualizado.nombre
    usuario.edad = usuario_actualizado.edad

    db.commit()
    db.refresh(usuario)

    return {
        "message": f"Usuario actualizado completamente por {username}",
        "data": usuario
    }



@router.patch("/{id}", status_code=status.HTTP_200_OK)
async def actualizar_parcial(
    id: int,
    datos: dict,
    db: Session = Depends(get_db),
    username: str = Depends(verificar_peticion)
):
    usuario = db.query(Usuario).filter(Usuario.id == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    for key, value in datos.items():
        if hasattr(usuario, key):
            setattr(usuario, key, value)

    db.commit()
    db.refresh(usuario)

    return {
        "message": f"Usuario actualizado parcialmente por {username}",
        "data": usuario
    }


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def eliminar_usuario(
    id: int,
    db: Session = Depends(get_db),
    username: str = Depends(verificar_peticion)
):
    usuario = db.query(Usuario).filter(Usuario.id == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()

    return {
        "message": f"Usuario eliminado correctamente por {username}"
    }