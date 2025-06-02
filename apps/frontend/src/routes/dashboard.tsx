import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Hello "/dashboard"!
      <Link to="/">Go back home</Link>
    </div>
  );
}
