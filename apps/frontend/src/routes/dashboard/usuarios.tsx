import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Hello "/dashboard/usuarios"!
      <Link to="/dashboard">Go back</Link>
    </div>
  );
}
