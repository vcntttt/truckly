import { t } from './core';
import { TRPCError } from '@trpc/server';
import { authMiddleware } from '../auth/middleware';

export const protectedProcedure = t.procedure.use(authMiddleware);

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.rol !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Requiere privilegios de administrador',
    });
  }
  return next();
});