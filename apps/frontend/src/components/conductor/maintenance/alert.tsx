import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PenToolIcon } from "lucide-react";

export function MaintenanceAlert({ assignment }: { assignment: Assignment }) {
  return (
    <Alert>
      <PenToolIcon className="h-4 w-4" />
      <AlertTitle>{assignment.motivo}</AlertTitle>
      <AlertDescription className="mt-1">
        Vehículo {assignment.patente} - Vence el{" "}
        {new Date(assignment.fechaAsignacion).toLocaleDateString()}
      </AlertDescription>
    </Alert>
  );
}
