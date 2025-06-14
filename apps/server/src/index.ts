import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createSeedRouter } from "./db/seed";

const app = new Hono();
if (process.env.NODE_ENV !== "production") {
  app.route("/seed", createSeedRouter());
}
app.get("/", (c) => c.text("Hello Hono en Vercel"));

export const GET = handle(app);
export const POST = handle(app);
