import { publicProcedure, router } from '../trpc/core';
import { db } from '../db/server';
import { vehiculos } from '../db/schema';
import { z } from 'zod';

export const vehiculoRouter = router({
  create: publicProcedure
    .input(z.object({
      patente: z.string(),
      marca: z.string(),
      modelo: z.string(),
      year: z.number(),
      tipo: z.string(),
    }))
    .mutation(({ input }) => db.insert(vehiculos).values(input)),

  getAll: publicProcedure
    .query(() => db.select().from(vehiculos)),
});
