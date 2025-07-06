import { tryCatch } from "../trycatch";
import { z } from "zod";
import { router } from "../trpc/core";
import { adminProcedure } from "../trpc/procedures";
import { vehiculos } from "../db/schema";
import { db } from "../db/server";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Esquema base para crear vehículos
const vehiculoSchema = z.object({
  patente: z.string().max(10),
  marca: z.string().max(50),
  modelo: z.string().max(50),
  year: z.number().int(),
  tipo: z.string().max(50),
  kilometraje: z.number().min(0).default(0),
  fueraServicio: z.boolean().default(false),
});

// Para actualizar: incluye ID
const vehiculoUpdateSchema = vehiculoSchema.extend({
  id: z.number().int(),
});

// Para eliminar: solo ID
const vehiculoDeleteSchema = z.object({
  id: z.number().int(),
});

export const vehiculosAdminRouter = router({
  // Obtener todos los vehículos (solo admin)
  getAll: adminProcedure.query(async () => {
    const { data: rows, error } = await tryCatch(
      db.select().from(vehiculos)
    );
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error obteniendo vehículos",
      });
    }
    return rows;
  }),

  // Crear un nuevo vehículo
  create: adminProcedure.input(vehiculoSchema).mutation(async ({ input }) => {
    const { data: result, error } = await tryCatch(
      db.insert(vehiculos).values(input).returning()
    );
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creando el vehículo",
      });
    }
    return { message: "Vehículo creado exitosamente", data: result[0] };
  }),

  // Actualizar un vehículo existente
  update: adminProcedure
    .input(vehiculoUpdateSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof vehiculoUpdateSchema> }) => {
        const { id, ...data } = input;
        const { data: result, error } = await tryCatch(
          db
            .update(vehiculos)
            .set({
              ...data,
            })
            .where(eq(vehiculos.id, id))
            .returning()
        );
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error actualizando el vehículo",
          });
        }
        return {
          message: "Vehículo actualizado exitosamente",
          data: result[0],
        };
      }
    ),

  // Eliminar un vehículo
  delete: adminProcedure
    .input(vehiculoDeleteSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof vehiculoDeleteSchema> }) => {
        const { error } = await tryCatch(
          db
            .update(vehiculos)
            .set({ fueraServicio: true })
            .where(eq(vehiculos.id, input.id))
        );
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No se pudo actualizar el estado del vehículo. Verifica si tiene asignaciones activas.",
          });
        }
        return { message: "Vehículo marcado como fuera de servicio exitosamente" };
      }
    ),
});
