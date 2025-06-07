import { initTRPC } from '@trpc/server';
import type { BaseContext, ProtectedContext } from '../context';

type CombinedContext = BaseContext & {
  usuario?: ProtectedContext['usuario'];
};

const t = initTRPC.context<CombinedContext>().create({
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack: process.env.NODE_ENV === 'development' ? shape.data.stack : undefined,
      },
    };
  },
});

export { t };
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export type TRPC = typeof t;