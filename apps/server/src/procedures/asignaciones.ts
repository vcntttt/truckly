// apps/server/src/trpc/asignaciones.ts
import { publicProcedure, router } from '../trpc/core';
import { db } from '../db/server';
import { asignaciones } from '../db/schema';
import { z } from 'zod';

export const asignacionRouter = router({
  assign: publicProcedure
    .input(z.object({
      vehiculoId: z.number(),
      conductor: z.string(),
    }))
    .mutation(({ input }) => db.insert(asignaciones).values({
      vehiculoId: input.vehiculoId,
      conductor: input.conductor,
    })),
});
