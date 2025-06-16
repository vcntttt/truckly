import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createContext } from "./context";
import { appRouter } from "./trpc/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { seedRouter } from "./routes/seed";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { cors } from "hono/cors";
import { auth } from "./auth/auth";

const app = new Hono().basePath("/api");
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://truckly.netlify.app",
      "https://truckly.vercel.app/",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
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

if (process.env.NODE_ENV === "development") {
  const port = Number(process.env.PORT) || 4000;
  app.route("/seed", seedRouter);

  if (typeof Bun !== "undefined") {
    Bun.serve({ port, fetch: app.fetch });
    console.log(`🚀 API local con Bun en http://localhost:${port}`);
  } else {
    serve({ fetch: app.fetch, port });
    console.log(`🚀 API local con Node en http://localhost:${port}`);
  }
}

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);

