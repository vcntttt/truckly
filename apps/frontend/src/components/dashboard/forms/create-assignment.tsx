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
import { conductores, vehiculos } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  id: z.string(),
  patenteVehiculo: z.string().min(2).max(10),
  conductor: z.string().min(2).max(50),
  dueDate: z.string().min(2),
  motivo: z.string().min(2).max(50),
  estado: z.enum(["pendiente", "completada", "en progreso", "cancelada"]),
});

export const CreateAssignmentForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      patenteVehiculo: "",
      conductor: "",
      dueDate: "",
      motivo: "",
      estado: "pendiente",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patenteVehiculo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehiculo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el vehiculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehiculos.map((vehiculo) => (
                    <SelectItem key={vehiculo.id} value={vehiculo.patente}>
                      {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conductor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conductor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un conductor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {conductores.map((conductor) => (
                    <SelectItem key={conductor} value={conductor}>
                      {conductor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
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
                <FormLabel>Fecha de entrega*</FormLabel>
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
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Seleccione un conductor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["pendiente", "completada", "en progreso", "cancelada"].map(
                    (state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="capitalize"
                      >
                        {state}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Crear Asignación
        </Button>
      </form>
    </Form>
  );
};
