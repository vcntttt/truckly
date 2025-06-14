
import { Hono } from "hono";
import { resetDB, populateDB } from "../db/seed";

export const seedRouter = new Hono();

seedRouter.post("/seed/reset", async (c) => {
    if (process.env.NODE_ENV !== "development") {
    return c.json({ error: "Solo permitido en desarrollo" }, 403);
    }
    await resetDB();
    return c.json({ ok: true, message: "Base de datos reiniciada" });
});

seedRouter.post("/seed/populate", async (c) => {
    if (process.env.NODE_ENV !== "development") {
    return c.json({ error: "Solo permitido en desarrollo" }, 403);
    }
    await populateDB();
    return c.json({ ok: true, message: "Base de datos poblada" });
});
