import { db } from "./server.js";
import { vehiculos, asignaciones } from "./schema.js";

async function resetDB() {
  await db.delete(asignaciones);
  await db.delete(vehiculos);
  console.log("[RESET] Base de datos reiniciada");
}

async function populateDB() {
  const insertedVehiculos = await db.insert(vehiculos).values([
    {
      patente: "JKLT91",
      marca: "Nissan",
      modelo: "NP300",
      year: 2021,
      tipo: "camioneta",
      proximoMantenimiento: new Date("2025-06-21T02:12:22.045849"),
    },
    {
      patente: "GHPL83",
      marca: "Toyota",
      modelo: "Hilux",
      year: 2022,
      tipo: "pickup",
      proximoMantenimiento: new Date("2025-06-28T02:12:22.045861"),
    },
    {
      patente: "MZQP57",
      marca: "Chevrolet",
      modelo: "D-Max",
      year: 2020,
      tipo: "camion",
      proximoMantenimiento: new Date("2025-07-14T02:12:22.045864"),
    }
  ]).returning();

  await db.insert(asignaciones).values([
    {
      vehiculoId: insertedVehiculos[0].id,
      conductorId: "user_conductor1",
      status: "pendiente",
      motivo: "Entrega zona norte",
    },
    {
      vehiculoId: insertedVehiculos[1].id,
      conductorId: "user_conductor2",
      status: "en progreso",
      motivo: "Reparto en ruta sur",
    },
    {
      vehiculoId: insertedVehiculos[2].id,
      conductorId: "user_conductor3",
      status: "completada",
      motivo: "Logística interurbana",
    }
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