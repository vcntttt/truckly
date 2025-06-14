import { t } from "../trpc/core";
import { TRPCError } from "@trpc/server";

export const authMiddleware = t.middleware(({ ctx, next }) => {
  const user = ctx.session?.user;
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not signed in" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
