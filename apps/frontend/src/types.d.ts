import type { AppRouter, inferRouterOutputs } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Asignaciones = RouterOutputs["asignaciones"]["getAll"][number];

type AdminInfer = typeof authClient.$Infer.Admin;

export type UserWithRole = AdminInfer.ListUsersOutput["users"][number];
