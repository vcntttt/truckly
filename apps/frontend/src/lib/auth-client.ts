import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ac, conductorAc } from "../../../server/src/auth/permissions";
import { adminAc } from "better-auth/plugins/organization/access";
import { userAc } from "better-auth/plugins/admin/access";
import type { auth } from "../../../server/src/auth/auth";

const isDev = import.meta.env.MODE === "development";

export const authClient = createAuthClient({
  baseURL: isDev ? "http://localhost:4000" : "https://truckly.duckdns.org",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminAc,
        user: userAc,
        conductor: conductorAc,
      },
      defaultRole: "conductor",
      adminRoles: ["admin"],
    }),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signUp, useSession } = authClient;
