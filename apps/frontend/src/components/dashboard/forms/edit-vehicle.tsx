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
});

type FormValues = z.infer<typeof formSchema>;

interface EditVehicleFormProps {
  initialData: Vehiculo;
}

export const EditVehicleForm = ({ initialData }: EditVehicleFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const getVehiclesKey = useMemo(
    () => trpc.vehiculosadmin.getAll.queryKey(),
    [trpc]
  );

  const vehiculos = useMemo(
    () => queryClient.getQueryData<Vehiculo[]>(getVehiclesKey) ?? [],
    [queryClient, getVehiclesKey]
  );

  const marcas = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.marca))).sort(),
    [vehiculos]
  );
  const tipos = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.tipo))).sort(),
    [vehiculos]
  );

  const [selectedMarca, setSelectedMarca] = useState<string>(initialData.marca);
  const modelos = useMemo(() => {
    return Array.from(
      new Set(
        vehiculos.filter((v) => v.marca === selectedMarca).map((v) => v.modelo)
      )
    ).sort();
  }, [vehiculos, selectedMarca]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patente: initialData.patente,
      marca: initialData.marca,
      modelo: initialData.modelo,
      year: initialData.year,
      tipo: initialData.tipo,
    },
  });

  const watchedMarca = form.watch("marca");
  useEffect(() => {
    setSelectedMarca(watchedMarca);
  }, [watchedMarca]);

  // 4. Mutation para actualizar vehículo
  const editVehicleMutation = useMutation(
    trpc.vehiculosadmin.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.vehiculosadmin.getAll.queryKey(),
        });
        toast.success("Vehículo actualizado exitosamente");
      },
      onError: () => {
        toast.error("Error al actualizar vehículo");
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
                <Input placeholder="Patente" {...field} />
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
                  placeholder="Año"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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

        <Button
          className="w-full"
          type="submit"
          disabled={editVehicleMutation.isPending}
        >
          {editVehicleMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </form>
    </Form>
  );
};
