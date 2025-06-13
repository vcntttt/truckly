import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Vehiculo } from "./vehicles-columns";

export const VehiclesActions = ({ table }: { table: Table<Vehiculo> }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Registrar nuevo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Vehiculo</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo vehículo.
            </DialogDescription>
          </DialogHeader>
          <p>form</p>
        </DialogContent>
      </Dialog>
      <Button variant={"outline"}>
        <SlidersHorizontal />
        Filtrar
      </Button>
    </div>
  );
};
