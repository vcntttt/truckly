import type { Context } from 'hono';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
export interface UserSession {
  sub: string;
  email: string;
  rol: 'ADMIN' | 'CONDUCTOR';
}

export interface BaseContext {
  req: Request;
  authorization: string | null;
  user?: UserSession; 
}

export interface ProtectedContext extends BaseContext {
  user: UserSession;
}

export const createContext = (_opts: FetchCreateContextFnOptions, c: Context) => {
  const authorization = c.req.header('authorization') ?? null;
  return {
    req: c.req.raw,
    authorization,
  };
};
