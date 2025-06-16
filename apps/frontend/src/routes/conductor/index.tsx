import { RecentAssignments } from "@/components/conductor/assignments";
import { MaintenanceAlerts } from "@/components/conductor/maintenance-alerts";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.asignaciones.getByConductorId.queryOptions({
      conductorId: session?.user.id ?? "",
    })
  );

  if (isLoading) return <div>Cargando...</div>;

  const mantenimientos = data?.filter(
    (a) =>
      a.motivo.toLowerCase().includes("mantenimiento") &&
      a.status.toLowerCase() !== "completada"
  );

  const asignaciones = data?.filter(
    (a) => !a.motivo.toLowerCase().includes("mantenimiento")
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <RecentAssignments assignments={asignaciones ?? []} />
      </div>
      <div>
        <MaintenanceAlerts assignments={mantenimientos ?? []} />
      </div>
    </div>
  );
}
