<div align="center">
  <img src="trucklylogo.png" alt="Truckly Logo" width="150"/>

  <h1>Truckly</h1>
  <p>Gestión inteligente y simplificada de flotas vehiculares empresariales.</p>
</div>

---

## 🚚 ¿Qué es Truckly?

**Truckly** es una plataforma web moderna para la gestión de flotas vehiculares orientada a pequeñas y medianas empresas. Su propósito es optimizar el control de vehículos corporativos, permitiendo llevar un registro detallado de:

- Conductores y usuarios del sistema.
- Vehículos disponibles y su historial.
- Asignaciones por período de tiempo.
- Mantenimientos preventivos y correctivos.

Todo esto mediante una interfaz intuitiva y segura, diferenciando el acceso y funciones por roles (administrador y conductor).

---

## 🧱 Arquitectura del Proyecto

Truckly se construye bajo una arquitectura moderna basada en tecnologías fullstack con tipado estático. A continuación se muestra el diagrama de componentes que detalla la interacción entre cada parte del sistema:

<img src="diagramauml.png" alt="Diagrama Arquitectura Truckly" width="100%"/>

### 🧩 Tecnologías utilizadas

| Capa         | Tecnología              | Descripción |
|--------------|--------------------------|-------------|
| Frontend     | React + Vite             | Interfaz moderna con enrutamiento (TanStack Router) |
| Backend      | Hono + tRPC              | API tipo-safe, ligera y modular |
| Autenticación| BetterAuth               | Validación de sesiones y control de roles |
| Base de Datos| PostgreSQL + Drizzle ORM | Modelado relacional y migraciones tipadas |
| Validación   | Zod                      | Validación estricta de entradas (DTO) |

---

## 🧑‍💻 Funcionalidades Principales

### 👤 Para Administradores
- Registro de conductores y usuarios.
- Registro, edición y eliminación de vehículos.
- Asignación de vehículos a conductores.
- Gestión del historial de mantenimientos.

### 🚗 Para Conductores
- Visualización de su vehículo asignado.
- Acceso al historial de mantenimientos del vehículo.
- Consultar datos técnicos básicos del vehículo.

---

## ⚙️ Instalación y desarrollo

### Requisitos
- Node.js ≥ 18
- PostgreSQL ≥ 13
- pnpm o npm

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/vcntttt/truckly.git
cd truckly

# 2. Instala dependencias
pnpm install

# 3. Configura variables de entorno
cp .env.example .env
# Agrega tu DATABASE_URL y claves de BetterAuth

# 4. Ejecuta migraciones
npx drizzle-kit migrate

# 5. Inicia la app
pnpm dev
