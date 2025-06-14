import type { AppRouter, inferRouterOutputs } from "@/lib/trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Asignaciones = RouterOutputs["asignaciones"]["getAll"][number];
