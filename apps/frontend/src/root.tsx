import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "./lib/auth-store";
import { router } from "./main";
import { useTRPC } from "./lib/trpc";
import { queryClient } from "./lib/clients";
import { Providers } from "./components/providers";

function SubRoot() {
  const { user } = useAuthStore();
  const trpc = useTRPC();

  return (
    <RouterProvider router={router} context={{ user, trpc, queryClient }} />
  );
}
export function Root() {
  return (
    <Providers>
      <SubRoot />
    </Providers>
  );
}
