import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { User } from "@/types";
import type { QueryClient } from "@tanstack/react-query";
import type { useTRPC } from "@/lib/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/lib/auth-store";
import { useEffect } from "react";

interface RouterContext {
  user: User | null;
  queryClient: QueryClient;
  trpc: ReturnType<typeof useTRPC>;
}

function RootComponent() {
  const { refresh, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unSub = useAuthStore.subscribe((state) => {
      if (state.user === null && window.location.pathname !== "/") {
        router.navigate({ to: "/" });
      }
    });

    return () => {
      unSub();
    };
  }, [router, user]);

  return (
    <>
      <HeadContent />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
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
  component: RootComponent,
});
