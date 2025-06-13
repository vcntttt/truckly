import { publicProcedure, router } from '../trpc/core';
import { db } from '../db/server';
import { asignaciones } from '../db/schema';
import { z } from 'zod';

export const asignacionRouter = router({
  create: publicProcedure
    .input(z.object({
      vehiculoId: z.number(),
      conductor: z.string(),
    }))
    .mutation(({ input }) => db.insert(asignaciones).values(input)),

  getAll: publicProcedure
    .query(() => db.select().from(asignaciones)),
});
