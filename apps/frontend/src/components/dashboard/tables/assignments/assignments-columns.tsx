/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, SquarePen, Trash2 } from "lucide-react";
import { EditAssignmentForm } from "@/components/dashboard/forms/edit-assignment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Asignaciones } from "@/types";

export const assignmentsColumns: ColumnDef<Asignaciones>[] = [
  {
    accessorKey: "id",
    header: "ID",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue<number>(columnId));
      return cellValue.includes(String(filterValue));
    },
  },
  {
    id: "vehiculoModelo",
    header: "Vehículo",
    accessorKey: "vehiculo.id",
    cell: ({ row }) => {
      const { vehiculo } = row.original;
      return (
        <p>
          {vehiculo?.marca} - {vehiculo?.modelo}
        </p>
      );
    },
  },
  {
    id: "conductorName",
    header: "Conductor",
    accessorKey: "conductor.id",
    cell: ({ row }) => {
      const { conductor } = row.original;
      return <p>{conductor?.name}</p>;
    },
  },
  {
    accessorKey: "fechaAsignacion",
    header: "Fecha Asignación",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaAsignacion") as string;
      return <span>{new Date(fecha).toLocaleString()}</span>;
    },
  },
  { accessorKey: "motivo", header: "Motivo" },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pendiente"
        | "en progreso"
        | "completada"
        | "cancelada";
      return (
        <Badge
          variant={
            status === "pendiente"
              ? "default"
              : status === "en progreso"
                ? "secondary"
                : status === "completada"
                  ? "success"
                  : "destructive"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const assignment = row.original;
      const trpc = useTRPC();
      const deleteAsignacionMutation = useMutation(
        trpc.asignacionesadmin.delete.mutationOptions()
      );
      const getAsignacionesQueryKey = trpc.asignacionesadmin.getAll.queryKey();
      const queryClient = useQueryClient();

      return (
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant="outline">
                <SquarePen />
              </Button>
            </SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <SheetHeader>
                <SheetTitle>Editar asignación</SheetTitle>
                <SheetDescription>
                  Modifica los datos de la asignación y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditAssignmentForm initialData={assignment} />
              </div>
            </SheetContent>
          </Sheet>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"icon"} variant="outline">
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Eliminar Asignación</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    try {
                      await deleteAsignacionMutation.mutate({
                        id: assignment.id,
                      });
                      queryClient.invalidateQueries({
                        queryKey: getAsignacionesQueryKey,
                      });
                      toast.success("Vehículo eliminado exitosamente");
                    } catch (error) {
                      toast.error("Error al eliminar vehículo");
                      console.error("Error al eliminar vehículo:", error);
                    }
                  }}
                >
                  {deleteAsignacionMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <p>Eliminar Asignación</p>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
