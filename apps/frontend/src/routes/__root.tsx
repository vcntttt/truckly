import { Providers } from "@/components/providers";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

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
        <TanStackRouterDevtools position="bottom-right" />
      </Providers>
    </>
  ),
});
