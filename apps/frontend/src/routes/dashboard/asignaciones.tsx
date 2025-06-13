import { AssignmentsActions } from "@/components/dashboard/tables/assignments/assignments-actions";
import {
  assignmentsColumns,
  type Assignment,
} from "@/components/dashboard/tables/assignments/assignments-columns";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { DataTableViewOptions } from "@/components/dashboard/tables/view-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/asignaciones")({
  component: RouteComponent,
});

function RouteComponent() {
  const assignments: Assignment[] = [
    {
      id: 1,
      patente: "KLPT-34",
      conductor: "Juan Pérez",
      fechaAsignacion: "2025-06-01T08:00:00Z",
      motivo: "Entrega de mercancía",
      estado: "pendiente",
    },
    {
      id: 2,
      patente: "QWER-90",
      conductor: "María González",
      fechaAsignacion: "2025-06-02T09:30:00Z",
      motivo: "Traslado de personal",
      estado: "completada",
    },
    {
      id: 3,
      patente: "JHRX-12",
      conductor: "Carlos Ramírez",
      fechaAsignacion: "2025-06-03T14:15:00Z",
      motivo: "Revisión técnica",
      estado: "en progreso",
    },
    {
      id: 4,
      patente: "MNBV-56",
      conductor: "Ana Torres",
      fechaAsignacion: "2025-06-04T07:45:00Z",
      motivo: "Entrega urgente",
      estado: "pendiente",
    },
    {
      id: 5,
      patente: "ZXCV-78",
      conductor: "Francisco Díaz",
      fechaAsignacion: "2025-06-05T16:20:00Z",
      motivo: "Cambio de ruta",
      estado: "cancelada",
    },
    {
      id: 6,
      patente: "TYUI-11",
      conductor: "Lucía Vega",
      fechaAsignacion: "2025-06-06T11:10:00Z",
      motivo: "Mantenimiento preventivo",
      estado: "completada",
    },
  ];
  return (
    <DataTable
      columns={assignmentsColumns}
      data={assignments}
      isLoading={false}
      actions={(table) => <AssignmentsActions table={table} />}
      viewOptions={(table) => <DataTableViewOptions table={table} />}
      searchParam="id"
    />
  );
}
