from pydantic import BaseModel, Field

class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50)
    edad: int = Field(..., ge=0, le=120)