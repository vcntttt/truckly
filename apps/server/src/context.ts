import { inferAsyncReturnType } from '@trpc/server';
import { HonoRequest } from 'hono';

export async function createContext({ req }: { req: HonoRequest }) {
  return { req };
}

export type Context = inferAsyncReturnType<typeof createContext>;