import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2, PenToolIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asignaciones } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";

export function MaintenanceAlert({ assignment }: { assignment: Asignaciones }) {
  const trpc = useTRPC();
  const updateStatusMutation = useMutation(
    trpc.asignaciones.updateStatus.mutationOptions()
  );

  const handleMarkCompleted = () => {
    try {
      updateStatusMutation.mutate({
        id: assignment.id,
        status: "completada",
      });
      toast.success("Mantenimiento marcado como completado");
    } catch (error) {
      toast.error("Error al marcar mantenimiento como completado");
      console.error("Error al marcar mantenimiento como completado:", error);
    }
  };

  return (
    <Alert>
      <PenToolIcon className="h-4 w-4" />
      <AlertTitle>{assignment.motivo}</AlertTitle>
      <AlertDescription className="mt-1">
        <p>
          Vehículo {assignment.vehiculo?.patente} -{" "}
          {assignment.vehiculo?.modelo}
        </p>
        <p>{new Date(assignment.fechaAsignacion ?? "").toLocaleString()}</p>
        <Button onClick={handleMarkCompleted} variant={"ghost"}>
          {updateStatusMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              Marcar como completado
              <Check className="h-4 w-4" />
            </div>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
