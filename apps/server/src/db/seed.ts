import { db } from "./server.js";
import { vehiculos, asignaciones } from "./schema.js";

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
      },
      {
        id: 2,
        patente: "KLPT-34",
        marca: "Toyota",
        modelo: "Hilux",
        year: 2018,
        tipo: "camioneta",
      },
      {
        id: 3,
        patente: "MNBV-56",
        marca: "Volvo",
        modelo: "FH",
        year: 2020,
        tipo: "camión",
      },
      {
        id: 4,
        patente: "ZXCV-78",
        marca: "Isuzu",
        modelo: "NQR",
        year: 2019,
        tipo: "camión",
      },
      {
        id: 5,
        patente: "QWER-90",
        marca: "Ford",
        modelo: "Transit",
        year: 2022,
        tipo: "van",
      },
      {
        id: 6,
        patente: "TYUI-11",
        marca: "Nissan",
        modelo: "NV350",
        year: 2023,
        tipo: "furgón",
      },
    ])
    .returning();

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
