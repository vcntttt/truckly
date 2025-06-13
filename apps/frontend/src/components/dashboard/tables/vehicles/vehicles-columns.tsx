import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: string;
}

export const vehiclesColumns: ColumnDef<Vehiculo>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "patente", header: "Patente" },
  { accessorKey: "marca", header: "Marca" },
  { accessorKey: "modelo", header: "Modelo" },
  { accessorKey: "year", header: "Año" },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return <span className="capitalize">{tipo}</span>;
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
