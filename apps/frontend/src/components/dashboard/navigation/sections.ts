import { FileText, type LucideIcon, Truck, User } from "lucide-react";

interface Section {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const sections: Section[] = [
  {
    title: "Vehículos",
    url: "/dashboard/vehiculos",
    icon: Truck,
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: User,
  },
  {
    title: "Asignaciones",
    url: "/dashboard/asignaciones",
    icon: FileText,
  },
];
