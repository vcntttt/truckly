import { ConductorNavbar } from "@/components/conductor/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ConductorNavbar />
      <Outlet />
    </div>
  );
}
