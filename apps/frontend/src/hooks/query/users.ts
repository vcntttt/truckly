import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

async function getUsers() {
  const { data } = await authClient.admin.listUsers({ query: {} });
  return data?.users;
}

export const useUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { data, isLoading, error };
};
