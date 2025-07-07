import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
export const VehiculosDisponibles = () => {
  const trpc = useTRPC();
  const {
    data: { count: freeToday } = {},
    refetch,
    isRefetching,
  } = useSuspenseQuery(trpc.stats.availableVehiclesToday.queryOptions());
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Vehículos disponibles</h2>
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
      <CardContent>{freeToday}</CardContent>
      <CardFooter className="text-muted-foreground">Hoy</CardFooter>
    </Card>
  );
};
