import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, conductorAc } from "../../../server/src/auth/permissions";
import { adminAc } from "better-auth/plugins/organization/access";
import { userAc } from "better-auth/plugins/admin/access";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
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
      adminUserIds: [],
    }),
  ],
});

export const { signIn, signUp, useSession } = authClient;
