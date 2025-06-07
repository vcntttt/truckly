import { t } from '../trpc/core';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { usuarios } from '../db/schema';
import type { ProtectedContext } from '../context';

type AuthedUser = {
  id: number;
  email: string;
  rol: 'ADMIN' | 'CONDUCTOR';
};

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.db) {
    throw new TRPCError({ 
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Conexión a la base de datos no disponible'
    });
  }

  const authHeader = ctx.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Formato de autorización inválido. Use: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];

  const [usuario] = await ctx.db
    .select({
      id: usuarios.id,
      email: usuarios.email,
      rol: usuarios.rol
    })
    .from(usuarios)
    .where(eq(usuarios.tokenSesion, token))
    .limit(1);

  if (!usuario) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Credenciales inválidas'
    });
  }

  return next({
    ctx: {
      ...ctx,
      usuario 
    } as ProtectedContext
  });
});

export const adminMiddleware = authMiddleware.unstable_pipe(
  async ({ ctx, next }) => {
    if (ctx.usuario.rol !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Se requieren privilegios de administrador'
      });
    }
    return next({
      ctx: {
        ...ctx,
      }
    });
  }
);