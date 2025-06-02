import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/asignaciones")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Hello "/dashboard/asignaciones"!
      <Link to="/dashboard">Go back</Link>
    </div>
  );
}
