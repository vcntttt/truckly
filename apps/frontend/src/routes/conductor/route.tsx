import { ConductorNavbar } from "@/components/conductor/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor")({
  component: RouteComponent,
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
