import { router } from "../trpc/core";
import { protectedProcedure } from "../trpc/procedures";
import { eq, isNull, and, sql, gte, lte, asc } from "drizzle-orm";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { asignaciones, vehiculos } from "../db/schema";
import { db } from "../db/server";

export const statsRouter = router({
  availableVehiclesToday: protectedProcedure.query(async () => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(vehiculos)
      .leftJoin(
        asignaciones,
        and(
          eq(vehiculos.id, asignaciones.vehiculoId),
          and(
            gte(asignaciones.fechaAsignacion, todayStart),
            lte(asignaciones.fechaAsignacion, todayEnd)
          )
        )
      )
      .where(isNull(asignaciones.id));

    return { count };
  }),
  availableAssignmentsThisWeek: protectedProcedure.query(async () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(asignaciones)
      .where(
        and(
          gte(asignaciones.fechaAsignacion, weekStart),
          lte(asignaciones.fechaAsignacion, weekEnd)
        )
      );

    return { count };
  }),
  pendingMaintenancesThisWeek: protectedProcedure.query(async ({ ctx }) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.status, "completa"),
          and(
            gte(asignaciones.fechaAsignacion, weekStart),
            lte(asignaciones.fechaAsignacion, weekEnd),
            sql`LOWER(${asignaciones.motivo}) LIKE 'mantenimiento%'`
          )
        )
      );

    return { count };
  }),
  fleetStatus: protectedProcedure.query(async () => {
    return await db
      .select({
        status: asignaciones.status,
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(asignaciones)
      .groupBy(asignaciones.status);
  }),
  mileagePerVehicle: protectedProcedure.query(async () => {
    return await db
      .select({
        patente: vehiculos.patente,
        kilometraje: vehiculos.kilometraje,
      })
      .from(vehiculos)
      .where(eq(vehiculos.fueraServicio, false))
      .orderBy(asc(vehiculos.patente));
  }),
});
