export interface User {
  id: number;
  rol: string;
  firstName: string;
  lastName: string;
  email: string;
  email2?: string;
  password: string;
}

import type { ColumnDef } from "@tanstack/react-table";

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
    id: "emails",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      const email2 = row.getValue("email2") as string;

      return (
        <>
          <p>{email}</p>
          {!!email2 && <p>{email2}</p>}
        </>
      );
    },
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
  {
    accessorKey: "email",
    enableHiding: true,
  },
  {
    accessorKey: "email2",
  },
];
