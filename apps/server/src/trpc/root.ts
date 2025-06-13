import { router } from './core';
import { protectedProcedure, adminProcedure } from './procedures';
import { vehiculoRouter } from '../procedures/vehiculos';
import { mantenimientoRouter } from '../procedures/mantenimientos';
import { asignacionRouter } from '../procedures/asignaciones';

export const appRouter = router({
  perfil: protectedProcedure.query(({ ctx }) => ctx.user),
  admin: adminProcedure.query(() => 'solo admins'),
  vehiculos: vehiculoRouter,
  mantenimientos: mantenimientoRouter,
  asignaciones: asignacionRouter,
});

export type AppRouter = typeof appRouter;