import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

export interface Assignment {
  id: number;
  patente: string;
  conductor: string;
  fechaAsignacion: string;
  motivo: string;
  estado: string;
}

export const assignmentsColumns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue<number>(columnId));
      return cellValue.includes(String(filterValue));
    },
  },
  { accessorKey: "patente", header: "Vehículo" },
  { accessorKey: "conductor", header: "Conductor" },
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
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      // temporal hasta que se definan bien los estados y me lleguen desde el backend
      const estado = row.getValue("estado") as
        | "pendiente"
        | "en progreso"
        | "completada"
        | "cancelada";
      return (
        <Badge
          variant={
            estado === "pendiente"
              ? "default"
              : estado === "en progreso"
                ? "secondary"
                : estado === "completada"
                  ? "success"
                  : "destructive"
          }
          className="capitalize"
        >
          {estado}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button size={"icon"} variant="outline">
            <SquarePen />
          </Button>
          <Button size={"icon"} variant="outline">
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
