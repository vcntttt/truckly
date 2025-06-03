import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <nav className="flex items-center justify-between">
        <h1 className="font-semibold">Conductor</h1>
        <p>Bienvenido, Juan Pérez</p>
      </nav>
      <Outlet />
    </div>
  );
}
