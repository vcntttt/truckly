import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function getUsers() {
  const { data } = await authClient.admin.listUsers({ query: {} });
  return data?.users;
}

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

export async function updateUser({
  id,
  firstName,
  lastName,
  role,
}: {
  id: string;
  firstName: string;
  lastName: string;
  role: "admin" | "conductor";
}) {
  try {
    await authClient.admin.impersonateUser({ userId: id });
    await authClient.updateUser({
      name: `${firstName} ${lastName}`,
    });
    await authClient.admin.stopImpersonating();

    await authClient.admin.setRole({
      userId: id,
      role,
    });
    toast.success("Usuario actualizado exitosamente.");
  } catch (error) {
    toast.error("Error al actualizar usuario");
    console.error("Error al guardar usuario:", error);
    throw error;
  }
}

export const useUsers = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { data, isLoading, error, refetch, isRefetching };
};

function useUserMutation<T>(mutationFn: (data: T) => Promise<void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useBanUser() {
  return useUserMutation(banUser);
}

export function useUnbanUser() {
  return useUserMutation(unBanUser);
}

export function useUpdateUser() {
  return useUserMutation(updateUser);
}
