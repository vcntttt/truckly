import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import { Badge } from "@/components/ui/badge";

export const AssignmentsCard = ({ assignment }: { assignment: Assignment }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
      <div>
        <div className="font-medium">
          {assignment.patente} - {assignment.motivo}
        </div>
        <div className="text-sm text-muted-foreground">
          Asignado a: {assignment.conductor}
        </div>
        <div className="text-sm text-muted-foreground">
          Fecha: {new Date(assignment.fechaAsignacion).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={
            assignment.estado === "pendiente"
              ? "default"
              : assignment.estado === "en progreso"
                ? "secondary"
                : assignment.estado === "completada"
                  ? "success"
                  : "destructive"
          }
          className="capitalize"
        >
          {assignment.estado}
        </Badge>
      </div>
    </div>
  );
};
