import { publicProcedure, router} from '../trpc/core';
import { db } from '../db/server';
import { asignaciones } from '../db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../auth/middleware';
import { t } from '../trpc/core';


export const protectedProcedure = t.procedure.use(authMiddleware);

const AsignacionInput = z.object({
  vehiculoId: z.number(),
  conductor: z.string(),
});

export const asignacionRouter = router({
  create: publicProcedure
    .input(AsignacionInput)
    .mutation(({ input }) =>
      db.insert(asignaciones).values(input)
    ),

  getAll: publicProcedure.query(() =>
    db.select().from(asignaciones)
  ),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) =>
      db.select()
        .from(asignaciones)
        .where(eq(asignaciones.id, input.id))
        .limit(1)
        .then(rows => rows[0] ?? null)
    ),

  getByConductorID: protectedProcedure.query(({ ctx }) =>
    db.select()
      .from(asignaciones)
      .where(eq(asignaciones.conductor, ctx.user.email))
  ),

  changeStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.string(),
    }))
    .mutation(({ input }) =>
      db.update(asignaciones)
        .set({ status: input.status })
        .where(eq(asignaciones.id, input.id))
    ),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      vehiculoId: z.number().optional(),
      conductor: z.string().optional(),
      estado: z.string().optional(),
    }))
    .mutation(({ input }) =>
      db.update(asignaciones)
        .set({
          vehiculoId: input.vehiculoId,
          conductor: input.conductor,
          status: input.status,
        })
        .where(eq(asignaciones.id, input.id))
    ),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      db.delete(asignaciones)
        .where(eq(asignaciones.id, input.id))
    ),
});