import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Assignment } from "./assignments-columns";

export const AssignmentsActions = ({ table }: { table: Table<Assignment> }) => {
  return (
    <div className="flex gap-4">
      <Button variant={"outline"}>Crear</Button>
      <Button variant={"outline"}>Filtrar</Button>
    </div>
  );
};
