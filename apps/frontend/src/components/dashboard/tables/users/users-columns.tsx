export interface User {
  id: number;
  rol: "admin" | "conductor";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import { EditUserForm } from "@/components/dashboard/forms/edit-user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Nombre",
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const { rol } = row.original;
      return (
        <Badge
          variant={rol === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {rol}
        </Badge>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return filterValue.includes(value);
      }
      return true;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;
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
                <SheetTitle>Editar usuario</SheetTitle>
                <SheetDescription>
                  Modifica los datos del usuario y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditUserForm
                  initialData={user}
                  onSubmit={(data) => {
                    console.log("Usuario editado:", data);
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
