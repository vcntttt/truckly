import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <>
      <nav>
        <div className="flex justify-center space-x-4 p-4 ">
          <Link to="/dashboard/usuarios">Usuarios</Link>
          <Link to="/dashboard/asignaciones">Asignaciones</Link>
          <Link to="/dashboard/vehiculos">Vehículos</Link>
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
