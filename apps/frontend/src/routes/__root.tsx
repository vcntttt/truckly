import { Providers } from "@/components/providers";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Providers>
        <Outlet />
        <TanStackRouterDevtools />
      </Providers>
    </>
  ),
});
