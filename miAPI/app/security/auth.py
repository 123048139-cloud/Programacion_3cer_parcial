from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

security = HTTPBasic()

def verificar_peticion(credentials: HTTPBasicCredentials = Depends(security)):
    username_correcto = secrets.compare_digest(credentials.username, "admin")
    password_correcto = secrets.compare_digest(credentials.password, "1234")

    if not (username_correcto and password_correcto):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username

