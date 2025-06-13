import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono en Vercel"));

export const GET = handle(app);
export const POST = handle(app);
