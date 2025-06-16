import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Ban, ShieldPlus } from "lucide-react";
import { EditUserForm } from "@/components/dashboard/forms/edit-user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserWithRole } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

async function banUser({ id, reason }: { id: string; reason: string }) {
  try {
    await authClient.admin.banUser({ userId: id, banReason: reason });
    toast.success("Usuario baneado exitosamente");
  } catch (error) {
    toast.error("Error al banear usuario");
    console.error("Error al banear usuario:", error);
  }
}

async function unBanUser({ id }: { id: string }) {
  try {
    await authClient.admin.unbanUser({ userId: id });
    toast.success("Usuario desbaneado exitosamente");
  } catch (error) {
    toast.error("Error al desbanear usuario");
    console.error("Error al desbanear usuario:", error);
  }
}

export const usersColumns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const { role, banned } = row.original;

      return (
        <Badge
          variant={
            banned ? "destructive" : role === "admin" ? "default" : "secondary"
          }
          className="capitalize"
        >
          {banned ? "Baneado" : role}
        </Badge>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return filterValue.includes(value);
      }
      return true;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [reason, setReason] = useState("");
      return (
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant="outline">
                <SquarePen />
              </Button>
            </SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <SheetHeader>
                <SheetTitle>Editar usuario</SheetTitle>
                <SheetDescription>
                  Modifica los datos del usuario y guarda los cambios.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-4 px-4">
                <EditUserForm initialData={user} />
              </div>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"icon"} variant="outline">
                {user.banned ? <ShieldPlus /> : <Ban />}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Banear Usuario</DialogTitle>
                <DialogDescription>
                  El usuario será baneado y no podrá iniciar sesión. Se puede
                  desbanear en un futuro.
                </DialogDescription>
                {!user.banned && (
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Comunica el motivo del ban"
                  />
                )}
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                {user.banned ? (
                  <Button onClick={async () => unBanUser({ id: user.id })}>
                    Desbanear Usuario
                  </Button>
                ) : (
                  <Button
                    variant={"destructive"}
                    onClick={async () => banUser({ id: user.id, reason })}
                  >
                    Banear Usuario
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
