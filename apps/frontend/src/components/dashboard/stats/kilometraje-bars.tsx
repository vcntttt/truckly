import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const KilometrajeBars = () => {
  const trpc = useTRPC();

  const {
    data: mileage,
    refetch,
    isRefetching,
  } = useSuspenseQuery(trpc.stats.mileagePerVehicle.queryOptions());
  const barData = mileage ?? [];

  const chartConfig = {
    patente: { label: "Patente", color: "var(--chart-1)" },
    kilometraje: { label: "Km", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Kilometraje por vehículo</h2>
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
          <BarChart data={barData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="patente" axisLine={false} tickLine={false} />
            <YAxis dataKey="kilometraje" axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="kilometraje" fill="var(--chart-2)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
