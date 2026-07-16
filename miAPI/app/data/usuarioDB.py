from sqlalchemy import Column, Integer, String
from app.data.db import Base


class Usuario(Base):

    __tablename__ = "tb-usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    edad = Column(Integer)
    
# -------------------------------------------------------------------
# MODELO ORM: Usuario
# -------------------------------------------------------------------
# Esta clase representa una tabla dentro de la base de datos.
#
# SQLAlchemy usa el concepto de ORM (Object Relational Mapping),
# que permite representar tablas como clases de Python
# y filas como objetos.