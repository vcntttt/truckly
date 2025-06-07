import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASS!,
        database: process.env.DB_NAME!,
        ssl: (process.env.DB_SSL as "require" | "allow" | "prefer" | "verify-full" | undefined) ?? false,
    },
});
