import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, PenToolIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MaintenanceAlert({ assignment }: { assignment: Assignment }) {
  const handleMarkCompleted = () => {
    console.log("Marcando como completado:", assignment.id);
  };

  return (
    <Alert className="relative group">
      <PenToolIcon className="h-4 w-4" />
      <AlertTitle>{assignment.motivo}</AlertTitle>
      <AlertDescription className="mt-1">
        Vehículo {assignment.patente} - Vence el{" "}
        {new Date(assignment.fechaAsignacion).toLocaleDateString()}
      </AlertDescription>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 opacity-60 hover:opacity-100 hover:bg-green-100 hover:text-green-700 cursor-pointer"
            onClick={handleMarkCompleted}
          >
            <Check className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Marcar como completado</p>
        </TooltipContent>
      </Tooltip>
    </Alert>
  );
}
