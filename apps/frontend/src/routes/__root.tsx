import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { User } from "@/types";
import type { QueryClient } from "@tanstack/react-query";
import type { useTRPC } from "@/lib/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface RouterContext {
  user: User | null;
  queryClient: QueryClient;
  trpc: ReturnType<typeof useTRPC>;
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
    links: [
      {
        rel: "icon",
        href: "/favicon.jpg",
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
});
