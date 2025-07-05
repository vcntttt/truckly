import { RecentAssignments } from "@/components/conductor/assignments";
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MaintenanceAlerts } from "@/components/conductor/maintenance-alerts";
import { RegisterKilometraje } from "@/components/dashboard/forms/register-kilometraje";
import type { Asignaciones } from "@/types";

type Status = "pendiente" | "en progreso" | "completada" | "cancelada";

export const Route = createFileRoute("/conductor/")({
  component: RouteComponent,
});

export function RouteComponent() {
  const { data: session } = useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // 1) Query de asignaciones
  const assignmentOptions = trpc.asignaciones.getByConductorId.queryOptions({
    conductorId: session?.user.id ?? "",
  });
  const { data: rawAssignments, isLoading: loadingAsig } = useQuery({
    ...assignmentOptions,
    enabled: Boolean(session?.user.id),
  });

  // 2) Normalizar
  const assignments: Asignaciones[] = (rawAssignments ?? []).map((a) => {
    const veh = a.vehiculo as any;
    return {
      ...a,
      vehiculo: veh
        ? {
            ...veh,
            kilometraje: veh.kilometraje ?? 0,
            fueraServicio: veh.fueraServicio ?? false,
            proximoMantenimiento: veh.proximoMantenimiento ?? new Date(),
          }
        : null,
    } as Asignaciones;
  });

  // Estado del modal + nuevo status, tipado con los literales válidos
  const [selected, setSelected] = useState<Asignaciones | null>(null);
  const [newStatus, setNewStatus] = useState<Status>("pendiente");

  // 3) Query del vehículo completo
  const vehicleOptions = trpc.vehiculos.getById.queryOptions({
    id: selected?.vehiculo?.id ?? 0,
  });
  const { data: fullVehiculo, isLoading: loadingVeh } = useQuery({
    ...vehicleOptions,
    enabled: selected !== null,
  });

  // 4) Configurar la mutación
  const updateOptions = trpc.asignaciones.updateStatus.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentOptions.queryKey });
      setSelected(null);
    },
  });
  const updateMutation = useMutation(updateOptions);

  // Inicializar el select cuando abrimos el modal
  useEffect(() => {
    if (selected) {
      setNewStatus(selected.status as Status);
    }
  }, [selected]);

  // Guardar cambios de estado (no completada)
  const handleSaveStatus = () => {
    if (!selected) return;
    updateMutation.mutate({ id: selected.id, status: newStatus });
  };

  if (loadingAsig) {
    return <div>Cargando asignaciones…</div>;
  }



  const mantenimientos = assignments.filter(
    (a) =>
      a.motivo.toLowerCase().includes("mantenimiento") &&
      a.status.toLowerCase() !== "completada"
  );
  // Solo permite abrir el modal si la asignación NO está completada
  const handleCardClick = (a: Asignaciones) => {
    if (a.status.toLowerCase() !== "completada") {
      setSelected(a);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4">
          <RecentAssignments 
          assignments={assignments} 
          onClick={handleCardClick} 
         />
        </div>
        <div>
          <MaintenanceAlerts assignments={mantenimientos} />
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Asignación</DialogTitle>
            <DialogDescription>
              Selecciona un nuevo estado. Si eliges "Completada", ingresa el kilometraje a continuación.
            </DialogDescription>
          </DialogHeader>

          {loadingVeh ? (
            <div>Cargando datos del vehículo…</div>
          ) : selected && fullVehiculo ? (
            selected.status === "completada" ? (
              <div className="text-center text-muted-foreground">
                Esta asignación ya fue completada y no puede ser modificada.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Estado
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as Status)
                    }
                    className="mt-1 block w-full"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {newStatus === "completada" ? (
                  <RegisterKilometraje
                    asignacionId={selected.id}
                    vehiculo={{
                      ...fullVehiculo,
                      proximoMantenimiento: (
                        selected.vehiculo as any
                      ).proximoMantenimiento,
                    } as any}
                    onSuccess={() => {
                      queryClient.invalidateQueries({
                        queryKey: assignmentOptions.queryKey,
                      });
                      setSelected(null);
                    }}
                  />
                ) : (
                  <DialogFooter>
                    <button
                      onClick={handleSaveStatus}
                      className="inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium"
                    >
                      Guardar
                    </button>
                  </DialogFooter>
                )}
              </>
            )
          ) : (
            <div className="p-4 text-center">
              Selecciona primero una asignación.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
