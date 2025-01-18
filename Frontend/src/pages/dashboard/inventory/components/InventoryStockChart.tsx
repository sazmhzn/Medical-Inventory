import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

const InventoryStockChart = ({ itemDetails }) => {
  if (!itemDetails) return null;

  // For this example, we'll use some assumed values
  const calculateEOQ = () => {
    const annualDemand = itemDetails.stock * 12; // Assuming current stock represents monthly demand
    const orderCost = 100; // Assumed fixed cost per order
    const holdingCost = itemDetails.price * 0.2; // Assumed 20% of unit price as holding cost

    const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
    return Math.round(eoq);
  };

  const eoqLevel = calculateEOQ();

  const data = [
    {
      name: itemDetails.name,
      "Current Stock": itemDetails.stock,
      "Reorder Level": itemDetails.reorder,
      EOQ: eoqLevel,
    },
  ];

  // Custom tooltip to show all values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{itemDetails.name}</p>
          <p className="text-sm">Current Stock: {payload[0].value}</p>
          <p className="text-sm text-amber-600">
            Reorder Level: {itemDetails.reorder}
          </p>
          <p className="text-sm text-blue-600">EOQ: {eoqLevel}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Stock Level Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="Current Stock"
                fill={
                  itemDetails.stock <= itemDetails.reorder
                    ? "#ef4444"
                    : "#22c55e"
                }
                radius={[4, 4, 0, 0]}
              />
              <ReferenceLine
                y={itemDetails.reorder}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{
                  value: "Reorder Level",
                  position: "right",
                  fill: "#f59e0b",
                }}
              />
              <ReferenceLine
                y={eoqLevel}
                stroke="#3b82f6"
                strokeDasharray="5 5"
                label={{
                  value: "EOQ",
                  position: "left",
                  fill: "#3b82f6",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-lg font-medium">{itemDetails.stock}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600">Reorder Level</p>
            <p className="text-lg font-medium text-amber-700">
              {itemDetails.reorder}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Economic Order Quantity</p>
            <p className="text-lg font-medium text-blue-700">{eoqLevel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStockChart;
