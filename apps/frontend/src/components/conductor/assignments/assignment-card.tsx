"use client";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { Asignaciones } from "@/types";

const estadoConfig: {
  [key in Asignaciones["status"]]: {
    label: string;
    color: string;
    icon: LucideIcon;
  };
} = {
  pendiente: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: Clock,
  },
  "en progreso": {
    label: "En Progreso",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: Play,
  },
  completada: {
    label: "Completada",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: CheckCircle,
  },
  cancelada: {
    label: "Cancelada",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: XCircle,
  },
};

interface Props {
  assignment: Asignaciones;
  disabled?: boolean;
  onClick?: () => void;
}

export const AssignmentsCard = ({ assignment, disabled = false, onClick }: Props) => {
  const currentConfig = estadoConfig[assignment.status];
  const CurrentIcon = currentConfig.icon;

  return (
    <div
      className={`flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg transition-opacity ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={!disabled ? onClick : undefined}
      tabIndex={disabled ? -1 : 0}
    >
      <div>
        <div className="font-medium">
          {assignment.vehiculo?.patente} - {assignment.motivo}
        </div>
        <div className="text-sm text-muted-foreground">
          Asignado a: {assignment.conductor?.name}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(assignment.fechaAsignacion ?? "").toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className={`capitalize ${currentConfig.color} flex items-center gap-1`}
        >
          <CurrentIcon className="h-3 w-3" />
          {currentConfig.label}
        </Badge>
      </div>
    </div>
  );
};
