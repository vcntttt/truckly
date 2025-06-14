import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createContext } from './context';
import { appRouter } from './trpc/root';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { seedRouter } from './routes/seed';
import { serve } from '@hono/node-server';
import 'dotenv/config'; 

const app = new Hono();

app.get('/', (c) => c.text('👋 API TRPC funcionando'));

app.all('/trpc/:path', async (c) => {
  const method = c.req.method;
  const path = c.req.path;
  const rawBody = await c.req.text();

  console.log(`📡 ${method} ${path}`);

  const req = new Request(c.req.url, {
    method: method, 
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    body: rawBody,
  });

  try {
    return await fetchRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter,
      createContext: (opts) => createContext(opts, c),
      onError: ({ error, type, path }) => {
        if (error.code === 'METHOD_NOT_SUPPORTED') {
          console.warn(`⚠️ Método incorrecto para ${path}:`, method);
        }
      }
    });
  } catch (error) {
    console.error('💥 Error en TRPC:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});


if (import.meta.main && process.env.NODE_ENV === 'development') {
  const port = Number(process.env.PORT) || 3333;

  app.route('/seed', seedRouter);

  if (typeof Bun !== 'undefined') {
    Bun.serve({ port, fetch: app.fetch });
    console.log(`🚀 API local con Bun en http://localhost:${port}`);
  } else {
    serve({ fetch: app.fetch, port });
    console.log(`🚀 API local con Node en http://localhost:${port}`);
  }
}

export const GET = handle(app);
export const POST = handle(app); 