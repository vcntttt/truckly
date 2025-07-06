import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data: { count: freeToday } = {} } = useQuery(
    trpc.stats.availableVehiclesToday.queryOptions()
  );

  const { data: { count: freeWeek } = {} } = useQuery(
    trpc.stats.availableVehiclesThisWeek.queryOptions()
  );
  // const { data: { count: pendingMaint } = {} } = useQuery(
  //   trpc.stats.pendingMaintenancesThisWeek.queryOptions()
  // );
  const { data: fleet } = useQuery(trpc.stats.fleetStatus.queryOptions());
  const { data: mileage } = useQuery(
    trpc.stats.mileagePerVehicle.queryOptions()
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold pb-4">Panel de Administración</h1>
      <div className="grid grid-row-3  gap-3 grid-rows-[200px_1fr_1fr]">
        <section className="grid grid-cols-3 gap-3 border-none">
          {/* Vehiculos disponibles que no tienen asignaciones hoy/esta semana */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Vehículos disponibles hoy
              </h2>
            </CardHeader>
            <CardContent>{freeToday}</CardContent>
          </Card>
          {/* Mantenimientos pendientes esta semana */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Vehículos disponibles hoy
              </h2>
            </CardHeader>
            <CardContent>{freeWeek}</CardContent>
          </Card>
          {/* pendiente */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">No se que poner aca</h2>
            </CardHeader>
            <CardContent>{0}</CardContent>
          </Card>
        </section>
        {/* graficos */}
        <section className="grid grid-cols-2 gap-3 border-none">
          {/* Estado de la flota: asignaciones activas, pendientes, etc. */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Estado de la flota</h2>
            </CardHeader>
            <CardContent>
              <pre>{JSON.stringify(fleet, null, 2)}</pre>
            </CardContent>
          </Card>
          {/* Kilometraje total por vehiculo */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Kilometraje total por vehiculo
              </h2>
            </CardHeader>
            <CardContent>
              <pre>{JSON.stringify(mileage, null, 2)}</pre>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
