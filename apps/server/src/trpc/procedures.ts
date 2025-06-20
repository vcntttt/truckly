import { t } from "./core";
import { TRPCError } from "@trpc/server";

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Debe iniciar sesión",
    });
  }
  return next();
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acceso solo administradores",
    });
  }
  return next();
});

export const adminProcedure = protectedProcedure.use(isAdmin);
