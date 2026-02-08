# Backend — Task Manager API

Este directorio contiene la API backend desarrollada con **FastAPI (Python)**. Provee autenticación, gestión de usuarios y operaciones CRUD de tareas.

---

## Technologías usadas

- FastAPI
- Python 3.10+
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication
- CORS Middleware

---

## Instalación

Desde la raíz del proyecto:

```sh
cd backend
```

Crear un entorno virtual:

```sh
python -m venv .venv
```

Activarlo:

```sh
source .venv/bin/activate     # macOS / Linux
.venv\Scripts\activate        # Windows
```

Instalar dependencias:

```sh
pip install -r requirements.txt
```

---

## Variables de Entorno

Crear un archivo .env:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager
JWT_SECRET=tu_llave_secreta
```

---

## Migraciones de Base de Datos

Ejecutar migraciones con Alembic:

```sh
alembic upgrade head
```

---

## Ejecutar la API

```sh
uvicorn main:app --reload
```

La API estará disponible en:

```
http://localhost:8000
```

Documentación Swagger:

```
http://localhost:8000/docs
```

---

## Endpoints Principales

- POST `/auth/login`
- POST `/auth/register`
- GET `/tasks`
- POST `/tasks`
- PUT `/tasks/{id}`
- DELETE `/tasks/{id}`

---

## Decisiones de Arquitectura

- FastAPI por su rendimiento y documentación automática
- JWT para autenticación sin estado
- SQLAlchemy + Alembic para la gestión de base de dato
- Separación clara entre routers, servicios y modelos

---

## Notas de Seguridad

- Nunca subir archivos .env al repositorio
- Usar claves seguras en producción
- Forzar HTTPS en entornos productivos
