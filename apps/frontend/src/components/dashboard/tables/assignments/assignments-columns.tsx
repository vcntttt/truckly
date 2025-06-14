import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { EditAssignmentForm } from "@/components/dashboard/forms/edit-assignment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Asignaciones } from "@/types";

export const assignmentsColumns: ColumnDef<Asignaciones>[] = [
  {
    accessorKey: "id",
    header: "ID",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue<number>(columnId));
      return cellValue.includes(String(filterValue));
    },
  },
  { accessorKey: "vehiculoId", header: "Vehículo" },
  { accessorKey: "conductorId", header: "Conductor" },
  {
    accessorKey: "fechaAsignacion",
    header: "Fecha Asignación",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaAsignacion") as string;
      return <span>{new Date(fecha).toLocaleString()}</span>;
    },
  },
  { accessorKey: "motivo", header: "Motivo" },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pendiente"
        | "en progreso"
        | "completada"
        | "cancelada";
      return (
        <Badge
          variant={
            status === "pendiente"
              ? "default"
              : status === "en progreso"
                ? "secondary"
                : status === "completada"
                  ? "success"
                  : "destructive"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const assignment = row.original;
      return (
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant="outline">
                <SquarePen />
              </Button>
            </SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <SheetHeader>
                <SheetTitle>Editar asignación</SheetTitle>
                <SheetDescription>
                  Modifica los datos de la asignación y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditAssignmentForm
                  initialData={assignment}
                  onSubmit={(data) => {
                    console.log("Asignación editada:", data);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
          <Button size={"icon"} variant="outline">
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
