import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const vehiculos = pgTable("vehiculos", {
  id: serial("id").primaryKey(),
  patente: text("patente").notNull().unique(),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  year: integer("year").notNull(),
  tipo: text("tipo").notNull(),
});

export const asignaciones = pgTable("asignaciones", {
  id: serial("id").primaryKey(),
  vehiculoId: integer("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  conductorId: text("conductor_id").notNull(),
  status: text("status").notNull(),
  fechaAsignacion: timestamp("fecha_asignacion", {
    withTimezone: true,
  }).defaultNow(),
  motivo: text("motivo").notNull(),
});
