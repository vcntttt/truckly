import { router } from "./core";
import { protectedProcedure, adminProcedure } from "./procedures";
import { vehiculoRouter } from "../routes/vehiculos";
import { asignacionRouter } from "../routes/asignaciones";
import { vehiculosAdminRouter } from "../routes/vehiculosadmin";
import { asignacionesAdminRouter } from "../routes/asignacionesadmin";
import { statsRouter } from "../routes/stats";

export const appRouter = router({
  perfil: protectedProcedure.query(({ ctx }) => ctx.user),
  admin: adminProcedure.query(() => "solo admins"),
  vehiculos: vehiculoRouter,
  asignaciones: asignacionRouter,
  vehiculosadmin: vehiculosAdminRouter,
  asignacionesadmin: asignacionesAdminRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
