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
} from "recharts";

const InventoryStockChart = ({ itemDetails }) => {
  if (!itemDetails) return null;

  const data = [
    {
      name: itemDetails.name,
      "Current Stock": itemDetails.stock,
      "Reorder Level": itemDetails.reorder,
    },
  ];

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
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStockChart;
