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
import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import { patentes, conductores } from "@/lib/data";

const formSchema = z.object({
  patente: z.string().min(2).max(10),
  conductor: z.string().min(2).max(50),
  fechaAsignacion: z.string().min(2),
  motivo: z.string().min(2).max(50),
  estado: z.enum(["pendiente", "completada", "en progreso", "cancelada"]),
});

interface EditAssignmentFormProps {
  initialData: Assignment;
  onSubmit?: (data: Assignment) => void;
}

export const EditAssignmentForm = ({
  initialData,
  onSubmit: onSubmitProp,
}: EditAssignmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (onSubmitProp) onSubmitProp({ ...values, id: initialData.id });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* El id no se muestra ni se edita, pero se conserva */}
        <FormField
          control={form.control}
          name="patente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehículo</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {patentes.map((patente) => (
                      <SelectItem key={patente} value={patente}>
                        {patente}
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
          name="conductor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conductor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un conductor" />
                  </SelectTrigger>
                  <SelectContent>
                    {conductores.map((conductor) => (
                      <SelectItem key={conductor} value={conductor}>
                        {conductor}
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
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "pendiente",
                      "completada",
                      "en progreso",
                      "cancelada",
                    ].map((estado) => (
                      <SelectItem
                        key={estado}
                        value={estado}
                        className="capitalize"
                      >
                        {estado}
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
