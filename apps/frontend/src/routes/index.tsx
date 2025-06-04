import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="m-auto flex min-h-screen w-full flex-col items-center justify-center gap-y-4">
      <Link
        className="font-semibold text-xl transition-all duration-300 hover:scale-110 hover:underline"
        to="/conductor"
      >
        Portal del Conductor
      </Link>
      <Link
        className="font-semibold text-xl transition-all duration-300 hover:scale-110 hover:underline"
        to="/dashboard"
      >
        Dashboard
      </Link>
    </div>
  );
}
