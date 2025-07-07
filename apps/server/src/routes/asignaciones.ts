import { tryCatch } from "../trycatch";
import { db } from "../db/server";
import { asignaciones } from "../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { vehiculos } from "../db/schema";
import { router } from "../trpc/core";
import { protectedProcedure, publicProcedure } from "../trpc/procedures";
import { user } from "../auth/auth-schema";

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
    // Buscar vehículo
    const { data: vehiculo, error: vehiculoError } = await tryCatch(
      db.select().from(vehiculos).where(eq(vehiculos.id, input.vehiculoId))
    );
    if (vehiculoError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error buscando el vehículo en la base de datos",
      });
    }
    if (!vehiculo || vehiculo.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `El vehículo con ID ${input.vehiculoId} no existe`,
      });
    }

    // Insertar nueva asignación
    const { data: nuevaAsignacion, error: insertError } = await tryCatch(
      db.insert(asignaciones).values(input).returning()
    );
    if (insertError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No se pudo crear la asignación",
      });
    }

    return nuevaAsignacion[0];
  }),

  getAll: publicProcedure.query(async () => {
    const { data: rows, error } = await tryCatch(
      db
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
            kilometraje: vehiculos.kilometraje,
            fueraServicio: vehiculos.fueraServicio,
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
        .leftJoin(user, eq(asignaciones.conductorId, user.id))
    );
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error obteniendo asignaciones",
      });
    }
    return rows;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { data: asignacion, error } = await tryCatch(
        db
          .select()
          .from(asignaciones)
          .where(eq(asignaciones.id, input.id))
          .limit(1)
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error obteniendo la asignación",
        });
      }
      if (!asignacion || asignacion.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asignación no encontrada",
        });
      }
      return asignacion[0];
    }),

  getByConductorId: publicProcedure
    .input(z.object({ conductorId: z.string().min(1) }))
    .query(async ({ input }) => {
      const { data: rows, error } = await tryCatch(
        db
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
          .leftJoin(user, eq(asignaciones.conductorId, user.id))
          .where(eq(asignaciones.conductorId, input.conductorId))
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error obteniendo asignaciones del conductor",
        });
      }
      return rows;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: StatusEnum,
      })
    )
    .mutation(async ({ input }) => {
      const { data: updated, error } = await tryCatch(
        db
          .update(asignaciones)
          .set({ status: input.status })
          .where(eq(asignaciones.id, input.id))
          .returning()
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error actualizando el estado de la asignación",
        });
      }
      return updated[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await tryCatch(
        db.delete(asignaciones).where(eq(asignaciones.id, input.id))
      );
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error eliminando la asignación",
        });
      }
      return { success: true };
    }),
});

export type AsignacionRouter = typeof asignacionRouter;
