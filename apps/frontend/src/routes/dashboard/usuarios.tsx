import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/usuarios")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/usuarios"!</div>;
}
