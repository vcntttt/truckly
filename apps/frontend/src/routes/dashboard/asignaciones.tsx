import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/asignaciones")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/asignaciones"!</div>;
}
