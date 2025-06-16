import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context as HonoContext } from "hono";
import { auth } from "./auth/auth";

export async function createContext(
  _opts: FetchCreateContextFnOptions,
  c: HonoContext
) {
  const session = await auth.api
    .getSession({
      headers: c.req.raw.headers,
    })
    .catch(() => null);

  return {
    req: c.req.raw,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
