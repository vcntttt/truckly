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
import { Loader2, Plus } from "lucide-react";
import { CreateAssignmentForm } from "@/components/dashboard/forms/create-assignment";

export const AssignmentsActions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  return (
    <div className="flex gap-4">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
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
          <CreateAssignmentForm
            onClose={() => {
              setSaving(true);
              setIsFormOpen(false);
            }}
            onError={() => {
              setSaving(false);
              setIsFormOpen(true);
            }}
            onSuccess={() => {
              setSaving(false);
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
