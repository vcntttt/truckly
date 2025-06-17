import { AssignmentsActions } from "@/components/dashboard/tables/assignments/assignments-actions";
import { assignmentsColumns } from "@/components/dashboard/tables/assignments/assignments-columns";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/asignaciones")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.asignacionesadmin.getAll.queryOptions()
  );

  return (
    <DataTable
      columns={assignmentsColumns}
      data={data ?? []}
      isLoading={isLoading}
      actions={() => <AssignmentsActions />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="id"
    />
  );
}
