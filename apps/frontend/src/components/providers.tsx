import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { queryClient, trpcClient } from "@/lib/clients";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {children}
          <Toaster />
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
