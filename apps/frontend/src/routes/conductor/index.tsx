
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AssignmentsCard } from "@/components/conductor/assignments/assignment-card";
import { MaintenanceAlerts } from "@/components/conductor/maintenance-alerts";
import { RegisterKilometraje } from "@/components/dashboard/forms/register-kilometraje";
import type { Asignaciones } from "@/types";

export const Route = createFileRoute("/conductor/")({
  component: RouteComponent,
});

export function RouteComponent() {
  const { data: session } = useSession();
  const trpc = useTRPC();

  // 1) Obtener asignaciones crudas
  const assignmentOptions = trpc.asignaciones.getByConductorId.queryOptions({
    conductorId: session?.user.id ?? "",
  });
  const {
    data: rawAssignments,
    isLoading: loadingAsig,
  } = useQuery({
    ...assignmentOptions,
    enabled: Boolean(session?.user.id),
  });

  // 2) Normalizar vehiculo para cumplir con el tipo Asignaciones
  const assignments: Asignaciones[] = (rawAssignments ?? []).map((a) => ({
    ...a,
    vehiculo: a.vehiculo
      ? {
          ...a.vehiculo,
          kilometraje: (a.vehiculo as any).kilometraje ?? 0,
          fueraServicio: (a.vehiculo as any).fueraServicio ?? false,
        }
      : null,
  }));

  const [selected, setSelected] = useState<Asignaciones | null>(null);

  // 3) Obtener datos completos del vehículo al seleccionar
  const vehicleOptions = trpc.vehiculos.getById.queryOptions({
    id: selected?.vehiculo?.id ?? 0,
  });
  const {
    data: fullVehiculo,
    isLoading: loadingVeh,
  } = useQuery({
    ...vehicleOptions,
    enabled: selected !== null,
  });

  if (loadingAsig) {
    return <div>Cargando asignaciones…</div>;
  }

  // 4) Filtrar asignaciones según estado y motivo
  const normales = assignments.filter(
    (a) =>
      !a.motivo.toLowerCase().includes("mantenimiento") &&
      a.status.toLowerCase() !== "completada"
  );
  const mantenimientos = assignments.filter(
    (a) =>
      a.motivo.toLowerCase().includes("mantenimiento") &&
      a.status.toLowerCase() !== "completada"
  );

  return (
    <>
      {/* Listado de asignaciones normales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4">
          {normales.map((a) => (
            <div
              key={a.id}
              className="cursor-pointer"
              onClick={() => setSelected(a)}
            >
              <AssignmentsCard assignment={a} />
            </div>
          ))}
          {/* Mostrar asignaciones completadas sin acción */}
          {assignments
            .filter((a) => a.status.toLowerCase() === "completada")
            .map((a) => (
              <div key={a.id} className="opacity-50">
                <AssignmentsCard assignment={a} />
              </div>
            ))}
        </div>
        <div>
          <MaintenanceAlerts assignments={mantenimientos} />
        </div>
      </div>

      {/* Modal para registrar kilometraje */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Kilometraje</DialogTitle>
            <DialogDescription>
              Ingresa el nuevo kilometraje del vehículo para completar la asignación.
            </DialogDescription>
          </DialogHeader>

          {loadingVeh ? (
            <div>Cargando datos del vehículo…</div>
          ) : selected && fullVehiculo ? (
            <RegisterKilometraje
              asignacionId={selected.id}
              vehiculo={fullVehiculo}
              onSuccess={() => setSelected(null)}
            />
          ) : (
            <div className="p-4 text-center">
              Selecciona primero una asignación para marcar.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

