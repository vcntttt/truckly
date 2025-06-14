import { AssignmentsActions } from "@/components/dashboard/tables/assignments/assignments-actions";
import { assignmentsColumns } from "@/components/dashboard/tables/assignments/assignments-columns";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { assignments } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/asignaciones")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DataTable
      columns={assignmentsColumns}
      data={assignments}
      isLoading={false}
      actions={() => <AssignmentsActions />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="id"
    />
  );
}
