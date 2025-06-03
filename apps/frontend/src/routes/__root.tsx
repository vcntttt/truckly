import { Providers } from "@/components/providers";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: "Truckly",
      },
      {
        name: "description",
        content: "Plataforma de gestión de flotas de vehículos",
      },
    ],
  }),
  component: () => (
    <>
      <Providers>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools />
      </Providers>
    </>
  ),
});
