import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler, Resolver } from "react-hook-form";
import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Zod + preprocess para convertir string→number
const formSchema = z.object({
  kilometraje: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? val : parsed;
      }
      return val;
    },
    z
      .number({ invalid_type_error: "Debe ingresar un número" })
      .min(0, { message: "El kilometraje debe ser positivo" })
  ),
});

type RegisterKilometrajeValues = z.infer<typeof formSchema>;

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: string;
  kilometraje?: number;
  fueraServicio?: boolean;
  proximoMantenimiento?: Date | string;
}

interface RegisterKilometrajeProps {
  asignacionId: number;
  vehiculo: Vehiculo;
  onSuccess: () => void;
}

export const RegisterKilometraje = ({
  asignacionId,
  vehiculo,
  onSuccess,
}: RegisterKilometrajeProps): React.ReactElement => {
  const trpc = useTRPC();
  const updateVehicle = useMutation(
    trpc.vehiculos.updateById.mutationOptions()
  );
  const updateStatus = useMutation(
    trpc.asignaciones.updateStatus.mutationOptions()
  );

  const form = useForm<RegisterKilometrajeValues>({
    resolver: zodResolver(formSchema) as Resolver<
      RegisterKilometrajeValues
    >,
    defaultValues: { kilometraje: vehiculo.kilometraje ?? 0 },
  });

  // Ahora values tiene el tipo correcto y TS no emitirá 'any'
  const onSubmit: SubmitHandler<RegisterKilometrajeValues> = (values) => {
    const { patente, marca, modelo, year, tipo } = vehiculo;
    const fueraServicio = vehiculo.fueraServicio ?? false;

    // Si viene como string, lo parseamos a Date
    const proximoMantenimiento =
      typeof vehiculo.proximoMantenimiento === "string"
        ? new Date(vehiculo.proximoMantenimiento)
        : vehiculo.proximoMantenimiento ?? new Date();

    const vehiculoData = {
      patente,
      marca,
      modelo,
      year,
      tipo,
      kilometraje: values.kilometraje,
      fueraServicio,
      proximoMantenimiento,
    };

    updateVehicle.mutate(
      { id: vehiculo.id, data: vehiculoData },
      {
        onError(err) {
          toast.error(`Error al actualizar vehículo: ${err.message}`);
        },
        onSuccess() {
          updateStatus.mutate(
            { id: asignacionId, status: "completada" },
            {
              onError(err) {
                toast.error(
                  `Error al actualizar asignación: ${err.message}`
                );
              },
              onSuccess() {
                toast.success(
                  "Kilometraje registrado y asignación completada"
                );
                onSuccess();
              },
            }
          );
        },
      }
    );
  };

  const isSubmitting = updateVehicle.isPending || updateStatus.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="kilometraje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilometraje</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingresa kilometraje actual"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Guardar"
          )}
        </Button>
      </form>
    </Form>
  );
};
