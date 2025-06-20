import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const user = context.user;
    if (!user) return;

    const destino = user.role === "admin" ? "/dashboard" : "/conductor";
    throw redirect({ to: destino });
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
