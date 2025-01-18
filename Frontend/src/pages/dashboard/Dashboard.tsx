import { useEffect, useState } from "react";
import { Package, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import HeaderTitle from "@/components/commons/header-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Chart } from "./components/PieChart";
import Starter from "./components/Starter";
import { useFetchInventory } from "@/services/InventoryAPI";
import { InventoryItem } from "./inventory/Inventory";
import { useInventory } from "@/services/__test_inventoryAPI";
import FutureUpdatesCard from "./components/FutureUpdates";
import { useOrders } from "@/services/OrderAPI";

interface StockData extends InventoryItem {
  status: "critical" | "low" | "good";
}

interface DashboardSummary {
  quantityInHand: number;
  quantityToBeReceived: number;
  lowStockItems: number;
  allItemGroups: number;
  allItems: number;
}

interface Order {
  id: number;
  orderDate: string;
  status: "DELIVERED" | "SHIPPED" | "ACCEPTED";
  supplierId: number;
  supplierName: string;
  supplierOrganization: string;
  supplierContact: string;
  customerId: number;
  customerName: string;
  customerOrganization: string;
  items: OrderItem[];
  totalAmount: number;
  createdDate: string;
  lastUpdatedDate: string;
}

interface SalesMetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
}

const SalesMetricCard = ({ title, value, subtitle }: SalesMetricCardProps) => (
  <div className="p-4 flex-1 text-center">
    <h4 className="text-lg text-neutral-500 mb-2">{title}</h4>
    <p className="text-3xl font-semibold text-blue-500">{value}</p>
    {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
  </div>
);

const chartData = [
  { month: "January", desktop: 186, mobile: 80, other: 45 },
  { month: "February", desktop: 305, mobile: 200, other: 100 },
  { month: "March", desktop: 237, mobile: 120, other: 150 },
  { month: "April", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "June", desktop: 214, mobile: 140, other: 160 },
];

const chartConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  other: { label: "Other", color: "hsl(var(--chart-3))" },
};

const Dashboard = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    quantityInHand: 0,
    quantityToBeReceived: 0,
    lowStockItems: 0,
    allItemGroups: 0,
    allItems: 0,
  });

  // const { data: inventory, loading } = useFetchInventory("inventory");
  const { data: inventory, isLoading } = useInventory();
  const { data: orders, isLoading: orderLoading, refetch } = useOrders();

  useEffect(() => {
    if (!inventory) return;

    const processedData = inventory.map((item: InventoryItem) => ({
      ...item,
      status:
        item.stock <= item.reorder
          ? item.stock === 0
            ? "critical"
            : "low"
          : "good",
    }));

    const newSummary = {
      quantityInHand: inventory.reduce((sum, item) => sum + item.stock, 0),
      quantityToBeReceived: inventory.reduce(
        (sum, item) => (item.stock < item.reorder ? sum + item.reorder : sum),
        0
      ),
      lowStockItems: inventory.filter((item) => item.stock < item.reorder)
        .length,
      allItemGroups: new Set(inventory.map((item) => item.category)).size,
      allItems: inventory.length,
    };

    setStockData(processedData);
    setSummary(newSummary);
  }, [inventory]);

  if (isLoading) return <div>Loading</div>;

  if (!orders?.success) return <div>{orders?.message}</div>;

  const metrics = {
    toBePacked: orders?.data.filter((order) => order.status === "ACCEPTED")
      .length,
    toBeDelivered: orders?.data.filter((order) => order.status === "SHIPPED")
      .length,
    delivered: orders?.data.filter((order) => order.status === "DELIVERED")
      .length,
  };

  // Calculate inventory metrics
  const inventoryMetrics = {
    quantityInHand: orders.data.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    ),
    totalOrder: orders.data.length,
    totalValue: orders.data.reduce(
      (total, order) => total + order.totalAmount,
      0
    ),
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Dashboard" />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 rounded-none">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="starter">Getting Started</TabsTrigger>
            <TabsTrigger value="updates">Upcomming Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <section className="my-6">
              <div className="flex items-start md:flex-row flex-col justify-between gap-6">
                <article className="border rounded-lg overflow-hidden md:w-2/3 w-full">
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">Sales Activity</h3>
                  </header>
                  <div className="flex bg-white justify-between items-center">
                    <SalesMetricCard
                      title="To be packed"
                      value={metrics.toBePacked}
                      subtitle="Accepted Orders"
                    />
                    <Separator orientation="vertical" className="h-20 border" />
                    <SalesMetricCard
                      title="To be Delivered"
                      value={metrics.toBeDelivered}
                      subtitle="Shipped Orders"
                    />
                    <Separator orientation="vertical" className="h-20 border" />
                    <SalesMetricCard
                      title="Delivered"
                      value={metrics.delivered}
                      subtitle="Completed Orders"
                    />
                  </div>
                </article>

                <article className="border rounded-lg overflow-hidden w-full md:w-1/3">
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">
                      Inventory Summary
                    </h3>
                  </header>
                  <div className="p-4 flex flex-col justify-between">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-500 uppercase">
                        Total Orders
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        {inventoryMetrics.totalOrder}
                      </p>
                    </div>
                    <Separator orientation="horizontal" className="mb-4" />
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-500 uppercase">
                        Total Items Ordered
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        {inventoryMetrics.quantityInHand}
                      </p>
                    </div>
                    <Separator orientation="horizontal" className="mb-4" />
                    <div className="flex justify-between">
                      <h1 className="text-md font-normal text-neutral-500 uppercase">
                        Total Value
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        NRS {inventoryMetrics.totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-4">
              <article className="border bg-white rounded-lg overflow-hidden w-full">
                <header className="bg-gray-100 p-4">
                  <h3 className="text-xl text-neutral-800">Product Details</h3>
                </header>
                <div className="flex bg-white flex-col justify-between items-center">
                  <div className="p-0 w-full flex flex-col items-center">
                    <Chart inventory={stockData} />
                  </div>
                  <Separator
                    orientation="horizontal"
                    className="h-[1px] mx-2 border"
                  />
                  <div className="p-4 w-full">
                    {[
                      {
                        label: "Low Stock Items",
                        value: summary.lowStockItems,
                        isAlert: true,
                      },
                      {
                        label: "All Items Groups",
                        value: summary.allItemGroups,
                      },
                      { label: "All Items", value: summary.allItems },
                    ].map(({ label, value, isAlert }) => (
                      <div key={label} className="flex justify-between mb-4">
                        <h1
                          className={`text-md font-normal uppercase ${isAlert ? "text-red-400" : "text-neutral-400"}`}
                        >
                          {label}
                        </h1>
                        <p
                          className={`text-xl font-semibold ${isAlert ? "text-red-600" : "text-neutral-800"}`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="border rounded-lg overflow-hidden w-full">
                <header className="bg-gray-100 p-4 inline-flex w-full justify-between">
                  <h3 className="text-xl text-neutral-800">
                    Top Selling Products
                  </h3>
                  <Button variant="link">This month</Button>
                </header>
                <div className="p-4">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle>Area Chart - Stacked Expanded</CardTitle>
                      {/* <p className="">
                        Showing total visitors for the last 6 months
                      </p> */}
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig}>
                        <AreaChart
                          accessibilityLayer
                          data={chartData}
                          margin={{ left: 12, right: 12, top: 12 }}
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
                          {["other", "mobile", "desktop"].map((key) => (
                            <Area
                              key={key}
                              dataKey={key}
                              type="natural"
                              fill={`var(--color-${key})`}
                              fillOpacity={key === "other" ? 0.1 : 0.4}
                              stroke={`var(--color-${key})`}
                              stackId="a"
                            />
                          ))}
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
            </section>
          </TabsContent>

          <TabsContent value="starter">
            <Starter />
          </TabsContent>

          <TabsContent value="updates">
            <FutureUpdatesCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
