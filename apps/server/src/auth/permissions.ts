import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statements = { ...defaultStatements } as const;

export const ac = createAccessControl(statements);

export const conductorAc = ac.newRole({
  ...userAc.statements,
});
