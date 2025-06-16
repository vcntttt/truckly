import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

export const getDb = (bindings: { DATABASE_URL: string }) => {
  const { DATABASE_URL } = bindings;

  const sql = neon(DATABASE_URL);
  return drizzle(sql);
};
