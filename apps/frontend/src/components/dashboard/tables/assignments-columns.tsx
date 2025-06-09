import type { ColumnDef } from "@tanstack/react-table";

export interface Assignment {
  id: number;
  patente: string;
  conductor: string;
  fechaAsignacion: string; // ISO timestamp
  motivo: string;
  estado: string;
}

export const assignmentsColumns: ColumnDef<Assignment>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "patente", header: "Vehículo" },
  { accessorKey: "conductor", header: "Conductor" },
  {
    accessorKey: "fechaAsignacion",
    header: "Fecha Asignación",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaAsignacion") as string;
      return <span>{new Date(fecha).toLocaleString()}</span>;
    },
  },
  { accessorKey: "motivo", header: "Motivo" },
  { accessorKey: "estado", header: "Estado" },
];
