import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const FlotaStatus = () => {
  const trpc = useTRPC();
  const {
    data: fleet,
    refetch,
    isRefetching,
  } = useSuspenseQuery(trpc.stats.fleetStatus.queryOptions());
  const pieData = fleet ?? [];

  const chartConfig = {
    pendiente: {
      label: "Pendiente",
      color: "var(--chart-1)",
    },
    "en progreso": {
      label: "En Progreso",
      color: "var(--chart-2)",
    },
    completada: {
      label: "Completada",
      color: "var(--chart-3)",
    },
    cancelada: {
      label: "Cancelada",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Estado de la flota</h2>
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
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="total"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={`var(--chart-${i + 1})`} />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent className="capitalize" />}
            />
            <ChartLegend
              content={
                <ChartLegendContent payload={pieData} nameKey="status" />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
