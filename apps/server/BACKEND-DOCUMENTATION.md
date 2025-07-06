# 🛠️ Backend de Truckly

Este directorio contiene el backend de **Truckly**, una API robusta, modular y segura para la gestión de flotas vehiculares empresariales. Construida con **Hono** y **tRPC**, utiliza tipado estricto y migraciones versionadas con **Drizzle ORM** sobre **PostgreSQL**.

---

## 📂 Estructura de Carpetas

```bash
apps/server
├── drizzle
│   └── migrations/           # Migraciones SQL versionadas (Drizzle)
│       └── meta/             # Snapshots y journal de migraciones
├── drizzle.config.ts         # Configuración de Drizzle ORM
├── package.json              # Dependencias y scripts del backend
├── README.md                 # Este archivo de documentación
├── src/
│   ├── auth/                 # Lógica de autenticación y permisos
│   │   ├── auth-schema.ts
│   │   ├── auth.ts
│   │   └── permissions.ts
│   ├── context.ts            # Contexto de ejecución (usuario, sesión, etc.)
│   ├── db/                   # Base de datos: esquema, conexión y datos de prueba
│   │   ├── schema.ts
│   │   ├── seed.ts
│   │   └── server.ts
│   ├── index.ts              # Punto de entrada principal del backend
│   ├── routes/               # Definición de rutas y endpoints
│   │   ├── asignacionesadmin.ts
│   │   ├── asignaciones.ts
│   │   ├── seed.ts
│   │   ├── vehiculosadmin.ts
│   │   └── vehiculos.ts
│   ├── trpc/                 # Procedimientos y routers tRPC (API type-safe)
│   │   ├── core.ts
│   │   ├── procedures.ts
│   │   └── root.ts
│   └── trycatch.ts           # Middleware de manejo de errores
└── tsconfig.json             # Configuración TypeScript
```

---

## 🏗️ Principios y Tecnologías Clave

- **Hono:** Framework web minimalista, ultra rápido y fácil de escalar.
- **tRPC:** Definición de endpoints type-safe, evita desincronización entre backend y frontend.
- **Drizzle ORM:** Modelado relacional, migraciones SQL versionadas y tipadas para PostgreSQL.
- **BetterAuth:** Autenticación y autorización moderna, basada en sesiones JWT, control de roles.
- **Zod:** Validación estricta de datos en todos los endpoints.
- **TypeScript:** Código robusto, auto-documentado y libre de errores comunes de tipado.

---

## ⚡ Instalación y Ejecución Local

Para levantar el backend de Truckly en tu entorno local, sigue estos pasos:

1. **Instala las dependencias:**
    ```sh
    bun install
    ```

2. **Ejecuta el servidor en modo desarrollo:**
    ```sh
    bun run dev
    ```

3. Abre tu navegador y accede a:  
   [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Flujo de la API y Módulos Principales

- **src/index.ts:**  
  Punto de entrada. Inicializa el servidor, aplica middlewares (CORS, logging, manejo de errores) y monta los routers tRPC y las rutas REST.
- **src/auth/**  
  - `auth.ts`: Lógica de login, manejo de tokens y sesiones.
  - `permissions.ts`: Validación y autorización basada en roles (admin, conductor).
  - `auth-schema.ts`: Esquemas Zod para login y registro.
- **src/db/**  
  - `schema.ts`: Definición de tablas (usuarios, vehículos, asignaciones, mantenimientos, etc).
  - `seed.ts`: Script para cargar datos de prueba.
  - `server.ts`: Inicializa conexión a PostgreSQL.
- **src/routes/**  
  - Rutas para operaciones sobre vehículos, asignaciones y utilidades para administradores y conductores.
- **src/trpc/**  
  - `core.ts`: Inicialización de tRPC, configuración global.
  - `procedures.ts` y `root.ts`: Definición de procedimientos/routers agrupados por entidad y rol.

---

## 🔒 Seguridad y Autenticación

- **BetterAuth** protege todos los endpoints, exigiendo sesión activa y rol autorizado.
- Todas las rutas de administración requieren privilegios de admin.
- Las rutas para conductores filtran datos por usuario autenticado.
- Validación de entrada/salida estricta con **Zod** para evitar datos malformados o inseguros.

---

## 🗄️ Migraciones y Modelado de Datos

- Las migraciones están bajo `drizzle/migrations/`, ordenadas y versionadas.
- Cada archivo SQL corresponde a cambios incrementales en el modelo de datos.
- El directorio `meta/` almacena snapshots del esquema para rollback y control de versiones.
- Usa el comando `bunx run db:push` para aplicar migraciones y `bunx run db:seed` para datos de ejemplo.

---

## 🧑‍💻 Desarrollo y Testing

- Todas las rutas y procedimientos se testean usando datos de prueba del seed.
- Se recomienda usar un entorno local con PostgreSQL y las variables de entorno adecuadas (`.env`).
- **Hot reload** habilitado para cambios rápidos durante desarrollo (`bun run server:dev`).

---

## 🚀 Despliegue

- Backend listo para desplegar en cualquier plataforma Node.js o Bun compatible.
- Requiere variables de entorno seguras (`.env`) para conexión a DB y claves de autenticación.
- Recomendado usar junto a un reverse proxy (Nginx) y TLS para producción.

---

## 📖 Recursos Útiles

- [Documentación de Hono](https://honojs.dev/)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [BetterAuth Docs](https://betterauth.dev/)
- [Zod Docs](https://zod.dev/)

---

> Para dudas o contribuciones, revisa el [README principal](../../README.md) o abre un issue en el repositorio.