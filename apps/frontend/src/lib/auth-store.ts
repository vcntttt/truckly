import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      refresh: async () => {
        try {
          const { data: session, error } = await authClient.getSession();

          if (!session || error) {
            set({ user: null });
          } else {
            set({ user: session.user });
          }
        } catch (err) {
          console.error("Error al refrescar sesión:", err);
          set({ user: null });
        }
      },
    }),
    {
      name: "truckly:auth-store",
      partialize: (state) => (state.user ? state : { user: null }),
    }
  )
);
