import type { AppRouter } from "../../../server/src/trpc/root";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { inferRouterOutputs } from "@trpc/server";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export type { AppRouter, inferRouterOutputs };
