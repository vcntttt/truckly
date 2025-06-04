import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function RecentAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignaciones recientes</CardTitle>
        <CardDescription>Últimas órdenes de uso de vehículos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
            <div>
              <div className="font-medium">ABC-123 - Toyota Corolla</div>
              <div className="text-sm text-muted-foreground">
                Asignado a: Juan Pérez
              </div>
              <div className="text-sm text-muted-foreground">
                Fecha: 15/05/2025 - 16/05/2025
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                Aprobada
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <span>Ver</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
            <div>
              <div className="font-medium">DEF-456 - Ford Ranger</div>
              <div className="text-sm text-muted-foreground">
                Asignado a: María González
              </div>
              <div className="text-sm text-muted-foreground">
                Fecha: 14/05/2025 - 14/05/2025
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              >
                Pendiente
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <span>Ver</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
            <div>
              <div className="font-medium">GHI-789 - Chevrolet S10</div>
              <div className="text-sm text-muted-foreground">
                Asignado a: Carlos Rodríguez
              </div>
              <div className="text-sm text-muted-foreground">
                Fecha: 13/05/2025 - 13/05/2025
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                Finalizada
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <span>Ver</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
            <div>
              <div className="font-medium">JKL-012 - Volkswagen Amarok</div>
              <div className="text-sm text-muted-foreground">
                Asignado a: Ana Martínez
              </div>
              <div className="text-sm text-muted-foreground">
                Fecha: 12/05/2025 - 12/05/2025
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              >
                Rechazada
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <span>Ver</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <span>
            Ver todas las asignaciones
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
