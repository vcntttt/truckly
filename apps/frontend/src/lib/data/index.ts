import type { Assignment } from "@/components/dashboard/tables/assignments/assignments-columns";
import type { User } from "@/components/dashboard/tables/users/users-columns";
import type { Vehiculo } from "@/components/dashboard/tables/vehicles/vehicles-columns";

export const assignments: Assignment[] = [
  {
    id: 1,
    patente: "KLPT-34",
    conductor: "Jane Smith",
    fechaAsignacion: "2025-06-01T08:00:00Z",
    motivo: "Entrega de mercancía",
    estado: "pendiente",
  },
  {
    id: 2,
    patente: "QWER-90",
    conductor: "Alice Johnson",
    fechaAsignacion: "2025-06-02T09:30:00Z",
    motivo: "Traslado de personal",
    estado: "completada",
  },
  {
    id: 3,
    patente: "JHRX-12",
    conductor: "Bob Brown",
    fechaAsignacion: "2025-06-03T14:15:00Z",
    motivo: "Revisión técnica",
    estado: "en progreso",
  },
  {
    id: 4,
    patente: "MNBV-56",
    conductor: "Charlie Davis",
    fechaAsignacion: "2025-06-04T07:45:00Z",
    motivo: "Entrega urgente",
    estado: "pendiente",
  },
  {
    id: 5,
    patente: "ZXCV-78",
    conductor: "Jane Smith",
    fechaAsignacion: "2025-06-05T16:20:00Z",
    motivo: "Cambio de ruta",
    estado: "cancelada",
  },
  {
    id: 6,
    patente: "TYUI-11",
    conductor: "Alice Johnson",
    fechaAsignacion: "2025-06-06T11:10:00Z",
    motivo: "Mantenimiento preventivo",
    estado: "completada",
  },
];

export const vehiculos: Vehiculo[] = [
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
];

export const users: User[] = [
  {
    id: 1,
    rol: "admin",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "securepassword123",
  },
  {
    id: 2,
    rol: "conductor",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "editorpass456",
  },
  {
    id: 3,
    rol: "conductor",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    password: "viewerpass789",
  },
  {
    id: 4,
    rol: "conductor",
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    password: "bobspassword321",
  },
  {
    id: 5,
    rol: "conductor",
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    password: "guestpass654",
  },
];

export const patentes = vehiculos.map((v) => v.patente);

export const marcasConModelos = Array.from(
  vehiculos.reduce((acc, v) => {
    if (!acc.has(v.marca)) acc.set(v.marca, new Set());
    acc.get(v.marca)!.add(v.modelo);
    return acc;
  }, new Map<string, Set<string>>())
).map(([marca, modelos]) => ({
  marca,
  modelos: Array.from(modelos),
}));

export const conductores = users
  .filter((u) => u.rol === "conductor")
  .map((u) => `${u.firstName} ${u.lastName}`);
