import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "./lib/auth-store";
import { router } from "./main";

export function Root() {
  const { user } = useAuthStore();

  return <RouterProvider router={router} context={{ user }} />;
}
