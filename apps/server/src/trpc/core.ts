import { initTRPC } from '@trpc/server';
import type { Context } from '../context'; 

const t = initTRPC.context<Context>().create({

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

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export type TRPC = typeof t;