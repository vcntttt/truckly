import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
import { MaintenanceAlert } from "./maintenance/alert";
import type { Asignaciones } from "@/types";

export function MaintenanceAlerts({
  assignments,
}: {
  assignments: Asignaciones[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          Alertas de mantenimiento
        </CardTitle>
        <CardDescription>Mantenimientos próximos a vencer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.map((assignment) => (
          <MaintenanceAlert key={assignment.id} assignment={assignment} />
        ))}
        {/* <Button variant="outline" className="w-full" asChild>
          <span>
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button> */}
      </CardContent>
    </Card>
  );
}
