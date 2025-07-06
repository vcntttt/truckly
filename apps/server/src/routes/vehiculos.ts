import { tryCatch } from "../trycatch";
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
  proximoMantenimiento: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),
  kilometraje: z.number().min(0).default(0),
  fueraServicio: z.boolean().default(false),
});

export const vehiculoRouter = router({
  // CREATE
  create: publicProcedure.input(VehiculoInput).mutation(async ({ input }) => {
    const { data: nuevo, error } = await tryCatch(
      db.insert(vehiculos).values(input).returning()
    );
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creando el vehículo",
      });
    }
    return nuevo[0];
  }),

  // READ - Todos los vehículos
  getAll: publicProcedure.query(async () => {
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

  // READ - Uno por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { data: vehiculo, error } = await tryCatch(
        db
          .select()
          .from(vehiculos)
          .where(eq(vehiculos.id, input.id))
          .limit(1)
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error buscando el vehículo",
        });
      }
      if (!vehiculo || vehiculo.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehículo no encontrado",
        });
      }
      return vehiculo[0];
    }),

  updateById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: VehiculoInput,
      })
    )
    .mutation(async ({ input }) => {
      const { data: actualizado, error } = await tryCatch(
        db
          .update(vehiculos)
          .set(input.data)
          .where(eq(vehiculos.id, input.id))
          .returning()
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error actualizando el vehículo",
        });
      }
      if (!actualizado || actualizado.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehículo no encontrado para actualizar",
        });
      }
      return actualizado[0];
    }),

  deleteById: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await tryCatch(
        db
          .update(vehiculos)
          .set({ fueraServicio: true })
          .where(eq(vehiculos.id, input.id))
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error eliminando el vehículo",
        });
      }
      return { success: true };
    }),
});

export type VehiculoRouter = typeof vehiculoRouter;
