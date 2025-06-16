import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, PenToolIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asignaciones } from "@/types";

export function MaintenanceAlert({ assignment }: { assignment: Asignaciones }) {
  const handleMarkCompleted = () => {
    console.log("Marcando como completado:", assignment.id);
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
          Marcar como completado
          <Check className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
