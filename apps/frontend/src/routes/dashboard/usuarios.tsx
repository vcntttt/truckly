import { DataTable } from "@/components/dashboard/tables/data-table";
import { UsersActions } from "@/components/dashboard/tables/users/users-actions";
import { usersColumns } from "@/components/dashboard/tables/users/users-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { userQueryOptions, useUsers } from "@/hooks/query/users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(userQueryOptions);
    return;
  },
});

function RouteComponent() {
  const { data: users, isLoading, refetch, isRefetching } = useUsers();

  return (
    <DataTable
      columns={usersColumns}
      data={users ?? []}
      isLoading={isLoading || isRefetching}
      actions={(table) => <UsersActions table={table} />}
      viewOptions={(table) => (
        <DataTableViewOptions
          table={table}
          refetchFn={refetch}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
      )}
      searchParam="name"
    />
  );
}
