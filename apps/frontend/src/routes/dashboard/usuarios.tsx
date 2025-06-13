import { DataTable } from "@/components/dashboard/tables/data-table";
import { UsersActions } from "@/components/dashboard/tables/users/users-actions";
import { usersColumns } from "@/components/dashboard/tables/users/users-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { users } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DataTable
      columns={usersColumns}
      data={users}
      isLoading={false}
      actions={(table) => <UsersActions table={table} />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="firstName"
    />
  );
}
