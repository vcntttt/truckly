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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Asignaciones } from "@/types";
import { useMemo } from "react";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/hooks/query/users";
import { cn } from "@/lib/utils/cn";
import { es } from "date-fns/locale/es";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

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
  const trpc = useTRPC();

  const { data: users, isLoading: usersLoading } = useUsers();

  const conductores = useMemo(
    () => users?.filter((u) => u.role === "conductor"),
    [users]
  );

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
                      conductores?.map((c) => (
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
          render={({ field }) => {
            const selectedDate = field.value
              ? new Date(field.value)
              : undefined;

            // para mostrar la hora en el input
            const timeValue = selectedDate
              ? selectedDate.toTimeString().slice(0, 8) // "HH:MM:SS"
              : "12:00:00";

            return (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP 'hasta las' p", {
                            locale: es,
                          }) // "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss"
                        ) : (
                          <span>Selecciona fecha y hora</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        className="p-2"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) return;
                          const h = selectedDate?.getHours() ?? 0;
                          const m = selectedDate?.getMinutes() ?? 0;
                          const s = selectedDate?.getSeconds() ?? 0;

                          const newDate = new Date(date);
                          newDate.setHours(h, m, s);

                          field.onChange(newDate.toISOString());
                        }}
                        disabled={(date) => date < new Date()}
                      />

                      <div className="border-t p-3">
                        <div className="flex items-center gap-3">
                          <Label className="text-xs">Hora Límite</Label>
                          <div className="relative grow">
                            <Input
                              type="time"
                              step="1"
                              value={timeValue}
                              onChange={(e) => {
                                const [hh, mm, ss] = e.target.value
                                  .split(":")
                                  .map((n) => parseInt(n, 10));

                                // fusionamos la hora nueva con la fecha seleccionada (o hoy)
                                const base = selectedDate ?? new Date();
                                const newDate = new Date(base);
                                newDate.setHours(hh, mm, ss);

                                field.onChange(newDate.toISOString());
                              }}
                              className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                            />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                              <ClockIcon size={16} aria-hidden="true" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
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

        <Button
          className="w-full"
          type="submit"
          disabled={editAssignmentMutation.isPending}
        >
          {editAssignmentMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <p>Guardar Cambios</p>
          )}
        </Button>
      </form>
    </Form>
  );
};
