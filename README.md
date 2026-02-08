# 📝 Task Manager

Aplicación full-stack de gestión de tareas construida con **FastAPI (Python)** en el backend y **Next.js (App Router + TypeScript)** en el frontend. El proyecto utiliza **autenticación basada en JWT**, **PostgreSQL** y prácticas modernas de desarrollo.

---

## Descripción del Proyecto

Este proyecto es un sistema completo de gestión de tareas que permite a los usuarios:

- Registrarse y autenticarse de forma segura  
- Crear, leer, actualizar y eliminar tareas  
- Acceder a recursos protegidos mediante autenticación JWT  
- Interactuar con una interfaz de usuario moderna y responsiva  

El objetivo del proyecto es demostrar una arquitectura full-stack real, con una clara separación de responsabilidades entre frontend y backend.

---

## Estructura del Proyecto

```
task_manager/
├── backend/        # Backend desarrollado con FastAPI
├── frontend/       # Frontend desarrollado con Next.js
└── README.md       # Documentación principal del proyect
```

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- NextAuth.js
- Tailwind CSS

### Backend
- FastAPI
- Python
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT Authentication

---

## Requerimientos

- Node.js
- Python 3.10+
- PostgreSQL

---

## Instalación

Clonar el repositorio:

```sh
git clone https://github.com/kusahio/task_manager.git
cd task_manager
```

Luego, sigue las instrucciones específicas en cada módulo:

- `frontend/README.md`
- `backend/README.md`

---

## Notas

- El frontend y el backend están completamente desacoplados.
- Cada parte puede ejecutarse y desplegarse de forma independiente.
- Ambos servicios requieren configuración de variables de entorno.

---

## Licencia

Licencia MIT.
Si reutilizas o adaptas este proyecto, se agradece dar crédito al autor.