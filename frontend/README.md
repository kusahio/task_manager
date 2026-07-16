# Frontend — TaskFlow App

Aplicación web construida con **Next.js 16 (App Router)**, **React 19** y **TypeScript**. Proporciona una interfaz moderna para la gestión de tareas con un asistente de IA integrado.

---

## Tecnologías

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| Next.js | 16.1.1 | Framework React (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios (CSS-based config) |
| NextAuth.js | 4.24.13 | Autenticación con JWT |
| react-hook-form | 7.71.1 | Manejo de formularios |
| Zod | 4.3.5 | Validación de esquemas |
| Axios | 1.13.2 | HTTP client |
| sonner | 2.0.7 | Toast notifications |
| react-markdown | 10.1.0 | Renderizado de markdown en chat IA |
| Vitest | 4.1.9 | Tests unitarios |

---

## Requisitos

- Node.js 18+
- Backend en ejecución (ver [backend/](../backend/))

---

## Instalación

```sh
cd frontend
npm install
```

## Variables de Entorno

Crear archivo `.env` en la raíz de `frontend/`:

```env
# Clave para cifrar cookies de sesión (NextAuth)
NEXTAUTH_SECRET=GENERA_UNA_CLAVE_ALEATORIA_SEGURA

# URL base de la app (reemplazar con tu host local)
NEXTAUTH_URL=http://TU_HOST_LOCAL:3000

# URL base de la API backend (reemplazar con tu host local)
NEXT_PUBLIC_BACKEND_URL=http://TU_HOST_LOCAL:8000/api/v1
```

| Variable | Descripción |
|----------|-------------|
| `NEXTAUTH_SECRET` | Clave para cifrar cookies de sesión (NextAuth) |
| `NEXTAUTH_URL` | URL base de la aplicación (para callbacks de NextAuth) |
| `NEXT_PUBLIC_BACKEND_URL` | URL base de la API backend (expuesta al cliente) |

## Ejecutar (Entorno Local)

```sh
npm run dev
```

La aplicación queda disponible en la URL que muestre la terminal (por defecto `http://TU_HOST_LOCAL:3000`).

> Ejemplo: si el servidor corre en `127.0.0.1:3000`, la app se visita en `http://127.0.0.1:3000`. En producción se usa un dominio real (ej. `https://misitio.com`).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest) |
| `npm run test:watch` | Tests en modo watch |

## Tests

```sh
npm test
```

Los tests usan **Vitest** con **Testing Library** y **jsdom**.

## Estructura del Código

```
src/
├── app/                    # Páginas y layouts (App Router)
│   ├── (protected)/        # Rutas que requieren autenticación
│   │   ├── dashboard/      # Resumen de actividad
│   │   ├── tasks/          # CRUD de tareas + panel IA
│   │   └── tags/           # Gestión de etiquetas
│   ├── login/              # Inicio de sesión
│   └── api/auth/           # NextAuth route handler
├── components/             # Componentes reutilizables
│   ├── ui/                 # Button, Modal, Sidebar, etc.
│   └── AIChat/             # Panel flotante de IA
├── hooks/                  # Custom hooks (useTasks, useAIChat, etc.)
├── services/               # Llamadas a la API (task, tag, auth, ai)
├── schemas/                # Validación Zod
├── types/                  # Interfaces TypeScript
└── utils/                  # Utilidades (date, api, task-parser)
```

## Flujo de Autenticación

1. Usuario ingresa email y contraseña en `/login`
2. NextAuth envía credenciales a `POST /api/v1/users/token`
3. Backend devuelve JWT `access_token`
4. NextAuth almacena el token en una cookie JWT cifrada
5. El interceptor de Axios inyecta `Authorization: Bearer <token>` en cada petición
6. Si el backend responde 401, se cierra la sesión automáticamente

## Notas

- El backend debe estar corriendo para que la aplicación funcione
- El panel de IA requiere una API key de Gemini configurada en el backend
- Las rutas protegidas redirigen a `/login` si no hay sesión activa
