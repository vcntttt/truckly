import { router } from './core';
import { protectedProcedure, adminProcedure } from './procedures';
import { vehiculoRouter } from '../routes/vehiculos';
import { mantenimientoRouter } from '../routes/mantenimientos';
import { asignacionRouter } from '../routes/asignaciones';

export const appRouter = router({
  perfil: protectedProcedure.query(({ ctx }) => ctx.user),
  admin: adminProcedure.query(() => 'solo admins'),
  vehiculos: vehiculoRouter,
  mantenimientos: mantenimientoRouter,
  asignaciones: asignacionRouter,
});

export type AppRouter = typeof appRouter;
