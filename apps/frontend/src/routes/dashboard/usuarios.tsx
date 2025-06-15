import { DataTable } from "@/components/dashboard/tables/data-table";
import { UsersActions } from "@/components/dashboard/tables/users/users-actions";
import { usersColumns } from "@/components/dashboard/tables/users/users-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { authClient } from "@/lib/auth-client";
import type { UserWithRole } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
});

function RouteComponent() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    authClient.admin
      .listUsers({ query: {} })
      .then(({ data, error }) => {
        if (error) throw error;
        console.log("Fetched users:", data.users);
        setUsers(data.users);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DataTable
      columns={usersColumns}
      data={users}
      isLoading={isLoading}
      actions={(table) => <UsersActions table={table} />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="name"
    />
  );
}
