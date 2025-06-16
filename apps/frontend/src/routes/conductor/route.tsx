import { ConductorNavbar } from "@/components/conductor/navbar";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session || session.user.role !== "conductor")
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
  },
});

function RouteComponent() {
  return (
    <div>
      <ConductorNavbar />
      <main className="container px-4 py-8 mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
