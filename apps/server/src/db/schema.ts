import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const vehiculos = pgTable("vehiculos", {
  id: serial("id").primaryKey(),
  patente: text("patente").notNull().unique(),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  year: integer("year").notNull(),
  tipo: text("tipo").notNull(),
  kilometraje: integer("kilometraje").notNull().default(0),
  fueraServicio: boolean("fuera_servicio").notNull().default(false),
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
