import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createContext } from './context';
import { appRouter } from './trpc/root';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { seedRouter } from "./routes/seed";


const app = new Hono();

app.get('/', (c) => c.text('Hello Hono en Vercel'));

app.all('/trpc/:path', async (c) => {
  const response = await fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts, c),
  });
  return response;
});

console.log('🚀 API lista en http://localhost:3000/trpc');

if (process.env.NODE_ENV === "development") {
    app.route("/", seedRouter);
}

export const GET = handle(app);
export const POST = handle(app);
