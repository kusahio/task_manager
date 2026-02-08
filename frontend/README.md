# Frontend — Task Manager

Este directorio contiene la aplicación frontend construida con **Next.js (App Router)** y **TypeScript**, utilizando **NextAuth.js** para autenticación y **Tailwind CSS** para los estilos.

---

## Tecnologías Utilizadas

- **Next.js (App Router)**  
  Sistema de ruteo moderno con server y client components.

- **TypeScript**  
  Tipado estático para mejor mantenibilidad y experiencia de desarrollo.

- **NextAuth.js**  
  Gestión de autenticación y sesiones integrada con JWT.

- **Tailwind CSS**  
  Framework CSS utilitario para una UI responsive.

- **Fetch / Axios**  
  Comunicación con la API backend desarrollada en FastAPI.

---

## Flujo de Autenticación

- El usuario inicia sesión mediante un formulario
- NextAuth gestiona la sesión
- El token JWT es recibido desde el backend
- Las rutas protegidas dependen del estado de la sesión

---

## Instalación

Desde la raíz del proyecto:

```sh
cd frontend
npm install
```

---

## Servidor de Desarrollo

```sh
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:3000
```

---

## Decisiones de Arquitectura

- Next.js App Router para un ruteo escalable
- NextAuth.js para centralizar la lógica de autenticación
- Autenticación basada en JWT para integrarse con un backend externo
- Separación clara entre capas de UI y API

---

## Notas

- El backend debe estar en ejecución para autenticación y operaciones de tareas
- Se requieren variables de entorno para la configuración de NextAuth