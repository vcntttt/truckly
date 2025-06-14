import { router } from './core';
import { protectedProcedure, adminProcedure } from './procedures';
import { vehiculoRouter } from '../routes/vehiculos';
import { asignacionRouter } from '../routes/asignaciones';
import { vehiculosAdminRouter } from '../routes/vehiculosadmin';


export const appRouter = router({
  perfil: protectedProcedure.query(({ ctx }) => ctx.user),
  admin: adminProcedure.query(() => 'solo admins'),
  vehiculos: vehiculoRouter,
  asignaciones: asignacionRouter,
  vehiculosadmin: vehiculosAdminRouter,
});

export type AppRouter = typeof appRouter;
