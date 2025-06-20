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
import type { UserWithRole } from "@/types";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateUser } from "@/hooks/query/users";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(["admin", "conductor"]),
});

interface EditUserFormProps {
  initialData: UserWithRole;
}

export const EditUserForm = ({ initialData }: EditUserFormProps) => {
  const updateUserMutation = useUpdateUser();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      firstName: initialData.name.split(" ")[0],
      lastName: initialData.name.split(" ")[1],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUserMutation.mutateAsync({
        id: initialData.id,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      });
      navigate({
        to: location.pathname,
        replace: true,
      });
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conductor">Conductor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
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
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <p>Guardar Cambios</p>
          )}
        </Button>
      </form>
    </Form>
  );
};
