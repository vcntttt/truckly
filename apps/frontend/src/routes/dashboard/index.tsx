// ...existing code...
import { createFileRoute } from "@tanstack/react-router";
import { FlotaStatus } from "../../components/dashboard/stats/flota-status";
import { KilometrajeBars } from "@/components/dashboard/stats/kilometraje-bars";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { VehiculosDisponibles } from "@/components/dashboard/stats/vehiculos-disponibles";
import MantenimientosPendientes from "@/components/dashboard/stats/mantenimientos-pendientes";
import AsignacionesSemanales from "@/components/dashboard/stats/asignaciones-semanales";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="grid md:grid-row-3 gap-3 md:grid-rows-[200px_1fr_1fr]">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 border-none">
          {/* Vehiculos disponibles que no tienen asignaciones hoy/esta semana */}
          <Suspense fallback={<Skeleton className="size-full" />}>
            <VehiculosDisponibles />
          </Suspense>

          {/* Mantenimientos pendientes esta semana */}
          <Suspense fallback={<Skeleton className="size-full" />}>
            <MantenimientosPendientes />
          </Suspense>

          {/* Asignaciones para esta semana */}
          <Suspense fallback={<Skeleton className="size-full" />}>
            <AsignacionesSemanales />
          </Suspense>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 border-none">
          {/* Estado de la flota */}
          <Suspense fallback={<Skeleton className="size-full" />}>
            <FlotaStatus />
          </Suspense>

          {/* Kilometraje por vehículo */}
          <Suspense fallback={<Skeleton className="size-full" />}>
            <KilometrajeBars />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
