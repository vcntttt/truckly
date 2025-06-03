import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./apps/server/src/db/schema",
    out: "./apps/server/drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "postgres",
        database: "truckly_db"
    }
});

