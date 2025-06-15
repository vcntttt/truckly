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
import { marcasConModelos, vehiculos } from "@/lib/data";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Vehiculo } from "@/components/dashboard/tables/vehicles/vehicles-columns";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  patente: z.string().min(2).max(10),
  marca: z.string().min(2).max(50),
  modelo: z.string().min(2).max(50),
  year: z.number().min(1900),
  tipo: z.string().min(2).max(50),
});

interface EditVehicleFormProps {
  initialData: Vehiculo;
}

export const EditVehicleForm = ({ initialData }: EditVehicleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const trpc = useTRPC();
  const editVehicleMutation = useMutation(
    trpc.vehiculosadmin.update.mutationOptions()
  );
  const getVehiclesQueryKey = trpc.vehiculosadmin.getAll.queryKey();
  const queryClient = useQueryClient();

  const marcas = marcasConModelos.map((item) => item.marca);
  const tipos = Array.from(new Set(vehiculos.map((v) => v.tipo)));
  const [selectedMarca, setSelectedMarca] = useState(initialData.marca || "");
  const modelos =
    marcasConModelos.find((item) => item.marca === selectedMarca)?.modelos ||
    [];

  const watchedMarca = form.watch("marca");
  useEffect(() => {
    setSelectedMarca(watchedMarca);
  }, [watchedMarca]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      editVehicleMutation.mutate({ ...values, id: initialData.id });
      toast.success("Vehículo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: getVehiclesQueryKey });
    } catch (error) {
      toast.error("Error al actualizar vehículo");
      console.error("Error al actualizar vehículo:", error);
    }
    console.log({ ...values, id: initialData.id });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="marca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedMarca(value);
                    form.setValue("modelo", "");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedMarca}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedMarca
                          ? "Selecciona un modelo"
                          : "Selecciona una marca primero"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {modelos.map((modelo) => (
                      <SelectItem key={modelo} value={modelo}>
                        {modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem
                        key={tipo}
                        value={tipo}
                        className="capitalize"
                      >
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {editVehicleMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <p>Guardar Cambios</p>
          )}
        </Button>
      </form>
    </Form>
  );
};
