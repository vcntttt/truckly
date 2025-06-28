import { DataTable } from "@/components/dashboard/tables/data-table";
import { VehiclesActions } from "@/components/dashboard/tables/vehicles/vehicles-actions";
import { vehiclesColumns } from "@/components/dashboard/tables/vehicles/vehicles-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/vehiculos")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data, isLoading, refetch, isRefetching } = useQuery(
    trpc.vehiculosadmin.getAll.queryOptions()
  );

  return (
    <DataTable
      columns={vehiclesColumns}
      data={data ?? []}
      isLoading={isLoading || isRefetching}
      actions={() => <VehiclesActions />}
      viewOptions={(table) => (
        <DataTableViewOptions
          table={table}
          refetchFn={refetch}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
      )}
      searchParam="patente"
    />
  );
}
