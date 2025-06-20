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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Asignaciones, UserWithRole } from "@/types";
import { authClient } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  vehiculoId: z.string().nonempty(),
  conductorId: z.string().nonempty(),
  fechaAsignacion: z.string().nonempty(),
  motivo: z.string().min(2).max(50),
  status: z.string().nonempty(),
});
type FormValues = z.infer<typeof formSchema>;

interface EditAssignmentFormProps {
  initialData: Asignaciones;
}

export const EditAssignmentForm = ({
  initialData,
}: EditAssignmentFormProps) => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [usersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    setIsUsersLoading(true);
    authClient.admin
      .listUsers({ query: {} })
      .then(({ data, error }) => {
        if (error) throw error;
        setUsers(data.users);
      })
      .catch(console.error)
      .finally(() => setIsUsersLoading(false));
  }, []);

  const conductores = useMemo(
    () => users.filter((u) => u.role === "conductor"),
    [users]
  );

  const trpc = useTRPC();
  const { data: vehiculos, isLoading: vehiculosLoading } = useQuery(
    trpc.vehiculosadmin.getAll.queryOptions()
  );

  const editAssignmentMutation = useMutation(
    trpc.asignacionesadmin.update.mutationOptions()
  );

  const getAssignmentsQueryKey = trpc.asignacionesadmin.getAll.queryKey();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiculoId: String(initialData.vehiculo?.id ?? ""),
      conductorId: initialData.conductor?.id ?? "",
      fechaAsignacion: initialData.fechaAsignacion?.slice(0, 16) ?? "",
      motivo: initialData.motivo,
      status: initialData.status,
    },
  });

  function onSubmit(values: FormValues) {
    try {
      editAssignmentMutation.mutate({
        ...values,
        id: initialData.id,
        vehiculoId: Number(values.vehiculoId),
      });
      queryClient.invalidateQueries({ queryKey: getAssignmentsQueryKey });
      toast.success("Asignación guardada exitosamente");
    } catch (error) {
      toast.error("Error al guardar asignación");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Selección de Vehículo */}
        <FormField
          control={form.control}
          name="vehiculoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehículo</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={vehiculosLoading}
                >
                  <SelectTrigger className="w-full">
                    {vehiculosLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        <p>Cargando vehículos...</p>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona vehículo" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculosLoading ? (
                      <SelectItem disabled value="loading">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Cargando…
                      </SelectItem>
                    ) : (
                      vehiculos?.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.patente} – {v.marca} {v.modelo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selección de Conductor */}
        <FormField
          control={form.control}
          name="conductorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conductor</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={usersLoading}
                >
                  <SelectTrigger className="w-full">
                    {usersLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        <p>Cargando conductores...</p>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona conductor" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem disabled value="loading">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Cargando…
                      </SelectItem>
                    ) : (
                      conductores.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha */}
        <FormField
          control={form.control}
          name="fechaAsignacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Asignación</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Motivo */}
        <FormField
          control={form.control}
          name="motivo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Input placeholder="Motivo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "pendiente",
                      "en progreso",
                      "completada",
                      "cancelada",
                    ].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
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
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
};
