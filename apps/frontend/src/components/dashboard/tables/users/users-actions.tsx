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
import { CreateUserForm } from "@/components/dashboard/forms/create-user";
import { Loader2, SlidersHorizontal, UserRoundPlus } from "lucide-react";
import type { UserWithRole } from "@/types";

export function UsersActions({ table }: { table: Table<UserWithRole> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "admin",
    "conductor",
  ]);

  useEffect(() => {
    if (selectedRoles.length > 0) {
      table?.getColumn("role")?.setFilterValue(selectedRoles);
    } else {
      table?.getColumn("role")?.setFilterValue(undefined);
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
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar Usuarios
          </Button>
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
          <Button variant="outline" className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className={"animate-spin"} />
            ) : (
              <UserRoundPlus className="h-4 w-4" />
            )}
            Agregar usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo usuario.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            onClose={() => {
              setIsLoading(true);
              setIsFormOpen(false);
            }}
            onError={() => {
              setIsLoading(false);
              setIsFormOpen(true);
            }}
            onSuccess={() => {
              setIsLoading(false);
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
