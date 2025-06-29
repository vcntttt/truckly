
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

// Esquema Zod: solo el campo de kilometraje
const formSchema = z.object({
  kilometraje: z
    .number({ invalid_type_error: "Debe ingresar un número" })
    .min(0, { message: "El kilometraje debe ser positivo" }),
});

type RegisterKilometrajeValues = z.infer<typeof formSchema>;

// Definición del tipo Vehiculo según lo retornado por TRPC
interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: string;
  kilometraje?: number;
  fueraServicio?: boolean;
  // Fecha de próximo mantenimiento, si está disponible
  proximoMantenimiento?: Date;
}

interface RegisterKilometrajeProps {
  asignacionId: number;
  vehiculo: Vehiculo;
  onSuccess: () => void;
}

export const RegisterKilometraje = (
  { asignacionId, vehiculo, onSuccess }: RegisterKilometrajeProps
): React.ReactElement => {
  const trpc = useTRPC();
  // Mutaciones TRPC existentes: actualizar vehículo y estado de asignación
  const updateVehicleMutation = useMutation(
    trpc.vehiculos.updateById.mutationOptions()
  );
  const updateStatusMutation = useMutation(
    trpc.asignaciones.updateStatus.mutationOptions()
  );

  // React Hook Form con Zod
  const form = useForm<RegisterKilometrajeValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { kilometraje: vehiculo.kilometraje ?? 0 },
  });

  // Al enviar: primero actualizar vehículo, luego estado de asignación
  const onSubmit = (values: RegisterKilometrajeValues) => {
    // Desestructuramos campos base del vehículo
    const { patente, marca, modelo, year, tipo } = vehiculo;
    const fueraServicio = vehiculo.fueraServicio ?? false;
    // Aseguramos un valor para proximoMantenimiento (requerido por el servidor)
    const proximoMantenimiento =
      vehiculo.proximoMantenimiento ?? new Date();

    // Preparamos el objeto con todas las propiedades necesarias
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

    updateVehicleMutation.mutate(
      { id: vehiculo.id, data: vehiculoData },
      {
        onError(error) {
          toast.error(`Error al actualizar vehículo: ${error.message}`);
        },
        onSuccess() {
          updateStatusMutation.mutate(
            { id: asignacionId, status: "completada" },
            {
              onError(error) {
                toast.error(
                  `Error al actualizar asignación: ${error.message}`
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

  const isSubmitting =
    updateVehicleMutation.isPending || updateStatusMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo kilometraje */}
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

        {/* Botón de envío */}
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

