
import { db } from "./server";
import { asignaciones, mantenimientos, vehiculos } from "./schema";

async function resetDB() {
    await db.delete(asignaciones);
    await db.delete(mantenimientos);
    await db.delete(vehiculos);
    console.log("[RESET] Base de datos reiniciada");
}

async function populateDB() {
    const vehiculosInsert = await db.insert(vehiculos).values([
    {
        patente: "ABCD12",
        marca: "Toyota",
        modelo: "Hilux",
        year: 2020,
        tipo: "camioneta",
    },
    {
        patente: "EFGH34",
        marca: "Chevrolet",
        modelo: "D-Max",
        year: 2019,
        tipo: "camion",
    },
    ]).returning();

    await db.insert(asignaciones).values([
    {
        vehiculoId: vehiculosInsert[0].id,
        conductor: "Juan Pérez",
    },
    {
        vehiculoId: vehiculosInsert[1].id,
        conductor: "Ana Gómez",
    },
    ]);

    await db.insert(mantenimientos).values([
    {
        vehiculoId: vehiculosInsert[0].id,
        descripcion: "Cambio de aceite",
        kilometraje: 12000,
    },
    {
        vehiculoId: vehiculosInsert[1].id,
        descripcion: "Revisión general",
        kilometraje: 8000,
    },
    ]);

    console.log("[SEED] Datos de ejemplo insertados");
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const action = process.argv[2];
    if (action === "reset") resetDB();
    else if (action === "populate") populateDB();
    else console.log("Usa: tsx src/db/seed.ts [reset|populate]");
}

export { resetDB, populateDB };
