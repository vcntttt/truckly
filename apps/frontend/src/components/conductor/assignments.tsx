import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
import { nonMaintenanceAssignments } from "@/lib/data";
import { Badge } from "../ui/badge";
import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";

const AssignmentsCard = ({ assignment }: { assignment: Assignment }) => {
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

export function RecentAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignaciones recientes</CardTitle>
        <CardDescription>Últimas órdenes de uso de vehículos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nonMaintenanceAssignments.map((assignment) => (
            <AssignmentsCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <span>
            Ver todas las asignaciones
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </CardFooter> */}
    </Card>
  );
}
