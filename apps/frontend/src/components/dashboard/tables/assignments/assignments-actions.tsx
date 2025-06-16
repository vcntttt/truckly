import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateAssignmentForm } from "@/components/dashboard/forms/create-assignment";

export const AssignmentsActions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva asignación</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear una nueva asignación.
            </DialogDescription>
          </DialogHeader>
          <CreateAssignmentForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
