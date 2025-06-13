import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterVehicleForm } from "@/components/dashboard/forms/register-vehicle";

export const VehiclesActions = () => {
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
          <RegisterVehicleForm />
        </DialogContent>
      </Dialog>
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-4">
          <p>Filtros</p>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};
