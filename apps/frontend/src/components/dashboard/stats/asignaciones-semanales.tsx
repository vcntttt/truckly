import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const AsignacionesSemanales = () => {
  const trpc = useTRPC();
  const {
    data: { count: pendingAssignments } = {},
    refetch,
    isRefetching,
  } = useSuspenseQuery(trpc.stats.availableAssignmentsThisWeek.queryOptions());

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Asignaciones</h2>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCcw
            className={isRefetching ? "animate-spin size-4" : "size-4"}
          />
        </Button>
      </CardHeader>
      <CardContent>{pendingAssignments}</CardContent>
      <CardFooter className="text-muted-foreground">Esta semana</CardFooter>
    </Card>
  );
};
export default AsignacionesSemanales;
