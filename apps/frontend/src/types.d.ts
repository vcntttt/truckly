import type { AppRouter, inferRouterOutputs } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Asignaciones = RouterOutputs["asignacionesadmin"]["getAll"][number];
export type Vehiculo = RouterOutputs["vehiculosadmin"]["getAll"][number];

type AdminInfer = typeof authClient.$Infer.Admin;

export type UserWithRole = AdminInfer.ListUsersOutput["users"][number];

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
