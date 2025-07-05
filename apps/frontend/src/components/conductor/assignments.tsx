import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssignmentsCard } from "@/components/conductor/assignments/assignment-card";
import type { Asignaciones } from "@/types";

export function RecentAssignments({
  assignments,
  onClick,
}: {
  assignments: Asignaciones[];
  onClick?: (a: Asignaciones) => void;
}) {
  const activas = assignments.filter(
    (a) => a.status !== "completada" && a.status !== "cancelada"
  );
  const cerradas = assignments.filter(
    (a) => a.status === "completada" || a.status === "cancelada"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignaciones recientes</CardTitle>
        <CardDescription>
          Últimas órdenes de uso de vehículos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Activas</h3>
          <div className="space-y-4">
            {activas.map((assignment) => (
              <AssignmentsCard
                key={assignment.id}
                assignment={assignment}
                onClick={() => onClick?.(assignment)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mt-4 mb-2 text-muted-foreground">
            Cerradas (completadas o canceladas)
          </h3>
          <div className="space-y-4">
            {cerradas.map((assignment) => (
              <AssignmentsCard
                key={assignment.id}
                assignment={assignment}
                disabled
              />
            ))}
          </div>
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

