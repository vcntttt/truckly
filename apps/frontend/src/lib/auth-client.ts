import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ac, conductorAc } from "../../../server/src/auth/permissions";
import { adminAc } from "better-auth/plugins/organization/access";
import { userAc } from "better-auth/plugins/admin/access";
import type { auth } from "../../../server/src/auth/auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
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
