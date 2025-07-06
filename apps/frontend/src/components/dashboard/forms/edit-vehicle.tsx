import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Vehiculo } from "@/types";

const formSchema = z.object({
  patente: z.string().min(2).max(10),
  marca: z.string().min(2),
  modelo: z.string().min(2),
  year: z.number().min(1900),
  tipo: z.string().min(2),
  kilometraje: z.number().min(0),
});
type FormValues = z.infer<typeof formSchema>;

interface EditVehicleFormProps {
  initialData: Vehiculo;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export const EditVehicleForm = ({
  initialData,
  onClose,
  onError,
  onSuccess,
}: EditVehicleFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const getVehiclesKey = trpc.vehiculosadmin.getAll.queryKey();

  const vehiculos = useMemo(() => {
    const cached = queryClient.getQueryData<Vehiculo[]>(getVehiclesKey) ?? [];
    return cached.length > 0 ? cached : [initialData];
  }, [queryClient, getVehiclesKey, initialData]);

  const marcas = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.marca))).sort(),
    [vehiculos]
  );
  const tipos = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.tipo))).sort(),
    [vehiculos]
  );

  // estado para cascada marca → modelos
  const [selectedMarca, setSelectedMarca] = useState(initialData.marca);
  const modelos = useMemo(
    () =>
      Array.from(
        new Set(
          vehiculos
            .filter((v) => v.marca === selectedMarca)
            .map((v) => v.modelo)
        )
      ).sort(),
    [vehiculos, selectedMarca]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patente: initialData.patente,
      marca: initialData.marca,
      modelo: initialData.modelo,
      year: initialData.year,
      tipo: initialData.tipo,
      kilometraje: initialData.kilometraje,
    },
  });
  const watchedMarca = form.watch("marca");
  useEffect(() => {
    setSelectedMarca(watchedMarca);
  }, [watchedMarca]);

  // mutation
  const editVehicleMutation = useMutation(
    trpc.vehiculosadmin.update.mutationOptions({
      onMutate: async (newData) => {
        onClose();
        await queryClient.cancelQueries({ queryKey: getVehiclesKey });
        const previous =
          queryClient.getQueryData<Vehiculo[]>(getVehiclesKey) ?? [];
        queryClient.setQueryData<Vehiculo[]>(
          getVehiclesKey,
          (old) =>
            old?.map((v) => (v.id === newData.id ? { ...v, ...newData } : v)) ??
            []
        );
        return { previous };
      },
      onError: (_err, _newData, context) => {
        onError();
        queryClient.setQueryData(getVehiclesKey, context?.previous ?? []);
        toast.error("Error al editar vehículo");
      },
      onSuccess: () => {
        onSuccess();
        toast.success("Vehículo editado exitosamente");
      },
    })
  );

  function onSubmit(values: FormValues) {
    editVehicleMutation.mutate({ ...values, id: initialData.id });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Patente */}
        <FormField
          control={form.control}
          name="patente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patente</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Patente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Marca */}
        <FormField
          control={form.control}
          name="marca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedMarca(val);
                    form.setValue("modelo", "");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Modelo */}
        <FormField
          control={form.control}
          name="modelo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedMarca}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedMarca
                          ? "Selecciona modelo"
                          : "Elige una marca primero"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {modelos.map((mod) => (
                      <SelectItem key={mod} value={mod}>
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Año */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo */}
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kilometraje */}
        <FormField
          control={form.control}
          name="kilometraje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilómetros</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={editVehicleMutation.isPending}
        >
          {editVehicleMutation.isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </form>
    </Form>
  );
};
