import { t } from '../trpc/core';
import { TRPCError } from '@trpc/server';
import { auth } from './auth';
import type { UserSession } from '../context';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const token = ctx.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Falta token' });
  }

  const session = await auth.api.getSession({
    headers: new Headers({ authorization: `Bearer ${token}` })
  }).catch(() => null);

  if (!session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token inválido' });
  }

  const user: UserSession = {
    sub: session.user.id,
    email: session.user.email,
    rol: (session.user as any).rol as 'ADMIN' | 'CONDUCTOR',
  };

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
