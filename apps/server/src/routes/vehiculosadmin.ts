import { z } from 'zod';
import { router } from '../trpc/core';
import { adminProcedure } from '../trpc/procedures'; // <- CORREGIDO
import { vehiculos } from '../db/schema';
import { db } from '../db/server';
import { eq } from 'drizzle-orm';

// Esquema base para crear vehículos
const vehiculoSchema = z.object({
  patente: z.string().max(10),
  marca: z.string().max(50),
  modelo: z.string().max(50),
  year: z.number().int(),
  tipo: z.string().max(50),
  proximoMantenimiento: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Fecha inválida' }
  ),
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
    return await db.select().from(vehiculos);
  }),

  // Crear un nuevo vehículo
  create: adminProcedure
    .input(vehiculoSchema)
    .mutation(async ({ input }: { input: z.infer<typeof vehiculoSchema> }) => {
      const result = await db.insert(vehiculos).values({
        ...input,
        proximoMantenimiento: new Date(input.proximoMantenimiento),
      }).returning();
      return { message: 'Vehículo creado exitosamente', data: result[0] };
    }),

  // Actualizar un vehículo existente
  update: adminProcedure
    .input(vehiculoUpdateSchema)
    .mutation(async ({ input }: { input: z.infer<typeof vehiculoUpdateSchema> }) => {
      const { id, ...data } = input;
      const result = await db
        .update(vehiculos)
        .set({
          ...data,
          proximoMantenimiento: new Date(data.proximoMantenimiento),
        })
        .where(eq(vehiculos.id, id))
        .returning();
      return { message: 'Vehículo actualizado exitosamente', data: result[0] };
    }),

  // Eliminar un vehículo
  delete: adminProcedure
    .input(vehiculoDeleteSchema)
    .mutation(async ({ input }: { input: z.infer<typeof vehiculoDeleteSchema> }) => {
      try {
        await db.delete(vehiculos).where(eq(vehiculos.id, input.id));
        return { message: 'Vehículo eliminado exitosamente' };
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        throw new Error('No se pudo eliminar el vehículo. Verifica si tiene asignaciones activas.');
      }
    }),
});
