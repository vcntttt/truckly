import { initTRPC } from '@trpc/server';
import type { BaseContext, ProtectedContext } from '../context';
import { authMiddleware } from '../auth/middleware';

export const t = initTRPC.context<BaseContext>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(authMiddleware) as ReturnType<typeof t.procedure.use> & {
  ctx: ProtectedContext
};

