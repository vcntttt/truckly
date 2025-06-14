import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { EditVehicleForm } from "@/components/dashboard/forms/edit-vehicle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    cell: ({ row }) => {
      const vehiculo = row.original;
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
                <SheetTitle>Editar vehículo</SheetTitle>
                <SheetDescription>
                  Modifica los datos del vehículo y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditVehicleForm
                  initialData={vehiculo}
                  onSubmit={(data: Vehiculo) => {
                    console.log("Vehículo editado:", data);
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
