# TaskFlow — Gestión de Tareas con IA

**TaskFlow** es una aplicación full-stack de gestión de tareas con un asistente conversacional impulsado por **Gemini 2.5 Flash** (Google AI). Creada como proyecto personal de estudio para explorar arquitecturas modernas, integración de IA generativa, RAG, y buenas prácticas de desarrollo full-stack.

> Proyecto en evolución constante — se añaden features, se refactoriza y se experimenta con nuevas tecnologías de forma continua.

---

## Features

### Gestion de Tareas
- CRUD completo de tareas (crear, leer, actualizar, eliminar)
- Marcar tareas como completadas/pendientes
- Fecha límite por tarea
- Asignación de etiquetas (tags) con colores personalizados
- Búsqueda y filtrado por tags

### Asistente de IA (Gemini 2.5 Flash)
- **Chat conversacional** — habla en lenguaje natural para crear tareas, consultar pendientes o preguntar sobre tu organización
- **RAG contextual** — la IA conoce tus tags, tareas recientes y resumen de actividad al responder
- **Sugerencia inteligente de etiquetas** — al crear una tarea manualmente, la IA sugiere tags relevantes según el título y descripción
- **Parsing de lenguaje natural** — escribe "reunión con equipo mañana a las 3pm" y la IA estructura la tarea automáticamente
- **Confirmación previa** — la IA solo planifica; el usuario revisa y confirma antes de crear

### Autenticacion y Seguridad
- Registro protegido con token secreto (`X-Signup-Token`)
- Login con JWT (HS256, expiración configurable)
- NextAuth.js para gestión de sesiones en el frontend
- Contraseñas hasheadas con bcrypt
- Interceptor de expiración de sesión (auto-logout en 401)

### Interfaz Moderna
- Diseño **dark-mode** con Tailwind CSS v4
- Sidebar responsiva (oculta en móvil, overlay toggle)
- Dashboard con resumen visual (completadas, pendientes, tags)
- Modal de edición y confirmación de eliminación
- Toasts con **sonner** para feedback de acciones
- Panel flotante de IA con tabs (Manual + Chat)

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Estilos** | Tailwind CSS v4 (CSS-based config) |
| **Autenticación** | NextAuth.js v4 + JWT |
| **Formularios** | react-hook-form + Zod |
| **Backend** | FastAPI (Python 3.10+) |
| **Base de Datos** | PostgreSQL + SQLAlchemy 2.0 + Alembic |
| **IA** | Google Gemini 2.5 Flash (`google-genai` SDK) |
| **HTTP Client** | Axios (frontend) |
| **Testing** | Vitest + Testing Library (frontend), pytest (backend) |

---

## Estructura del Proyecto

```
task_manager/
├── backend/                    # FastAPI (Python)
│   ├── alembic/                # Migraciones de base de datos
│   ├── config/                 # Configuración (DB, settings)
│   ├── models/                 # SQLAlchemy ORM (User, Task, Tag)
│   ├── repositories/           # Capa de acceso a datos
│   ├── routers/                # Endpoints de la API
│   ├── schemas/                # Pydantic (validación request/response)
│   ├── services/               # Lógica de negocio
│   ├── tests/                  # Tests unitarios e integración
│   └── utils/                  # JWT, logging, errores, dependencias
│
├── frontend/                   # Next.js (App Router)
│   ├── app/                    # Páginas y layouts
│   │   ├── (protected)/        # Rutas autenticadas
│   │   ├── login/              # Página de inicio de sesión
│   │   └── api/auth/           # NextAuth API route
│   ├── components/             # Componentes reutilizables
│   ├── hooks/                  # Custom hooks
│   ├── services/               # Llamadas a la API
│   ├── schemas/                # Validación Zod
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Utilidades (date, api, task-parser)
│
├── README.md                   # Este archivo
└── NEW_FEATURES_AND_NEXT_STEPS.md
```

---

## API Endpoints

Todas las rutas bajo el prefijo **`/api/v1`**.

### Autenticación y Usuarios

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/users/` | Crear usuario (requiere `X-Signup-Token`) | Token secreto |
| `GET` | `/users/` | Listar usuarios | No |
| `GET` | `/users/{id}` | Obtener usuario por ID | No |
| `GET` | `/users/email/{email}` | Obtener usuario por email | No |
| `POST` | `/users/token` | Login → JWT access token | No |

### Tareas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/tasks/` | Listar tareas del usuario (paginado) | JWT |
| `GET` | `/tasks/summary` | Resumen (completadas, pendientes, por tag) | JWT |
| `GET` | `/tasks/{id}` | Obtener tarea por ID | JWT |
| `POST` | `/tasks/` | Crear tarea (soporta `new_tag_names`) | JWT |
| `PATCH` | `/tasks/{id}` | Actualizar tarea (parcial) | JWT |
| `DELETE` | `/tasks/{id}` | Eliminar tarea | JWT |

### Etiquetas (Tags)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/tags/` | Listar etiquetas del usuario (paginado) | JWT |
| `GET` | `/tags/{id}` | Obtener etiqueta por ID | JWT |
| `POST` | `/tags/` | Crear etiqueta (find-or-create por nombre) | JWT |
| `PATCH` | `/tags/{id}` | Actualizar etiqueta (nombre y color) | JWT |
| `DELETE` | `/tags/{id}` | Eliminar etiqueta | JWT |

### Inteligencia Artificial

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/ai/parse-task` | Parsear texto libre → tarea estructurada | JWT |
| `POST` | `/ai/chat` | Chat conversacional con RAG | JWT |
| `POST` | `/ai/suggest` | Sugerir etiquetas según título/descripción | JWT |

---

## Roadmap / Proximos Pasos

### Corto Plazo
- [ ] Mejorar look & feel general (animaciones, transiciones, iconos)
- [ ] Refinar experiencia móvil en el panel de IA
- [ ] Añadir not found page y error pages personalizadas
- [ ] Skeleton loaders en lugar de texto "Cargando..."

### Mediano Plazo
- [ ] Arrastrar y soltar para reordenar tareas
- [ ] Vistas alternativas: calendario, kanban
- [ ] Filtros combinados (completadas, tags, fecha)
- [ ] Estadísticas visuales con gráficos (Chart.js o Recharts)
- [ ] Modo oscuro/claro configurable por el usuario
- [ ] Tareas recurrentes

### Largo Plazo
- [ ] Integración con Google Calendar / Outlook
- [ ] Notificaciones push y recordatorios
- [ ] Colaboración: compartir tareas con otros usuarios
- [ ] Versión mobile (React Native o PWA)
- [ ] Despliegue automatizado (Docker + CI/CD)
- [ ] Vector DB (ChromaDB / Pinecone) para RAG avanzado

---

## Decisiones de Arquitectura

- **FastAPI** por su rendimiento, documentación automática (Swagger/OpenAPI) y tipado con Pydantic
- **Separación en capas** (Routers → Services → Repositories → Models) para testabilidad y mantenibilidad
- **JWT sin estado** para autenticación escalable
- **RAG sin vector DB en v1**: el contexto se inyecta directamente en el prompt de Gemini (suficiente para el volumen actual de datos)
- **IA read-only**: el modelo solo planifica; el frontend ejecuta las acciones tras confirmación del usuario
- **Next.js App Router** para aprovechar Server Components y el sistema de layouts anidados
- **NextAuth.js** como solución madura y extensible para autenticación

---

## Instalacion Rapida

```sh
git clone https://github.com/kusahio/task_manager.git
cd task_manager
```

Luego sigue las instrucciones específicas en cada submódulo:

- **[backend/](./backend/)** → configuración de base de datos, migraciones y servidor API
- **[frontend/](./frontend/)** → variables de entorno, dependencias y servidor de desarrollo

> Todas las rutas con `TU_HOST_LOCAL` en esta documentación deben reemplazarse por la IP/puerto donde corra cada servicio en tu máquina (ej. `127.0.0.1:8000` para backend, `127.0.0.1:3000` para frontend). En producción se usan los dominios reales.

---

## Licencia

Proyecto personal de práctica — uso educativo y de referencia. Sin licencia formal.