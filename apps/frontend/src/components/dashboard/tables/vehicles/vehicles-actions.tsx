import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  return (
    <div className="flex gap-4">
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
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
          <RegisterVehicleForm
            onClose={() => {
              setSaving(true);
              setFormOpen(false);
            }}
            onError={() => {
              setSaving(false);
              setFormOpen(true);
            }}
            onSuccess={() => {
              setSaving(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
