import { authClient } from "@/lib/auth-client";
import type { UserWithRole } from "@/types";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export const userQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: getUsers,
});

export const useUsers = () => {
  const { data, isLoading, error, refetch, isRefetching } =
    useQuery(userQueryOptions);

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

interface UpdateUserVariables {
  id: string;
  firstName: string;
  lastName: string;
  role: "admin" | "conductor";
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    UpdateUserVariables,
    { previousUsers?: UserWithRole[] }
  >({
    mutationFn: updateUser,

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<UserWithRole[]>(["users"]);

      queryClient.setQueryData<UserWithRole[]>(["users"], (old = []) =>
        old.map((user) =>
          user.id === newData.id
            ? {
                ...user,
                name: `${newData.firstName} ${newData.lastName}`,
                role: newData.role,
              }
            : user
        )
      );

      return { previousUsers };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast.error("Error al actualizar usuario");
    },
  });
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "conductor";
}

async function createUser(data: CreateUserInput): Promise<UserWithRole> {
  const result = await authClient.admin.createUser({
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    password: "123456789",
    role: data.role,
  });

  if (result.error) {
    throw new Error(result.error.message ?? "Error al crear usuario");
  }

  const created = result.data.user;

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    role: created.role,
    banned: created.banned ?? false,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<
    UserWithRole,
    Error,
    CreateUserInput,
    { previousUsers?: UserWithRole[] }
  >({
    mutationFn: createUser,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<UserWithRole[]>(["users"]);
      const temp: UserWithRole = {
        id: `temp-${Date.now()}`,
        name: `${vars.firstName} ${vars.lastName}`,
        email: vars.email,
        role: vars.role,
        banned: false,
      };
      queryClient.setQueryData<UserWithRole[]>(["users"], (old = []) => [
        temp,
        ...old,
      ]);
      return { previousUsers };
    },
    onError: (_erro, _vars, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers ?? []);
      toast.error("Error al crear usuario");
    },
    onSuccess: (created) => {
      queryClient.setQueryData<UserWithRole[]>(["users"], (old = []) =>
        old.map((u) => (u.id.startsWith("temp-") ? created : u))
      );
      toast.success("Usuario creado exitosamente");
    },
  });
}
