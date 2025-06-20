import { Hono } from "hono";
import { createContext } from "./context";
import { appRouter } from "./trpc/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { seedRouter } from "./routes/seed";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { cors } from "hono/cors";
import { auth } from "./auth/auth";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://truckly.netlify.app/"], // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/", (c) => c.text("👋 API TRPC funcionando"));

app.all("/trpc/:path", async (c) =>
  fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts, c),
  })
);

if (import.meta.main && process.env.NODE_ENV === "development") {
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
