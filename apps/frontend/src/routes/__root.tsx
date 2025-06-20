import { Providers } from "@/components/providers";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { User } from "@/types";

interface RouterContext {
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
