import { t } from '../trpc/core'; 
import { authMiddleware, adminMiddleware } from '../auth/middleware';


export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const adminProcedure = protectedProcedure.use(adminMiddleware);

