import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      refresh: async () => {
        const { data: session } = await authClient.getSession();

        set({ user: session?.user ?? null, isLoading: false });
      },
    }),
    {
      name: "auth-store",
    }
  )
);
