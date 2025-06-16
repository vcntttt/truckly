import { db } from "../db/server";
import { vehiculos } from "../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc/core";
import { publicProcedure } from "../trpc/procedures";

const VehiculoInput = z.object({
  patente: z.string().min(3),
  marca: z.string().min(2),
  modelo: z.string().min(2),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  tipo: z.string().min(3),
  proximoMantenimiento: z.date(),
});

export const vehiculoRouter = router({
  // CREATE
  create: publicProcedure.input(VehiculoInput).mutation(async ({ input }) => {
    const [nuevo] = await db.insert(vehiculos).values(input).returning();
    return nuevo;
  }),

  // READ - Todos los vehículos
  getAll: publicProcedure.query(async () => {
    return await db.select().from(vehiculos);
  }),

  // READ - Uno por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [vehiculo] = await db
        .select()
        .from(vehiculos)
        .where(eq(vehiculos.id, input.id))
        .limit(1);

      if (!vehiculo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehículo no encontrado",
        });
      }

      return vehiculo;
    }),

  updateById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: VehiculoInput,
      })
    )
    .mutation(async ({ input }) => {
      const [actualizado] = await db
        .update(vehiculos)
        .set(input.data)
        .where(eq(vehiculos.id, input.id))
        .returning();

      if (!actualizado) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehículo no encontrado para actualizar",
        });
      }

      return actualizado;
    }),

  deleteById: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(vehiculos).where(eq(vehiculos.id, input.id));

      return { success: true };
    }),
});

export type VehiculoRouter = typeof vehiculoRouter;
