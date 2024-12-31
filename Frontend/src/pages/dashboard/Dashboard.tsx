import HeaderTitle from "@/components/commons/header-title";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Chart } from "./components/PieChart";
import { Button } from "@/components/ui/button";
import Starter from "./components/Starter";
import { Package, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useFetchInventory } from "@/services/InventoryAPI";
import { InventoryItem } from "./inventory/Inventory";

interface StockData {
  totalStock: number;
  previousTotalStock: number;
  alertStock: number;
  previousAlertStock: number;
  lowStock: number;
  previousLowStock: number;
  inStock: number;
  previousInStock: number;
}

const fetchStockData = (): Promise<StockData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStock: 10,
        previousTotalStock: 200,
        alertStock: 5,
        previousAlertStock: 8,
        lowStock: 3,
        previousLowStock: 4,
        inStock: 7,
        previousInStock: 6,
      });
    }, 1000); // Simulate a 1-second delay
  });
};

const chartData = [
  { month: "January", desktop: 186, mobile: 80, other: 45 },
  { month: "February", desktop: 305, mobile: 200, other: 100 },
  { month: "March", desktop: 237, mobile: 120, other: 150 },
  { month: "April", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "June", desktop: 214, mobile: 140, other: 160 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const {
    data: inventory,
    loading,
    error,
    refetch,
  } = useFetchInventory("inventory");
  const [summary, setSummary] = useState({
    quantityInHand: 0,
    quantityToBeReceived: 0,
    lowStockItems: 0,
    allItemGroups: 0,
    allItems: 0,
  });

  useEffect(() => {
    if (inventory) {
      const processedData = inventory.map((item: InventoryItem) => ({
        ...item,
        status:
          item.stock <= item.reorder
            ? item.stock === 0
              ? "critical"
              : "low"
            : "good",
      }));
      setStockData(processedData);
      // Calculate summary data
      const quantityInHand = inventory.reduce(
        (sum, item) => sum + item.stock,
        0
      );
      const quantityToBeReceived = inventory.reduce(
        (sum, item) => (item.stock < item.reorder ? sum + item.reorder : sum),
        0
      );
      const lowStockItems = inventory.filter(
        (item) => item.stock < item.reorder
      ).length;
      const allItemGroups = new Set(inventory.map((item) => item.category))
        .size;
      const allItems = inventory.length;

      setSummary({
        quantityInHand,
        quantityToBeReceived,
        lowStockItems,
        allItemGroups,
        allItems,
      });
      sessionStorage.setItem("stockData", JSON.stringify(processedData));
    }
  }, [inventory]);

  if (!stockData) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-full">
      <HeaderTitle title="Dashbaord" />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 rounded-none">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="starter">Getting Started</TabsTrigger>
            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <section className="my-6">
              <div className="flex items-start md:flex-row flex-col justify-between gap-6">
                <article className="border rounded-lg overflow-hidden md:w-2/3 w-full">
                  {/* <DataTable data={getTasks} columns={columns} /> */}
                  {/* <DataTable /> */}
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">Sales Activity</h3>
                  </header>
                  <div className="flex bg-white justify-between items-center">
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          <Package />
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be packed
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 border" />
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          <Package />
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be Delivered
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 border" />
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          <Package />
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be packed
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="border rounded-lg overflow-hidden w-full md:w-1/3">
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">
                      Inventory Summary
                    </h3>
                  </header>
                  <div className="p-4 flex flex-col justify-between ">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity in hand
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        {summary.quantityInHand}
                      </p>
                    </div>
                    <Separator orientation="horizontal" className="mb-4" />
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity to be received
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        {summary.quantityToBeReceived}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section>
              <div className="grid md:grid-cols-2 gap-4">
                <article className="border bg-white rounded-lg overflow-hidden w-full">
                  {/* <DataTable data={getTasks} columns={columns} /> */}
                  {/* <DataTable /> */}
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">
                      Product Details
                    </h3>
                  </header>
                  <div className="flex bg-white md:flex-col flex-col justify-between items-center">
                    <div className="p-0 w-full flex flex-col items-center">
                      <Chart inventory={stockData} />
                    </div>
                    <Separator
                      orientation="horizontal"
                      className="h-[1px] mx-2 border"
                    />

                    <div className="p-4 w-full flex flex-col justify-between ">
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-red-400 uppercase">
                          Low Stock Items
                        </h1>
                        <p className="text-xl font-semibold text-red-600">
                          {summary.lowStockItems}
                        </p>
                      </div>
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-neutral-400 uppercase">
                          All Items Groups
                        </h1>
                        <p className="text-xl font-semibold text-neutral-800">
                          {summary.allItemGroups}
                        </p>
                      </div>
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-neutral-400 uppercase">
                          All Items
                        </h1>
                        <p className="text-xl font-semibold text-neutral-800">
                          {summary.allItems}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="border rounded-lg overflow-hidden  w-full">
                  <header className="bg-gray-100 p-4 inline-flex w-full justify-between">
                    <h3 className="text-xl text-neutral-800">
                      Top Selling Products
                    </h3>

                    <Button variant="link">This month</Button>
                  </header>
                  <div className="p-4 flex flex-col justify-between ">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity in hand
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        0
                      </p>
                    </div>
                    <Separator
                      orientation="horizontal"
                      className="h-[1px] mx-2 border"
                    />
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle>Area Chart - Stacked Expanded</CardTitle>
                        <CardDescription>
                          Showing total visitors for the last 6months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig}>
                          <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                              left: 12,
                              right: 12,
                              top: 12,
                            }}
                            stackOffset="expand"
                          >
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                              dataKey="other"
                              type="natural"
                              fill="var(--color-other)"
                              fillOpacity={0.1}
                              stroke="var(--color-other)"
                              stackId="a"
                            />
                            <Area
                              dataKey="mobile"
                              type="natural"
                              fill="var(--color-mobile)"
                              fillOpacity={0.4}
                              stroke="var(--color-mobile)"
                              stackId="a"
                            />
                            <Area
                              dataKey="desktop"
                              type="natural"
                              fill="var(--color-desktop)"
                              fillOpacity={0.4}
                              stroke="var(--color-desktop)"
                              stackId="a"
                            />
                          </AreaChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                              Trending up by 5.2% this month{" "}
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                              January - June 2024
                            </div>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </article>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="starter">
            <Starter />
          </TabsContent>
          <TabsContent value="updates">Never Miss an Update</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
