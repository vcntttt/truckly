import { Hono } from "hono";
import { usersTable } from "./db/schema";
import { getDb } from "./db";

type EnvBindings = { DATABASE_URL: string };
const app = new Hono<{ Bindings: EnvBindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => c.json({ ok: true }));

app.get("/users", async (c) => {
  const db = getDb(c.env);
  const users = await db.select().from(usersTable);
  return c.json({ users });
});

export default app;
