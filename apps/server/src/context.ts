import type { HonoRequest } from 'hono';
import type { Database } from '../db/types';

export type UserSession = {
  id: number;
  email: string;
  rol: 'ADMIN' | 'CONDUCTOR';
};

export async function createContext({
  req,
  db
}: {
  req: HonoRequest;
  db: Database;
}) {
  return {
    req,
    db,
  };
}

export type BaseContext = Awaited<ReturnType<typeof createContext>>;
export type ProtectedContext = BaseContext & { usuario: UserSession };