import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PenToolIcon as Tool } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import { maintenanceAssignments } from "@/lib/data";

export function MaintenanceAlert({ assignment }: { assignment: Assignment }) {
  return (
    <Alert>
      <Tool className="h-4 w-4" />
      <AlertTitle>{assignment.motivo}</AlertTitle>
      <AlertDescription className="mt-1">
        Vehículo {assignment.patente} - Vence el{" "}
        {new Date(assignment.fechaAsignacion).toLocaleDateString()}
      </AlertDescription>
    </Alert>
  );
}

export function MaintenanceAlerts() {
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
        {maintenanceAssignments.map((assignment) => (
          <MaintenanceAlert key={assignment.patente} assignment={assignment} />
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
