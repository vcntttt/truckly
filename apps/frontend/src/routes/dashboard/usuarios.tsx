import { DataTable } from "@/components/dashboard/tables/data-table";
import { UsersActions } from "@/components/dashboard/tables/users-actions";
import { usersColumns } from "@/components/dashboard/tables/users-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
});

function RouteComponent() {
  const users = [
    {
      id: 1,
      rol: "admin",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      email2: "john.doe.backup@example.com",
      password: "securepassword123",
    },
    {
      id: 2,
      rol: "conductor",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "editorpass456",
    },
    {
      id: 3,
      rol: "conductor",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
      password: "viewerpass789",
    },
    {
      id: 4,
      rol: "conductor",
      firstName: "Bob",
      lastName: "Brown",
      email: "bob.brown@example.com",
      email2: "bob.brown.backup@example.com",
      password: "bobspassword321",
    },
    {
      id: 5,
      rol: "conductor",
      firstName: "Charlie",
      lastName: "Davis",
      email: "charlie.davis@example.com",
      password: "guestpass654",
    },
  ];

  return (
    <DataTable
      columns={usersColumns}
      data={users}
      isLoading={false}
      actions={(table) => <UsersActions table={table} />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
    />
  );
}
