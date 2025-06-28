/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Loader2, SquarePen, Trash2 } from "lucide-react";
import { EditVehicleForm } from "@/components/dashboard/forms/edit-vehicle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import type { Vehiculo } from "@/types";

export const vehiclesColumns: ColumnDef<Vehiculo>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "patente", header: "Patente" },
  { accessorKey: "marca", header: "Marca" },
  { accessorKey: "modelo", header: "Modelo" },
  { accessorKey: "year", header: "Año" },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return <span className="capitalize">{tipo}</span>;
    },
  },
  {
    accessorKey: "kilometraje",
    header: "Kilometraje",
    cell: ({ row }) => {
      const kilometraje = row.getValue("kilometraje") as number;
      return <span>{kilometraje.toLocaleString()} km</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const vehiculo = row.original;
      const trpc = useTRPC();
      const deleteVehicleMutation = useMutation(
        trpc.vehiculosadmin.delete.mutationOptions()
      );
      const getVehiclesQueryKey = trpc.vehiculosadmin.getAll.queryKey();
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
                <SheetTitle>Editar vehículo</SheetTitle>
                <SheetDescription>
                  Modifica los datos del vehículo y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditVehicleForm initialData={vehiculo} />
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
                <DialogTitle>Eliminar Vehículo</DialogTitle>
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
                      await deleteVehicleMutation.mutate({ id: vehiculo.id });
                      queryClient.invalidateQueries({
                        queryKey: getVehiclesQueryKey,
                      });
                      toast.success("Vehículo eliminado exitosamente");
                    } catch (error) {
                      toast.error("Error al eliminar vehículo");
                      console.error("Error al eliminar vehículo:", error);
                    }
                  }}
                >
                  {deleteVehicleMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <p>Eliminar Vehículo</p>
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
