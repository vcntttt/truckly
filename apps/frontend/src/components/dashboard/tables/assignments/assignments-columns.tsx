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
import { useState } from "react";

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
      const [isFormOpen, setFormOpen] = useState(false);
      const [isDialogOpen, setDialogOpen] = useState(false);
      const [isSaving, setSaving] = useState(false);

      const assignment = row.original;
      const trpc = useTRPC();
      const queryClient = useQueryClient();
      const key = trpc.asignacionesadmin.getAll.queryKey();

      const deleteAsignacionMutation = useMutation(
        trpc.asignacionesadmin.delete.mutationOptions({
          onMutate: async ({ id }) => {
            setDialogOpen(false);
            await queryClient.cancelQueries({ queryKey: key });
            const previous =
              queryClient.getQueryData<Asignaciones[]>(key) ?? [];
            queryClient.setQueryData<Asignaciones[]>(
              key,
              (old) => old?.filter((a) => a.id !== id) ?? []
            );
            return { previous };
          },
          onError: (_err, _vars, ctx) => {
            setDialogOpen(true);
            queryClient.setQueryData(key, ctx?.previous ?? []);
            toast.error("Error al eliminar asignación");
          },
          onSuccess: () => {
            toast.success("Asignación eliminada exitosamente");
          },
          onSettled: () => {
            setDialogOpen(false);
          },
        })
      );

      return (
        <div className="flex items-center gap-2">
          <Sheet open={isFormOpen} onOpenChange={setFormOpen}>
            <SheetTrigger asChild>
              <Button size={"icon"} variant="outline">
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <SquarePen />
                )}
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
                <EditAssignmentForm
                  initialData={assignment}
                  onClose={() => {
                    setSaving(true);
                    setFormOpen(false);
                  }}
                  onError={() => {
                    setSaving(false);
                    setFormOpen(true);
                  }}
                  onSuccess={() => {
                    setSaving(false);
                    setFormOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                  onClick={() => {
                    deleteAsignacionMutation.mutate({
                      id: assignment.id,
                    });
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
