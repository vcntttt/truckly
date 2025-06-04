import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  PenToolIcon as Tool,
} from "lucide-react";

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
        <Alert>
          <Tool className="h-4 w-4" />
          <AlertTitle>Cambio de aceite</AlertTitle>
          <AlertDescription className="mt-1">
            Vehículo ABC-123 - Vence en 2 días
          </AlertDescription>
        </Alert>

        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Revisión de frenos</AlertTitle>
          <AlertDescription className="mt-1">
            Vehículo DEF-456 - Vence en 5 días
          </AlertDescription>
        </Alert>

        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Cambio de filtros</AlertTitle>
          <AlertDescription className="mt-1">
            Vehículo GHI-789 - Vence en 7 días
          </AlertDescription>
        </Alert>

        <Button variant="outline" className="w-full" asChild>
          <span>
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
