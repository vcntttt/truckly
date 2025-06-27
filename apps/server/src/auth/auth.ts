import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/server";
import { admin } from "better-auth/plugins";
import { ac, conductorAc } from "./permissions";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { authSchema } from "./auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: { type: "string" },
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminAc,
        user: userAc,
        conductor: conductorAc,
      },
      defaultRole: "conductor",
      adminRoles: ["admin"],
    }),
  ],
  trustedOrigins: [
  "http://localhost:5173",
  "https://truckly.netlify.app",      // ← sin slash final
  "https://truckly.vercel.app",
  "http://localhost:4000",
],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure:true,
      partitioned: true,
    },
  },
});

export type AuthType = typeof auth;
