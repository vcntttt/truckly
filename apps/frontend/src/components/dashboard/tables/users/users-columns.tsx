/* eslint-disable react-hooks/rules-of-hooks */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Ban, ShieldPlus, Loader2 } from "lucide-react";
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
import { useState } from "react";
import { useBanUser, useUnbanUser } from "@/hooks/query/users";

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
      const [reason, setReason] = useState("");
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
      const banMutation = useBanUser();
      const unbanMutation = useUnbanUser();

      return (
        <div className="flex items-center gap-2">
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <Button size={"icon"} variant="outline">
                {isSaving ? (
                  <Loader2 className={isSaving ? "animate-spin" : ""} />
                ) : (
                  <SquarePen />
                )}
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
                <EditUserForm
                  initialData={user}
                  onClose={() => {
                    setIsSaving(true);
                    setIsFormOpen(false);
                  }}
                  onSuccess={() => {
                    setIsSaving(false);
                    setIsFormOpen(false);
                  }}
                  onError={() => {
                    setIsSaving(false);
                    setIsFormOpen(true);
                  }}
                />
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
                <DialogTitle>
                  {user.banned ? "Desbanear" : "Banear"} Usuario
                </DialogTitle>
                <DialogDescription>
                  {user.banned
                    ? "El usuario será desbaneado y podrá iniciar sesión."
                    : "El usuario será baneado y no podrá iniciar sesión. Se puede desbanear en un futuro."}
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
                  <Button
                    onClick={async () => unbanMutation.mutate({ id: user.id })}
                    disabled={unbanMutation.isPending}
                  >
                    {unbanMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <p>Desbanear Usuario</p>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant={"destructive"}
                    disabled={banMutation.isPending}
                    onClick={async () =>
                      banMutation.mutate({ id: user.id, reason })
                    }
                  >
                    {banMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <p>Banear Usuario</p>
                    )}
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
