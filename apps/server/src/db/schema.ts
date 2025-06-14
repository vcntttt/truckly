import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Tabla de vehículos
export const vehiculos = pgTable("vehiculos", {
    id: serial("id").primaryKey(),
    patente: text("patente").notNull().unique(),
    marca: text("marca").notNull(),
    modelo: text("modelo").notNull(),
    year: integer("year").notNull(),
    tipo: text("tipo").notNull(),
    proximoMantenimiento: timestamp("proximo_mantenimiento", { withTimezone: true }).notNull(),
});

// Tabla de asignaciones
export const asignaciones = pgTable("asignaciones", {
    id: serial("id").primaryKey(),
    vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
    conductorId: text("conductor_id").notNull(), // ID del usuario proporcionado por BetterAuth
    status: text("status", {
        enum: ['pendiente', 'en progreso', 'completada', 'cancelada'],
    }).notNull(),
    fechaAsignacion: timestamp("fecha_asignacion", { withTimezone: true }).defaultNow(),
    motivo: text("motivo").notNull(),
});