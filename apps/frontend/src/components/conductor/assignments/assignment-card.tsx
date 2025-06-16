"use client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Asignaciones } from "@/types";
import {
  ChevronDown,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";

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
  onStatusChange?: (
    assignmentId: number,
    newStatus: Asignaciones["status"]
  ) => void;
}

export const AssignmentsCard = ({ assignment, onStatusChange }: Props) => {
  const handleStatusChange = (newStatus: Asignaciones["status"]) => {
    onStatusChange?.(assignment.id, newStatus);
  };

  const currentConfig = estadoConfig[assignment.status];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="flex flex-col md:flex-row justify-between gap-2 p-3 border rounded-lg">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className={`cursor-pointer transition-colors capitalize ${currentConfig.color} flex items-center gap-1`}
            >
              <CurrentIcon className="h-3 w-3" />
              {currentConfig.label}
              <ChevronDown className="h-3 w-3" />
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(estadoConfig).map(([estado, config]) => {
              const Icon = config.icon;
              return (
                <DropdownMenuItem
                  key={estado}
                  onClick={() =>
                    handleStatusChange(estado as Asignaciones["status"])
                  }
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
