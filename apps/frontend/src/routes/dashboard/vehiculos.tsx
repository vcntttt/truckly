import { DataTable } from "@/components/dashboard/tables/data-table";
import { VehiclesActions } from "@/components/dashboard/tables/vehicles/vehicles-actions";
import { vehiclesColumns } from "@/components/dashboard/tables/vehicles/vehicles-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { vehiculos } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/vehiculos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DataTable
      columns={vehiclesColumns}
      data={vehiculos}
      isLoading={false}
      actions={() => <VehiclesActions />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="patente"
    />
  );
}
