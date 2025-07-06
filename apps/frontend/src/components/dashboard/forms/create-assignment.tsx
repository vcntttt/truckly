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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useUsers } from "@/hooks/query/users";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";
import type { Asignaciones, UserWithRole, Vehiculo } from "@/types";

const formSchema = z.object({
  vehiculoId: z.string().nonempty(),
  conductorId: z.string().nonempty(),
  fechaAsignacion: z.string().nonempty(),
  motivo: z.string().min(2).max(50),
  status: z.string().nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateAssignmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export const CreateAssignmentForm = ({
  onClose,
  onSuccess,
  onError,
}: CreateAssignmentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const getKey = trpc.asignacionesadmin.getAll.queryKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiculoId: "",
      conductorId: "",
      fechaAsignacion: "",
      motivo: "",
      status: "pendiente",
    },
  });

  const { data: users, isLoading: usersLoading } = useUsers();

  const conductores = useMemo(
    () => users?.filter((u) => u.role === "conductor"),
    [users]
  );

  const { data: vehiculos, isLoading: vehiculosLoading } = useQuery(
    trpc.vehiculosadmin.getAll.queryOptions()
  );

  const createAssignmentMutation = useMutation(
    trpc.asignacionesadmin.create.mutationOptions({
      onMutate: async (variables) => {
        onClose();
        await queryClient.cancelQueries({ queryKey: getKey });

        const previous = queryClient.getQueryData<Asignaciones[]>(getKey) ?? [];
        const tempId = +Date.now();
        const vehiculo = vehiculos?.find(
          (v) => v.id === Number(variables.vehiculoId)
        );
        const conductor = conductores?.find(
          (c) => c.id === variables.conductorId
        );

        const temp: Asignaciones = {
          id: tempId,
          vehiculo: {
            id: Number(variables.vehiculoId),
            marca: vehiculo?.marca ?? "",
            modelo: vehiculo?.modelo ?? "",
            patente: vehiculo?.patente ?? "",
          } as Vehiculo,
          conductor: {
            id: variables.conductorId,
            name: conductor?.name ?? "",
          } as UserWithRole,
          fechaAsignacion: variables.fechaAsignacion,
          motivo: variables.motivo,
          status: variables.status,
        };
        queryClient.setQueryData<Asignaciones[]>(getKey, (old) => [
          temp,
          ...(old ?? []),
        ]);
        return { previous, tempId };
      },
      onError: (_err, _vars, ctx) => {
        onError();
        queryClient.setQueryData(getKey, ctx?.previous ?? []);
        toast.error("Error al crear asignación");
      },
      onSuccess: (result, _vars, ctx) => {
        queryClient.setQueryData<Asignaciones[]>(getKey, (old) =>
          (old ?? []).map((a) => (a.id === ctx?.tempId ? result.data : a))
        );
        toast.success(result.message || "Asignación creada exitosamente");
        onSuccess();
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getKey });
      },
    })
  );

  function onSubmit(values: FormValues) {
    console.log("Submitting assignment:", values);
    createAssignmentMutation.mutate({
      ...values,
      vehiculoId: Number(values.vehiculoId),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
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
          disabled={createAssignmentMutation.isPending}
        >
          {createAssignmentMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <p>Crear Asignación</p>
          )}
        </Button>
      </form>
    </Form>
  );
};
