import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/vehiculos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/vehiculos"!</div>;
}
