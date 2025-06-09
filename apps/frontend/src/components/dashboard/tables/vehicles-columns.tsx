import type { ColumnDef } from "@tanstack/react-table";

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: string;
}

export const vehiclesColumns: ColumnDef<Vehiculo>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "patente", header: "Patente" },
  { accessorKey: "marca", header: "Marca" },
  { accessorKey: "modelo", header: "Modelo" },
  { accessorKey: "year", header: "Año" },
  { accessorKey: "tipo", header: "Tipo" },
];
