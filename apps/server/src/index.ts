import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth/auth";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/root";
import { createContext } from "./context";

const app = new Hono();

app.use(cors());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => c.text("Servidor corriendo"));

const port = 3000;

console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
