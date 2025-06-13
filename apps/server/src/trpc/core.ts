import { initTRPC } from '@trpc/server';
import type { BaseContext } from '../context';

export const t = initTRPC.context<BaseContext>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
