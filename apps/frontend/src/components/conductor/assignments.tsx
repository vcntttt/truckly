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
import { AssignmentsCard } from "@/components/conductor/assignments/assignment-card";

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
