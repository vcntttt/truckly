import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { data: { count: freeToday } = {} } = useQuery(
    trpc.stats.availableVehiclesToday.queryOptions()
  );
  const { data: { count: pendingMaint } = {} } = useQuery(
    trpc.stats.pendingMaintenancesThisWeek.queryOptions()
  );
  const { data: fleet } = useQuery(trpc.stats.fleetStatus.queryOptions());
  const { data: mileage } = useQuery(
    trpc.stats.mileagePerVehicle.queryOptions()
  );

  const pieData = fleet ?? [];
  const barData = mileage ?? [];

  const chartConfig = {
    total: { label: "Vehículos", color: "var(--chart-1)" },
    kilometraje: { label: "Km", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <div>
      <div className="grid grid-row-3 gap-3 grid-rows-[200px_1fr_1fr]">
        <section className="grid grid-cols-3 gap-3 border-none">
          {/* Vehiculos disponibles que no tienen asignaciones hoy/esta semana */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Vehículos disponibles</h2>
            </CardHeader>
            <CardContent>{freeToday}</CardContent>
            <CardFooter className="text-muted-foreground">Hoy</CardFooter>
          </Card>
          {/* Mantenimientos pendientes esta semana */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Mantenimientos pendientes
              </h2>
            </CardHeader>
            <CardContent>{pendingMaint}</CardContent>
            <CardFooter className="text-muted-foreground">
              Esta semana
            </CardFooter>
          </Card>
          {/* pendiente */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">pendiente</h2>
            </CardHeader>
            <CardContent>{0}</CardContent>
            <CardFooter className="text-muted-foreground">someday</CardFooter>
          </Card>
        </section>
        <section className="grid grid-cols-2 gap-3 border-none">
          {/* Estado de la flota */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Estado de la flota</h2>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full"
              >
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
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </CardContent>
          </Card>

          {/* Kilometraje por vehículo */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Kilometraje por vehículo
              </h2>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full"
              >
                <BarChart data={barData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="patente" axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="kilometraje" fill="var(--chart-2)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
