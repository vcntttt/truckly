import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Loader2, Plus, SlidersHorizontal } from "lucide-react";
import { CreateAssignmentForm } from "@/components/dashboard/forms/create-assignment";
import { useUsers } from "@/hooks/query/users";
import type { Table } from "@tanstack/react-table";
import type { Asignaciones } from "@/types";

export const AssignmentsActions = ({
  table,
}: {
  table: Table<Asignaciones>;
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const { data: users } = useUsers();

  const conductores =
    users?.filter((u) => u.role === "conductor").map((u) => u.name) || [];

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar por Conductor
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Seleccionar roles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {conductores.map((name) => (
            <DropdownMenuCheckboxItem
              key={name}
              checked={selectedUsers.includes(name)}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...selectedUsers, name]
                  : selectedUsers.filter((n) => n !== name);
                setSelectedUsers(next);
                table.getColumn("conductorName")?.setFilterValue(next);
              }}
            >
              {name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
