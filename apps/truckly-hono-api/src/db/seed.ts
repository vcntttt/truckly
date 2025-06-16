import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { testUsersTable } from "./schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

async function main() {
  const user = {
    name: "John",
    age: 30,
    email: "john@example.com",
  } satisfies typeof testUsersTable.$inferInsert;

  await db.insert(testUsersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(testUsersTable);
  console.log("Current users:", users);
}

main().catch(console.error);
