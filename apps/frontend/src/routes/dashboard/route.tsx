import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/navigation/app-sidebar";
import { ToggleThemeButton } from "@/components/toggle-theme";
import { sections } from "@/components/dashboard/navigation/sections";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session || session.user.role !== "admin")
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
  },
});

function DashboardLayout() {
  const location = useLocation();
  const currentPath = location.pathname || "Dashboard";
  const currentTitle =
    sections.find((section) => section.url === currentPath)?.title ||
    "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <h1 className="font-semibold text-lg">{currentTitle}</h1>
            </div>
            <ToggleThemeButton />
          </div>
        </header>
        <main className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-0 p-4 container mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
