export interface User {
  id: number;
  rol: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";

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
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button size={"icon"} variant="outline">
            <SquarePen />
          </Button>
          <Button size={"icon"} variant="outline">
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
