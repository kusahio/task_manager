# TaskFlow — Gestión de Tareas con IA

**Proyecto personal enfocado en explorar integración de IA generativa en aplicaciones web, experimentación con RAG (Retrieval-Augmented Generation) y buenas prácticas de desarrollo full-stack.**

El proyecto toma como caso de estudio un sistema de gestión de tareas para experimentar con la integración de modelos de lenguaje (Gemini 2.5 Flash) en una aplicación web real, combinando técnicas de RAG, parsing de lenguaje natural y generación estructurada de datos.

Su objetivo principal no es construir el gestor de tareas mas completo, sino utilizar un dominio funcional simple para explorar como la IA generativa puede integrarse en aplicaciones web, como diseñar sistemas que combinen interacción conversacional con operaciones transaccionales, y que decisiones de arquitectura facilitan esta integración.

Cada nueva funcionalidad de IA se incorpora unicamente cuando permite explorar un nuevo concepto — RAG contextual, generación estructurada con `response_schema`, coherencia conversacional, sugerencia inteligente de datos.

Actualmente utiliza **FastAPI**, **Next.js 16 (App Router)**, **PostgreSQL**, **SQLAlchemy 2.0**, **Gemini 2.5 Flash**, **NextAuth.js** y **Tailwind CSS v4**.

Implementa una arquitectura en capas (Routers → Services → Repositories) con un asistente conversacional que comprende el contexto del usuario (sus tareas, etiquetas y actividad) y puede planificar la creación de tareas mediante lenguaje natural.

---

## ¿Por qué existe este proyecto?

Este proyecto nace para explorar preguntas que surgen al integrar IA generativa en aplicaciones web tradicionales.

**Más que implementar features de IA, el objetivo fue entender como la integración de modelos de lenguaje influye en la arquitectura, el flujo de datos y la experiencia de usuario de una aplicación existente.**

Los principales objetivos fueron:

- Diseñar una integración de IA que sea útil pero no intrusiva — el usuario mantiene el control, la IA asiste, no decide.
- Implementar RAG (Retrieval-Augmented Generation) sin infraestructura compleja: inyectar contexto del usuario directamente en el prompt del modelo.
- Explorar la generación estructurada de datos con `response_schema` de Gemini para obtener respuestas predecibles y tipadas desde un modelo de lenguaje.
- Combinar interacción conversacional (chat) con operaciones transaccionales (CRUD) en un flujo coherente de confirmación antes de ejecutar.
- Diseñar una experiencia donde el usuario pueda elegir entre interfaz manual y asistencia conversacional según su preferencia.
- Experimentar con diferentes técnicas de prompting: roles del sistema, few-shot examples, resolución de fechas relativas, protección contra inyección de prompts.

El proyecto continúa evolucionando como un espacio para probar nuevos proveedores de IA, técnicas de RAG más avanzadas y mejorar la calidad de las interacciones conversacionales.

---

## Preguntas que buscaba responder

Durante el desarrollo del proyecto me propuse responder preguntas como:

- ¿Cómo integrar un modelo de lenguaje en una aplicación web existente sin reescribir la arquitectura?
- ¿Cómo implementar RAG sin depender de una base de datos vectorial?
- ¿Cómo obtener datos estructuralmente predecibles desde un modelo de lenguaje?
- ¿Cómo diseñar un flujo conversacional que pueda derivar en acciones transaccionales (crear tareas, asignar etiquetas)?
- ¿Cómo mantener la coherencia en una conversación con contexto variable (las tareas del usuario cambian entre mensajes)?
- ¿Cuándo conviene que la IA ejecute directamente y cuándo debe pedir confirmacion?
- ¿Cómo sugerir datos relevantes (etiquetas, categorias) sin depender exclusivamente del modelo?
- ¿Cómo estructurar el prompt para equilibrar flexibilidad y precision?

---

## Enfoque del proyecto

Aunque el dominio funcional es un gestor de tareas, el foco principal del proyecto esta en la **integración de IA generativa y las decisiones de arquitectura que la hacen posible**, no en la implementación de funcionalidades de gestion.

Cada nueva funcionalidad de IA se incorpora únicamente cuando permite explorar un nuevo concepto técnico, validar una decisión de diseño o mejorar la comprensión de como los modelos de lenguaje pueden integrarse en aplicaciones web.

---

## Principios del proyecto

Durante el desarrollo intento mantener algunas decisiones constantes:

- La IA asiste, el usuario decide — toda acción transaccional requiere confirmación explícita.
- Preferir soluciones simples antes que abstracciones innecesarias.
- Mantener la IA como una capa desacoplada que puede reemplazarse por otro proveedor sin modificar el resto del sistema.
- El contexto del usuario (RAG) debe ser relevante y actualizado, pero sin saturar el prompt con información redundante.
- La generación estructurada es preferible al parsing de texto libre — `response_schema` de Gemini permite contratos claros entre el modelo y la aplicación.
- El codigo debe ser legible y facil de modificar para experimentar con nuevas técnicas de prompting y RAG.

---

## Funcionalidades de IA implementadas

### Chat conversacional con RAG (`POST /ai/chat`)

El asistente conversacional conoce el contexto del usuario en cada interacción:

- **Etiquetas del usuario**: nombres y colores de todas sus etiquetas.
- **Tareas recientes**: las 10 tareas mas recientes con su estado y etiquetas.
- **Resumen de actividad**: total de tareas completadas y pendientes.

Con esta información inyectada en el prompt del sistema, el modelo puede:

- Responder preguntas como "¿qué tengo pendiente para hoy?" o "muéstrame las tareas con la etiqueta trabajo".
- Planificar la creación de una o varias tareas a partir de lenguaje natural: "agenda reunión con el equipo para mañana a las 3pm y asígnale la etiqueta trabajo".
- Devolver una estructura JSON predecible usando `response_schema` de Gemini con tipo `ChatAction` (`create_tasks` o `none`) y datos de tareas (`TaskPreview`).

**El asistente es read-only**: solo planifica acciones. El frontend muestra una tarjeta de confirmación con los datos estructurados y el usuario decide si ejecutar.

### Sugerencia inteligente de etiquetas (`POST /ai/suggest`)

Dado un titulo y descripción de tarea, el modelo sugiere hasta 5 etiquetas relevantes, indicando cuales ya existen en la base de datos del usuario y cuales son nuevas sugerencias.

Esto permite una experiencia fluida donde el usuario puede crear etiquetas sobre la marcha sin interrumpir el flujo de creación de tareas.

### Parsing de lenguaje natural (`POST /ai/parse-task`)

Convierte texto libre en una tarea estructurada:

```
Input:  "reunión con equipo mañana a las 3pm urgente"
Output: { title: "Reunión con equipo",
          description: "Urgente",
          deadline: "2026-07-16T15:00:00",
          tags: ["trabajo"] }
```

Incluye resolución de fechas relativas ("mañana", "pasado mañana", "el viernes") y protección contra inyección de prompts.

---

## Arquitectura de integración de IA

```
Frontend (Next.js)                  Backend (FastAPI)
┌─────────────────────┐           ┌──────────────────────┐
│  AIChatPanel        │  POST     │  /ai/chat            │
│  ┌───────────────┐  │  /ai/chat ├──────────────────────┤
│  │ Tab Manual    │──┼──────────►│  ai_service.py       │
│  │ (formulario)  │  │           │  ┌────────────────┐  │
│  └───────────────┘  │           │  │ 1. Obtener     │  │
│  ┌───────────────┐  │           │  │    contexto     │  │
│  │ Tab IA        │  │           │  │    del usuario  │  │
│  │ (chat)        │  │           │  │    (RAG)        │  │
│  │  ┌─────────┐  │  │           │  ├────────────────┤  │
│  │  │ Mensajes│  │  │           │  │ 2. Construir   │  │
│  │  │ → API   │──┼──────────────►│    prompt con    │  │
│  │  │ ← Resp. │  │  │           │    system +      │  │
│  │  │ ← Action│  │  │           │    context +      │  │
│  │  └────┬────┘  │  │           │    historial      │  │
│  │       │       │  │           ├────────────────┤  │
│  │  ┌────▼────┐  │  │           │ 3. Gemini 2.5  │  │
│  │  │Confirmar │  │  │           │    Flash       │  │
│  │  │ → PATCH │  │  │           │    + response  │  │
│  │  │   tasks/ │  │  │           │    schema      │  │
│  │  └─────────┘  │  │           └────────────────┘  │
│  └───────────────┘  │           └──────────────────────┘
```

### Flujo de una interacción típica

1. El usuario escribe en lenguaje natural: "Crea una tarea para comprar víveres mañana y asígnale la etiqueta personal".
2. El frontend envía el historial de mensajes a `POST /ai/chat`.
3. El servicio `ai_service.chat_with_ai()`:
   - Consulta la base de datos para obtener el contexto del usuario (RAG).
   - Construye un prompt de sistema con las etiquetas disponibles, tareas recientes y resumen.
   - Envía el prompt + historial a Gemini con un `response_schema` que fuerza una estructura `ChatAction`.
4. Gemini devuelve un `ChatResponse` con `action.type: "create_tasks"` y los datos de la tarea.
5. El frontend recibe la respuesta, muestra el mensaje de la IA y una tarjeta de "Vista previa" con los datos estructurados.
6. El usuario hace clic en "Confirmar" y el frontend ejecuta `POST /tasks/` con los datos.
7. La lista de tareas se actualiza automaticamente.

---

## Stack tecnológico

| Capa | Tecnolog+ia | Propósito |
|------|-----------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript | UI con Server y Client Components |
| Estilos | Tailwind CSS v4 | Diseño utilitario, dark-mode |
| Autenticación | NextAuth.js v4 + JWT | Sesiones sin estado |
| Backend | FastAPI 0.128 (Python 3.10+) | API REST con validación automática |
| Base de datos | PostgreSQL + SQLAlchemy 2.0 + Alembic | ORM con migraciones versionadas |
| IA | Gemini 2.5 Flash (google-genai SDK) | Modelo de lenguaje para chat y sugerencias |
| RAG | Contexto inyectado en prompt (sin vector DB) | Retrieval-Augmented Generation v1 |
| Testing | Vitest + Testing Library (frontend), pytest (backend) | Tests unitarios y de integración |

---

## API Endpoints

Todas las rutas bajo el prefijo **`/api/v1`**.

### IA (foco principal del proyecto)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/ai/chat` | Chat conversacional con RAG — contexto del usuario + Gemini | JWT |
| `POST` | `/ai/suggest` | Sugerir etiquetas según título/descripción | JWT |
| `POST` | `/ai/parse-task` | Parsear texto libre a tarea estructurada | JWT |

### Tareas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/tasks/` | Listar tareas (paginado) | JWT |
| `GET` | `/tasks/summary` | Resumen completadas/pendientes/por-tag | JWT |
| `GET` | `/tasks/{id}` | Obtener tarea por ID | JWT |
| `POST` | `/tasks/` | Crear tarea (soporta `new_tag_names`) | JWT |
| `PATCH` | `/tasks/{id}` | Actualizar tarea (parcial) | JWT |
| `DELETE` | `/tasks/{id}` | Eliminar tarea | JWT |

### Etiquetas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/tags/` | Listar etiquetas (paginado) | JWT |
| `GET` | `/tags/{id}` | Obtener etiqueta por ID | JWT |
| `POST` | `/tags/` | Crear etiqueta (find-or-create por nombre) | JWT |
| `PATCH` | `/tags/{id}` | Actualizar etiqueta | JWT |
| `DELETE` | `/tags/{id}` | Eliminar etiqueta | JWT |

### Autenticacion

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/users/` | Crear usuario (requiere `X-Signup-Token`) | Token secreto |
| `POST` | `/users/token` | Login → JWT access token | No |

---

## Decisiones de diseño en integración de IA

### 1. RAG sin base de datos vectorial (v1)

El contexto del usuario se inyecta directamente en el prompt del sistema en lugar de usar un vector DB (ChromaDB, Pinecone).

**Razón:** Para el volumen actual de datos de un usuario individual (decenas de tareas, algunas etiquetas), el contexto completo cabe en el prompt sin superar los limites de tokens de Gemini. Esto simplifica la infraestructura y permite iterar rápido.

**Trade-off:** A medida que crezca el volumen de datos, se necesitará un sistema de recuperación más sofisticado (embeddings + busqueda vectorial).

### 2. IA read-only con confirmación del usuario

El asistente conversacional jamás escribe en la base de datos. Solo devuelve una estructura de datos (`ChatAction`) que el frontend muestra al usuario para confirmación antes de ejecutar.

**Razon:** El usuario mantiene el control total. La IA puede alucinar o malinterpretar; la confirmación previa evita acciones no deseadas sin necesidad de un sistema de deshacer complejo.

### 3. Generación estructurada con `response_schema`

Gemini 2.5 Flash soporta `response_schema`, que permite definir un esquema Pydantic para la respuesta. Esto elimina la necesidad de parsear texto libre y garantiza que la respuesta del modelo sea estructuralmente predecible.

**Ejemplo:** El `ChatAction` define `type: Literal["create_tasks", "none"]` y `data: Optional[CreateTasksData]`. El modelo solo puede devolver una de estas dos opciones con la estructura exacta definida.

### 4. Arquitectura en capas con servicio de IA desacoplado

El servicio `ai_service.py` es independiente del proveedor de IA. Cambiar de Gemini a OpenAI o a un modelo local requiere modificar solo este archivo.

```
Routers → Services → Repositories → Models (SQLAlchemy)
                ↕
          ai_service.py (Gemini)
          - chat_with_ai()
          - suggest_tags()
          - parse_task_with_ai()
          - _get_user_context()
```

### 5. Etiquetas como punto de integración IA-CRUD

Las etiquetas (tags) son el puente entre la IA y el sistema transaccional:

- La IA sugiere etiquetas nuevas o existentes cuando planifica tareas.
- El schema `TaskCreate` acepta `new_tag_names` para crear etiquetas sobre la marcha.
- El servicio `task_service.create_task()` resuelve nombres a IDs (find-or-create) antes de persistir.

---

## Estructura del proyecto

```
task_manager/
├── backend/
│   ├── routers/
│   │   ├── ai.py              # /ai/chat, /ai/suggest, /ai/parse-task
│   │   ├── task.py, tag.py, user.py
│   ├── services/
│   │   ├── ai_service.py      # Gemini integration + RAG + prompting
│   │   ├── task_service.py    # CRUD + resolución de new_tag_names
│   │   ├── tag_service.py     # Find-or-create por nombre
│   ├── schemas/
│   │   ├── ai.py              # ChatMessageSchema, ChatResponse, ChatAction, TaskPreview
│   │   ├── task.py, tag.py, user.py
│   ├── repositories/          # Acceso a datos (SQLAlchemy)
│   └── models/                # ORM (User, Task, Tag)
│
├── frontend/
│   ├── components/
│   │   └── AIChat/            # Panel flotante con tabs Manual + IA
│   ├── hooks/
│   │   ├── useAIChat.ts       # Estado del chat, confirmacion, sugerencias
│   │   ├── useTaskForm.ts     # Formulario de edición con parsing IA
│   ├── services/
│   │   └── ai.ts              # chatWithAI, suggestTaskData
│   └── types/
│       └── ai.ts              # ChatResponse, TaskPreview, TagSuggestionItem
```

---

## Aprendizajes obtenidos

El desarrollo del proyecto me permitió profundizar especialmente en:

- integración de modelos de lenguaje en aplicaciones web reales con arquitectura desacoplada.
- técnicas de prompting para generación estructurada de datos con `response_schema`.
- Diseño de flujos conversacionales que derivan en acciones transaccionales con confirmación.
- Implementación de RAG contextual sin infraestructura compleja.
- Resolución de fechas relativas y protección contra inyección de prompts.
- Coexistencia de interfaz manual y conversacional para un mismo dominio funcional.
- Manejo de estado conversacional en el frontend con mensajes, acciones pendientes y confirmación.

---

## Roadmap / Proximos pasos

### Experimentación con IA

- [ ] Probar otros proveedores (OpenAI, Claude, DeepSeek via OpenRouter) y comparar calidad de respuestas.
- [ ] Implementar RAG con embeddings y busqueda vectorial (ChromaDB) para contexto mas grande.
- [ ] Agregar memoria conversacional persistente (la conversación se retoma entre sesiones).
- [ ] Permitir que la IA edite y elimine tareas (actualmente solo crea).
- [ ] Mejorar la coherencia en conversaciones multi-turno con resumen intermedio del contexto.

### Funcionalidades generales

- [ ] Arrastrar y soltar para reordenar tareas.
- [ ] Vistas alternativas: calendario, kanban.
- [ ] Filtros combinados (completadas, etiquetas, fecha).
- [ ] Estadisticas visuales con gráficos.
- [ ] Modo oscuro/claro configurable.
- [ ] Tareas recurrentes.

### Infraestructura

- [ ] integración con Google Calendar / Outlook.
- [ ] Notificaciones push y recordatorios.
- [ ] Version mobile (PWA).
- [ ] Despliegue automatizado (Docker + CI/CD).
- [ ] Migrar a RAG con base de datos vectorial para produccion.

---

## Licencia

Proyecto personal desarrollado con fines de aprendizaje, experimentación y referencia.

Actualmente no cuenta con una licencia de código abierto específica.