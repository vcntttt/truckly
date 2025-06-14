import { Hono } from "hono";
import { handle } from "hono/vercel";
import { seedRouter } from "./routes/seed";

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono en Vercel"));

if (process.env.NODE_ENV === "development") {
    app.route("/", seedRouter);
}

export const GET = handle(app);
export const POST = handle(app);
