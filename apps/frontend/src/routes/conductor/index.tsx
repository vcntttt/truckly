import { RecentAssignments } from "@/components/conductor/assignments";
import { MaintenanceAlerts } from "@/components/conductor/maintenance-alerts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conductor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentAssignments />
        </div>
        <div>
          <MaintenanceAlerts />
        </div>
      </div>
    </div>
  );
}
