export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
};
