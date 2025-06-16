import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import { admin } from "better-auth/plugins/admin";
import { ac, conductorAc } from "./auth/permissions";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { authSchema } from "./auth/auth-schema";
import { subtle } from "uncrypto";

type Bindings = { DATABASE_URL: string };

export const buildAuth = (bindings: Bindings) =>
  betterAuth({
    database: drizzleAdapter(getDb(bindings), {
      provider: "pg",
      schema: {
        ...authSchema,
      },
    }),
    password: {
      async hash(pwd: string) {
        const enc = new TextEncoder().encode(pwd);
        const key = await subtle.importKey("raw", enc, "PBKDF2", false, [
          "deriveBits",
        ]);
        const bits = await subtle.deriveBits(
          { name: "PBKDF2", salt: enc, iterations: 100_000, hash: "SHA-256" },
          key,
          256
        );
        return Buffer.from(bits).toString("hex");
      },
      async verify(pwd: string, hash: string) {
        return (await this.hash(pwd)) === hash;
      },
    },
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
      "https://truckly.netlify.app/",
      "https://truckly.vercel.app/",
    ],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
    },
  });

export default buildAuth({
  DATABASE_URL: "postgres://postgres:postgres@localhost:5432/postgres",
});
