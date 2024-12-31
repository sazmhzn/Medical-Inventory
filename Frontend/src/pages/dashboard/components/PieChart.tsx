import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
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
import { useEffect, useMemo, useState } from "react";
import { InventoryItem } from "../inventory/Inventory";
export const description = "A donut chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig;

export function Chart({ inventory }: InventoryItem[]) {
  const [chartData, setChartData] = useState(inventory);
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    // Transform inventory data into chart format
    const groupedData = inventory.reduce((acc: any, curr: any) => {
      const category = curr.category;
      acc[category] = (acc[category] || 0) + curr.stock;
      return acc;
    }, {});

    const transformedData = Object.entries(groupedData).map(
      ([category, stock]: [string, number]) => ({
        name: category,
        visitors: stock,
        fill: getCategoryColor(category),
      })
    );

    // const transformedData = groupedData.map((item: any) => ({
    //   name: item.category,
    //   visitors: item.stock,
    //   fill: getCategoryColor(item.category), // Assign colors dynamically
    // }));

    setChartData(transformedData);

    // Dynamically create chart config
    const generatedConfig = Object.keys(groupedData).reduce(
      (config: any, category: string, index: number) => {
        config[category] = {
          label: capitalize(category),
          color: getCategoryColor(category),
        };
        return config;
      },
      { visitors: { label: "Visitors" } }
    );

    setChartConfig(generatedConfig);
  }, []);

  const totalItems = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  // Helper function to assign colors dynamically
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      equipment: "hsl(var(--chart-1))",
      medicine: "hsl(var(--chart-2))",
      service: "hsl(var(--chart-3))",
    };
    return colorMap[category] || "hsl(var(--chart-5))";
  };

  // Helper function to capitalize category names
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (!chartData.length || !Object.keys(chartConfig).length) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="flex border-none w-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
              innerRadius={60}
              strokeWidth={5}
              fill="#82ca9d"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalItems.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
          {/* </ResponsiveContainer> */}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
