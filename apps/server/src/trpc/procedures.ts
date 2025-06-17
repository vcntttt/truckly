import { t } from "./core";
import { TRPCError } from "@trpc/server";
import { authMiddleware } from "../auth/middleware";

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(authMiddleware);

export const adminProcedure = t.procedure
  .use(authMiddleware)
  .use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admins only" });
    }
    return next();
  });
