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
import type { Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import type { User } from "./users-columns";

export function UsersActions({ table }: { table: Table<User> }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRoles.length > 0) {
      table?.getColumn("rol")?.setFilterValue(selectedRoles);
    } else {
      table?.getColumn("rol")?.setFilterValue(undefined);
    }
  }, [selectedRoles, table]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };

  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filtrar Usuarios</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Seleccionar roles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["admin", "conductor"].map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={selectedRoles.includes(role)}
              onCheckedChange={() => handleRoleToggle(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Agregar usuario</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo usuario.
            </DialogDescription>
          </DialogHeader>
          <p>Formulario</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
