import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      Hello "/dashboard"!
      <div className="space-x-4">
        <Link to="/dashboard/usuarios">Usuarios</Link>
        <Link to="/dashboard/asignaciones">Asignaciones</Link>
        <Link to="/dashboard/vehiculos">Vehículos</Link>
      </div>
      <Link to="/">Go back home</Link>
    </div>
  );
}
