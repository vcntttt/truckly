import { Hono } from "hono";
import { createContext } from "./context";
import { appRouter } from "./trpc/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { seedRouter } from "./routes/seed";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { cors } from "hono/cors";
import { auth } from "./auth/auth";

export const runtime = "nodejs";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*", // ⚠️ inseguro, pero útil en testing
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: false, // ⚠️ OBLIGATORIO si usas "*"
  })
);

app.get("/", (c) => c.text("👋 API TRPC funcionando"));

app.on(["OPTIONS", "GET", "POST"], "/api/auth/*", (c) =>
  auth.handler(c.req.raw)
);

app.all("/trpc/:path", async (c) => {
  const req = new Request(c.req.url, {
    method: c.req.method,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    body: await c.req.text(),
  });

  return fetchRequestHandler({
    endpoint: "/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createContext(opts, c),
  });
});

// 🔧 SOLO en desarrollo: rutas seed y arranque local
if (import.meta.main && process.env.NODE_ENV === "development") {
  const port = Number(process.env.PORT) || 4000;

  app.route("/seed", seedRouter);

  if (typeof Bun !== "undefined") {
    Bun.serve({
      port,
      fetch: (req, server) => app.fetch(req, server), // fix mínimo para Bun
    });
    console.log(`🚀 API local con Bun en http://localhost:${port}`);
  } else {
    serve({ fetch: app.fetch, port });
    console.log(`🚀 API local con Node en http://localhost:${port}`);
  }
}
