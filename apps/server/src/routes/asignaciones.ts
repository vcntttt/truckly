import { db } from "../db/server";
import { asignaciones } from "../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { vehiculos } from "../db/schema";
import { router } from "../trpc/core";
import { protectedProcedure, publicProcedure } from "../trpc/procedures";

const StatusEnum = z.enum([
  "pendiente",
  "en progreso",
  "completada",
  "cancelada",
]);

const AsignacionInput = z.object({
  vehiculoId: z.number().min(1, "ID de vehículo requerido"),
  conductorId: z.string().min(1, "ID de conductor requerido"),
  status: StatusEnum.default("pendiente"),
  motivo: z.string().min(5, "Motivo debe tener al menos 5 caracteres"),
});

export const asignacionRouter = router({
  create: publicProcedure.input(AsignacionInput).mutation(async ({ input }) => {
    const [vehiculo] = await db
      .select()
      .from(vehiculos)
      .where(eq(vehiculos.id, input.vehiculoId));

    if (!vehiculo) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `El vehículo con ID ${input.vehiculoId} no existe`,
      });
    }

    const [nuevaAsignacion] = await db
      .insert(asignaciones)
      .values(input)
      .returning();

    return nuevaAsignacion;
  }),

  getAll: publicProcedure.query(async () => {
    return await db.select().from(asignaciones);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [asignacion] = await db
        .select()
        .from(asignaciones)
        .where(eq(asignaciones.id, input.id))
        .limit(1);

      if (!asignacion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asignación no encontrada",
        });
      }
      return asignacion;
    }),

  getByConductorId: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(asignaciones)
      .where(eq(asignaciones.conductorId, ctx.user.email));
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: StatusEnum,
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(asignaciones)
        .set({ status: input.status })
        .where(eq(asignaciones.id, input.id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(asignaciones).where(eq(asignaciones.id, input.id));

      return { success: true };
    }),
});

export type AsignacionRouter = typeof asignacionRouter;
