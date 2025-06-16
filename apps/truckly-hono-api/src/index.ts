import { Hono } from "hono";
import { testUsersTable } from "./db/schema";
import { getDb } from "./db";
import { buildAuth } from "./auth";

type EnvBindings = { DATABASE_URL: string };
const app = new Hono<{ Bindings: EnvBindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => c.json({ ok: true }));

app.get("/test-users", async (c) => {
  const db = getDb(c.env);
  const users = await db.select().from(testUsersTable);
  return c.json({ users });
});

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = buildAuth(c.env);
  return auth.handler(c.req.raw);
});

export default app;
