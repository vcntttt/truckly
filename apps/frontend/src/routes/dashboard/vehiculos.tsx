import { DataTable } from "@/components/dashboard/tables/data-table";
import { VehiclesActions } from "@/components/dashboard/tables/vehicles/vehicles-actions";
import {
  vehiclesColumns,
  type Vehiculo,
} from "@/components/dashboard/tables/vehicles/vehicles-columns";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/vehiculos")({
  component: RouteComponent,
});

function RouteComponent() {
  const vehiculos: Vehiculo[] = [
    {
      id: 1,
      patente: "JHRX-12",
      marca: "Mercedes-Benz",
      modelo: "Sprinter",
      year: 2021,
      tipo: "van",
    },
    {
      id: 2,
      patente: "KLPT-34",
      marca: "Toyota",
      modelo: "Hilux",
      year: 2018,
      tipo: "pick-up",
    },
    {
      id: 3,
      patente: "MNBV-56",
      marca: "Volvo",
      modelo: "FH",
      year: 2020,
      tipo: "camión",
    },
    {
      id: 4,
      patente: "ZXCV-78",
      marca: "Isuzu",
      modelo: "NQR",
      year: 2019,
      tipo: "camión",
    },
    {
      id: 5,
      patente: "QWER-90",
      marca: "Ford",
      modelo: "Transit",
      year: 2022,
      tipo: "van",
    },
    {
      id: 6,
      patente: "TYUI-11",
      marca: "Nissan",
      modelo: "NV350",
      year: 2023,
      tipo: "furgón",
    },
  ];

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
