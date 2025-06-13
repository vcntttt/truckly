import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table as TableType,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  isLoading: boolean;
  actions?: (table: TableType<TData>) => React.ReactNode;
  viewOptions: (table: TableType<TData>) => React.ReactNode;
  searchParam: string;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  isLoading,
  actions,
  viewOptions,
  searchParam,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const firstHeaderGroup = table.getHeaderGroups()[0];
  const headerCell = firstHeaderGroup.headers.find(
    (h) => h.column.id === searchParam
  );
  const rawLabel = headerCell
    ? flexRender(headerCell.column.columnDef.header, headerCell.getContext())
    : searchParam;
  const placeholderLabel =
    typeof rawLabel === "string" ? rawLabel : String(rawLabel);

  return (
    <div className="rounded-md">
      <div className="flex items-center pb-2 justify-between">
        <Input
          type="text"
          placeholder={`Buscar por ${placeholderLabel}`}
          value={
            (table.getColumn(searchParam)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchParam)?.setFilterValue(event.target.value)
          }
          className="max-w-md"
        />
        <div className="flex items-center justify-end gap-x-4 py-4 mx-2">
          {actions?.(table)}
          {viewOptions?.(table)}
        </div>
      </div>
      <Table className="border">
        <TableHeader className="bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay información.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
