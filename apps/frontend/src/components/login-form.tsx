import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { authClient, signIn } from "@/lib/auth-client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/auth-store";
const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: async () => {
            const { data } = await authClient.getSession();
            await useAuthStore.getState().refresh();
            const role = data!.user.role;
            const destino: "/dashboard" | "/conductor" =
              role === "admin" ? "/dashboard" : "/conductor";

            navigate({ to: destino });
          },
        },
      });
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md py-8 px-4">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Iniciar sesión</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Inicia sesión para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vrivera@truckly.cl"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <p>Iniciar sesión</p>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
