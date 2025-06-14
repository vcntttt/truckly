import { Hono } from 'hono';
import { db } from './server';
import { vehiculos, asignaciones, mantenimientos } from './schema';
import { user } from '../auth/auth-schema';

async function resetDb() {
  await db.delete(asignaciones).execute();
  await db.delete(mantenimientos).execute();
  await db.delete(vehiculos).execute();
  await db.delete(user).execute();
}

async function populateDb() {
  await resetDb();

  await db.insert(user).values([
    {
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@example.com',
      emailVerified: true,
      rol: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Conductor',
      email: 'conductor@example.com',
      emailVerified: true,
      rol: 'CONDUCTOR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]).execute();

  await db.insert(vehiculos).values([
    {
      id: 1,
      patente: 'AAA111',
      marca: 'Ford',
      modelo: 'Transit',
      year: 2020,
      tipo: 'van',
    },
    {
      id: 2,
      patente: 'BBB222',
      marca: 'Toyota',
      modelo: 'Hilux',
      year: 2019,
      tipo: 'pickup',
    },
  ]).execute();

  await db.insert(asignaciones).values([
    { vehiculoId: 1, conductor: 'Juan Perez' },
    { vehiculoId: 2, conductor: 'Maria Lopez' },
  ]).execute();

  await db.insert(mantenimientos).values([
    {
      vehiculoId: 1,
      descripcion: 'Cambio de aceite',
      kilometraje: 10000,
    },
    {
      vehiculoId: 2,
      descripcion: 'Revisión general',
      kilometraje: 20000,
    },
  ]).execute();
}

export function createSeedRouter() {
  const app = new Hono();

  app.post('/reset', async (c) => {
    await resetDb();
    return c.json({ ok: true });
  });

  app.post('/populate', async (c) => {
    await populateDb();
    return c.json({ ok: true });
  });

  return app;
}
