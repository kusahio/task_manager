# Backend — TaskFlow API

API RESTful desarrollada con **FastAPI (Python)**. Proporciona autenticación JWT, CRUD de tareas y etiquetas, e integración con **Gemini 2.5 Flash** para funcionalidades de IA conversacional.

---

## Tecnologías

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| FastAPI | 0.128.0 | Framework web |
| SQLAlchemy | 2.0.45 | ORM |
| Alembic | 1.17.2 | Migraciones |
| PostgreSQL | — | Base de datos |
| Pydantic | 2.12.5 | Validación de datos |
| python-jose | 3.5.0 | JWT |
| bcrypt / passlib | — | Hashing de contraseñas |
| google-genai | 2.11.0 | Gemini AI SDK |
| loguru | 0.7.3 | Logging |
| pytest | 9.0.2 | Testing |

---

## Requisitos

- Python 3.10+
- PostgreSQL

---

## Instalación

```sh
cd backend
python -m venv .venv

# Activar:
# macOS / Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

## Variables de Entorno

Crear archivo `.env` en la raíz de `backend/`:

```env
# Database
DB_USER=TU_USUARIO_POSTGRES
DB_PASSWORD=TU_PASSWORD_SEGURA
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=task_manager

# JWT
SECRET_KEY=GENERA_UNA_CLAVE_SEGURA_HEX
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Security
SIGNUP_SECRET_KEY=CLAVE_SECRETA_PARA_REGISTRO

# CORS — origen del frontend (reemplazar con tu URL local)
LOCALHOST_ORIGIN=http://127.0.0.1:3000

# AI
GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
```

## Base de Datos

Crear la base de datos en PostgreSQL:

```sh
createdb task_manager
```

Ejecutar migraciones:

```sh
alembic upgrade head
```

(Si es una instalación limpia, todas las migraciones se aplicarán secuencialmente.)

## Ejecutar (Entorno Local)

```sh
uvicorn main:app --reload
```

Una vez iniciado, la API responde en las siguientes rutas (reemplazar con tu host local):

| Recurso | URL |
|---------|-----|
| API | `http://TU_HOST_LOCAL:8000` |
| Swagger UI | `http://TU_HOST_LOCAL:8000/docs` |
| OpenAPI JSON | `http://TU_HOST_LOCAL:8000/openapi.json` |

> Ejemplo: si tu servidor corre en `127.0.0.1:8000`, la API queda en `http://127.0.0.1:8000`. En producción se usa un dominio real (ej. `https://api.misitio.com`).

## Tests

```sh
pytest -v
```

## Endpoints

Ver la [documentación principal](../README.md#-api-endpoints) para la lista completa.

## Arquitectura

```
Routers  →  Services  →  Repositories  →  Models (SQLAlchemy)
   │            │              │
   └────────────┴──────────────┴── Schemas (Pydantic)
```

- **Routers**: definen rutas HTTP y dependencias (auth)
- **Services**: lógica de negocio, integración con IA
- **Repositories**: consultas a base de datos (SQLAlchemy)
- **Models**: tablas y relaciones ORM
- **Schemas**: validación de entrada/salida con Pydantic

## Seguridad

- `.env` no debe subirse al repositorio (está en `.gitignore`)
- Usar claves JWT seguras en producción
- El `SIGNUP_SECRET_KEY` protege el registro de nuevos usuarios
- Forzar HTTPS en entornos productivos
