import { ConductorNavbar } from "@/components/conductor/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.user || context.user.role !== "conductor") {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
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
