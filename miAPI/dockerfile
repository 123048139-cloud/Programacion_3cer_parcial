FROM python:3.12-slim

# Crear carpeta de trabajo
WORKDIR /app

# Copiar requerimientos e instalarlos
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la app
COPY ./app ./app

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
