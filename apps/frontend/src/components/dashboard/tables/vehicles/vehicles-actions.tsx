import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Vehiculo } from "./vehicles-columns";

export const VehiclesActions = ({ table }: { table: Table<Vehiculo> }) => {
  return (
    <div className="flex gap-4">
      <Button variant={"outline"}>Crear</Button>
      <Button variant={"outline"}>Filtrar</Button>
    </div>
  );
};
