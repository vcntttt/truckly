import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// 🚗 Tabla: Vehículos
export const vehiculos = pgTable("vehiculos", {
    id: serial("id").primaryKey(),
    patente: text("patente").notNull().unique(),
    marca: text("marca").notNull(),
    modelo: text("modelo").notNull(),
    anio: integer("anio").notNull(),
    tipo: text("tipo").notNull(), // Ej: camión, van, etc.
});

// 📄 Tabla: Asignaciones
export const asignaciones = pgTable("asignaciones", {
    id: serial("id").primaryKey(),
    vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
    conductor: text("conductor").notNull(),
    fechaAsignacion: timestamp("fecha_asignacion", { withTimezone: true }).defaultNow(),
});

// 🔧 Tabla: Mantenimientos
export const mantenimientos = pgTable("mantenimientos", {
    id: serial("id").primaryKey(),
    vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
    descripcion: text("descripcion").notNull(),
    fecha: timestamp("fecha", { withTimezone: true }).defaultNow(),
    kilometraje: integer("kilometraje").notNull(),
});
