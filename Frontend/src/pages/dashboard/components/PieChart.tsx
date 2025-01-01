import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { InventoryItem } from "../inventory/Inventory";

interface ChartProps {
  inventory: InventoryItem[];
}

interface ChartDataItem {
  name: string;
  visitors: number;
  fill: string;
}

const colorMap: Record<string, string> = {
  equipment: "hsl(var(--chart-1))",
  medicine: "hsl(var(--chart-2))",
  service: "hsl(var(--chart-3))",
  default: "hsl(var(--chart-5))",
};

export function Chart({ inventory }: ChartProps) {
  const { chartData, chartConfig, totalItems } = useMemo(() => {
    const groupedData = inventory.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.stock;
        return acc;
      },
      {}
    );

    const transformedData: ChartDataItem[] = Object.entries(groupedData).map(
      ([category, stock]) => ({
        name: category,
        visitors: stock,
        fill: colorMap[category] || colorMap.default,
      })
    );

    const config = Object.keys(groupedData).reduce<ChartConfig>(
      (acc, category) => {
        acc[category] = {
          label: category.charAt(0).toUpperCase() + category.slice(1),
          color: colorMap[category] || colorMap.default,
        };
        return acc;
      },
      { visitors: { label: "Visitors" } }
    );

    return {
      chartData: transformedData,
      chartConfig: config,
      totalItems: transformedData.reduce((sum, item) => sum + item.visitors, 0),
    };
  }, [inventory]);

  if (!chartData.length) return <div>No data available</div>;

  return (
    <Card className="flex border-none w-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Distribution</CardTitle>
        <CardDescription>Category Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              fill="#82ca9d"
            >
              <Label
                content={({ viewBox }) => (
                  <text
                    x={viewBox?.cx}
                    y={viewBox?.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox?.cx}
                      y={viewBox?.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalItems.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox?.cx}
                      y={(viewBox?.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Items
                    </tspan>
                  </text>
                )}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
