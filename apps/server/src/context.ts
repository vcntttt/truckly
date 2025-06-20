import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context as HonoContext } from "hono";

export async function createContext(
  _opts: FetchCreateContextFnOptions,
  c: HonoContext
) {
  return {
    user: c.get("user"),
    session: c.get("session"),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
