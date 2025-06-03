import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Hello "/conductor"!
      <Link to="/">Go back home</Link>
    </div>
  );
}
