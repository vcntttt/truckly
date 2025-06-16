import { z } from "zod";
import { router } from "../trpc/core";
import { adminProcedure } from "../trpc/procedures";
import { asignaciones, vehiculos } from "../db/schema";
import { db } from "../db/server";
import { eq } from "drizzle-orm";
import { user } from "../auth/auth-schema";

// Esquema corregido según los campos reales
const asignacionSchema = z.object({
  fechaAsignacion: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  vehiculoId: z.number().int(),
  conductorId: z.string(),
  motivo: z.string().max(100),
  status: z.string().max(20),
});

const asignacionUpdateSchema = asignacionSchema.extend({
  id: z.number().int(),
});

const asignacionDeleteSchema = z.object({
  id: z.number().int(),
});

export const asignacionesAdminRouter = router({
  getAll: adminProcedure.query(async () => {
    const rows = await db
      .select({
        id: asignaciones.id,
        status: asignaciones.status,
        motivo: asignaciones.motivo,
        fechaAsignacion: asignaciones.fechaAsignacion,
        vehiculo: {
          id: vehiculos.id,
          patente: vehiculos.patente,
          marca: vehiculos.marca,
          modelo: vehiculos.modelo,
          year: vehiculos.year,
          tipo: vehiculos.tipo,
        },
        conductor: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
        },
      })
      .from(asignaciones)
      .leftJoin(vehiculos, eq(asignaciones.vehiculoId, vehiculos.id))
      .leftJoin(user, eq(asignaciones.conductorId, user.id));

    return rows;
  }),

  create: adminProcedure
    .input(asignacionSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof asignacionSchema> }) => {
        const result = await db
          .insert(asignaciones)
          .values({
            ...input,
            fechaAsignacion: new Date(input.fechaAsignacion),
          })
          .returning();
        return { message: "Asignación creada exitosamente", data: result[0] };
      }
    ),

  update: adminProcedure
    .input(asignacionUpdateSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof asignacionUpdateSchema> }) => {
        const { id, ...data } = input;
        const result = await db
          .update(asignaciones)
          .set({
            ...data,
            fechaAsignacion: new Date(data.fechaAsignacion),
          })
          .where(eq(asignaciones.id, id))
          .returning();
        return {
          message: "Asignación actualizada exitosamente",
          data: result[0],
        };
      }
    ),

  delete: adminProcedure
    .input(asignacionDeleteSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof asignacionDeleteSchema> }) => {
        await db.delete(asignaciones).where(eq(asignaciones.id, input.id));
        return { message: "Asignación eliminada exitosamente" };
      }
    ),
});
