import { db } from "./server";
import { vehiculos, asignaciones } from "./schema";

async function resetDB() {
  await db.delete(asignaciones);
  await db.delete(vehiculos);
  console.log("[RESET] Base de datos reiniciada");
}

async function populateDB() {
  const insertedVehiculos = await db
    .insert(vehiculos)
    .values([
      {
        id: 1,
        patente: "JHRX-12",
        marca: "Mercedes-Benz",
        modelo: "Sprinter",
        year: 2021,
        tipo: "van",
        kilometraje: 100000,
        fueraServicio: false,
      },
      {
        id: 2,
        patente: "KLPT-34",
        marca: "Toyota",
        modelo: "Hilux",
        year: 2018,
        tipo: "camioneta",
        kilometraje: 150000,
        fueraServicio: false,
      },
      {
        id: 3,
        patente: "MNBV-56",
        marca: "Volvo",
        modelo: "FH",
        year: 2020,
        tipo: "camión",
        kilometraje: 200000,
        fueraServicio: false,
      },
      {
        id: 4,
        patente: "ZXCV-78",
        marca: "Isuzu",
        modelo: "NQR",
        year: 2019,
        tipo: "camión",
        kilometraje: 120000,
        fueraServicio: false,
      },
      {
        id: 5,
        patente: "QWER-90",
        marca: "Ford",
        modelo: "Transit",
        year: 2022,
        tipo: "van",
        kilometraje: 80000,
        fueraServicio: false,
      },
      {
        id: 6,
        patente: "TYUI-11",
        marca: "Nissan",
        modelo: "NV350",
        year: 2023,
        tipo: "furgón",
        kilometraje: 50000,
        fueraServicio: false,
      },
    ])
    .returning();

  await db.insert(asignaciones).values([
    {
      vehiculoId: insertedVehiculos[0].id,
      conductorId: "sPSWpE6Jce0TilSHYEh7hd5V7197wl0k",
      status: "pendiente",
      motivo: "Entrega zona norte",
    },
    {
      vehiculoId: insertedVehiculos[1].id,
      conductorId: "sPSWpE6Jce0TilSHYEh7hd5V7197wl0k",
      status: "en progreso",
      motivo: "Reparto ruta sur",
    },
    {
      vehiculoId: insertedVehiculos[2].id,
      conductorId: "sPSWpE6Jce0TilSHYEh7hd5V7197wl0k",
      status: "completada",
      motivo: "Logística interurbana",
    },
    {
      vehiculoId: insertedVehiculos[3].id,
      conductorId: "sPSWpE6Jce0TilSHYEh7hd5V7197wl0k",
      status: "pendiente",
      motivo: "Mantenimiento preventivo cambio de aceite",
    },
    {
      vehiculoId: insertedVehiculos[4].id,
      conductorId: "sPSWpE6Jce0TilSHYEh7hd5V7197wl0k",
      status: "completada",
      motivo: "Mantenimiento revisión de frenos",
    },

    {
      vehiculoId: insertedVehiculos[2].id,
      conductorId: "x1u9MU3ltknlAYdDvyLeyPz8QZ0c4ahf",
      status: "en progreso",
      motivo: "Entrega bodega central",
    },
    {
      vehiculoId: insertedVehiculos[3].id,
      conductorId: "x1u9MU3ltknlAYdDvyLeyPz8QZ0c4ahf",
      status: "completada",
      motivo: "Entrega exprés ruta metropolitana",
    },
    {
      vehiculoId: insertedVehiculos[4].id,
      conductorId: "x1u9MU3ltknlAYdDvyLeyPz8QZ0c4ahf",
      status: "pendiente",
      motivo: "Reparto nocturno",
    },
    {
      vehiculoId: insertedVehiculos[5].id,
      conductorId: "x1u9MU3ltknlAYdDvyLeyPz8QZ0c4ahf",
      status: "pendiente",
      motivo: "Mantenimiento inspección general",
    },
    {
      vehiculoId: insertedVehiculos[1].id,
      conductorId: "x1u9MU3ltknlAYdDvyLeyPz8QZ0c4ahf",
      status: "completada",
      motivo: "Mantenimiento alineación de ruedas",
    },
  ]);

  console.log("[SEED] Datos insertados correctamente");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const action = process.argv[2];
  if (action === "reset") resetDB();
  else if (action === "populate") populateDB();
  else console.log("Usa: tsx src/db/seed.ts [reset|populate]");
}

export { resetDB, populateDB };
