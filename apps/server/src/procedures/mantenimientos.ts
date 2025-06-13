import { publicProcedure, router } from '../trpc/core';
import { db } from '../db/server';
import { mantenimientos } from '../db/schema';
import { z } from 'zod';

export const mantenimientoRouter = router({
  log: publicProcedure
    .input(z.object({
      vehiculoId: z.number(),
      descripcion: z.string(),
      kilometraje: z.number(),
    }))
    .mutation(({ input }) => db.insert(mantenimientos).values({
      vehiculoId: input.vehiculoId,
      descripcion: input.descripcion,
      kilometraje: input.kilometraje,
    })),
});